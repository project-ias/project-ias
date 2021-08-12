import React, { useEffect, useState } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Highlight } from "react-instantsearch-dom";
import axios from "axios";
import { USER_MAINS_URL } from "../constants/constants";

export default function HitPyqs(props) {
  const today = new Date();
  const todayDate = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  ];
  var solvedDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()];

  var userID = null,
    userMains = [],
    userMainsObj = {};
  var qNumber = "";
  try {
    userID = localStorage.getItem("userID");
    userMainsObj = JSON.parse(localStorage.getItem("userMains"));
    userMains = userMainsObj.map((item) => item.questionID);
  } catch {}

  const [solved, setSolved] = useState(false);
  var revisionCount = 0;

  try {
    if (!solved) {
      solvedDate = [...todayDate];
    } else {
      const tempRevisionCount =
        userMainsObj[userMains.findIndex((id) => id === props.hit["id"])]
          .hasRevised;
      if (tempRevisionCount === false) revisionCount = 0;
      //solving the problem that initially revisionCount is saved as false in database instead of 0.
      else revisionCount = tempRevisionCount;
      solvedDate =
        userMainsObj[
          userMains.findIndex((id) => id === props.hit["id"])
        ].date.split("-");
    }
  } catch {}

  const revisionInterval =
    (todayDate[0] - solvedDate[0]) * 365 +
    (todayDate[1] - solvedDate[1]) * 30 +
    (todayDate[2] - solvedDate[2]);

  const [revised, setRevised] = useState(false);

  useEffect(() => {
    setSolved(
      userMains !== undefined &&
        userMains !== null &&
        userMains.includes(props.hit["id"])
    );

    var tempRevisedState = true;

    if (revisionInterval > 2 && revisionCount < 1) tempRevisedState = false;
    else if (revisionInterval > 7 && revisionCount < 2)
      tempRevisedState = false;
    else if (revisionInterval > 15 && revisionCount < 3)
      tempRevisedState = false;
    else if (revisionInterval > 35 && revisionCount < 4)
      tempRevisedState = false;

    setRevised(tempRevisedState);
  }, [props]);

  var pyqCardClass = "";
  if (solved) pyqCardClass = "card-solved";
  if (!revised) pyqCardClass = "card-revise";

  var topicArr = [];
  try {
    const length = props.hit["topics"].length;
    for (var i = 0; i < length; i++) {
      if (props.hit["topics"][i].mainTopic) {
        topicArr.push(
          props.hit["topics"][i].mainTopic +
            "(" +
            props.hit["topics"][i].subTopics.join(",") +
            ")"
        );
      }
    }
    qNumber = props.hit["qnumber"][2] + props.hit["qnumber"][3] + ") ";
  } catch {}

  const completeCheckHandler = (solvedState, revisionCount) => {
    axios
      .post(USER_MAINS_URL, {
        userID: userID,
        questionID: props.hit["id"],
        isSolved: !solvedState,
        hasRevised: revisionCount,
      })
      .then((response) => {
        const userMains = response.data.mains;
        localStorage.setItem("userMains", JSON.stringify(userMains));
      })
      .catch((err) => console.log(err));
    setSolved(!solvedState);
  };

  const reviseCheckHandler = () => {
    var revisionCount;
    if (revisionInterval > 35) revisionCount = 4;
    else if (revisionInterval > 15) revisionCount = 3;
    else if (revisionInterval > 7) revisionCount = 2;
    else revisionCount = 1;

    completeCheckHandler(false, revisionCount);
    setRevised(true);
  };

  var revisionDiv = null;

  if (!revised) {
    revisionDiv = (
      <div className="pyqs-revised-div">
        <div className="pyqs-revised-text">{`You solved this ${revisionInterval} days ago. Solve again to remember.`}</div>
        <div className="pyqs-solved-toggle">
          <label className="pyqs-solved-toggle-text">Solved Again ?</label>
          <input
            type="checkbox"
            className="pyqs-solved-toggle-check"
            onChange={() => reviseCheckHandler()}
            checked={revised}
          ></input>
        </div>
      </div>
    );
  }

  return (
    <div className={pyqCardClass}>
      {props.hit.topics === undefined ? (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          visible={true}
          style={{
            textAlign: "center",
          }}
        />
      ) : (
        <div>
          <strong>{qNumber}</strong>
          <Highlight attribute="question" hit={props.hit} />
          <p>
            <strong>Topics:</strong> {topicArr.join(";")}
          </p>
          <span>
            {" "}
            <strong>Exam Type:</strong> {props.hit["exam"]} {" ("}
            {props.hit["year"]}
            {")"}
          </span>
          <div className="pyqs-solved-toggle">
            <label className="pyqs-solved-toggle-text">Solved ?</label>
            <input
              type="checkbox"
              className="pyqs-solved-toggle-check"
              onChange={() => completeCheckHandler(solved, 0)}
              checked={solved}
            ></input>
          </div>
          {revisionDiv}
        </div>
      )}
    </div>
  );
}
