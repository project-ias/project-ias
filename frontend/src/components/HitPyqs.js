import React, { useState } from "react";
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
    userMainsObj = localStorage.getItem("userMains").split(" - ");
    userMainsObj = userMainsObj.map((temp) => {
      const tempMainsDetails = temp.split(" | ");
      userMains.push(tempMainsDetails[0]);
      return {
        questionID: tempMainsDetails[0],
        date: tempMainsDetails[1],
        hasRevised: tempMainsDetails[2],
      };
    });
  } catch {}
  const [solved, setSolved] = useState(
    userMains !== undefined &&
      userMains !== null &&
      userMains.includes(props.hit["id"])
  );
  var revisionCount = 0;

  try {
    if (!solved) {
      solvedDate = [...todayDate];
    } else {
      const tempRevisionCount =
        userMainsObj[userMains.findIndex((id) => id === props.hit["id"])]
          .hasRevised;
      if (!tempRevisionCount) revisionCount = 0; //solving the problem that initially revisionCount is saved as false in database instead of 0.
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

  const [revised, setRevised] = useState(() => {
    var tempRevisedState = true;

    if (revisionInterval > 2 && revisionCount < 1) tempRevisedState = false;
    else if (revisionInterval > 7 && revisionCount < 2)
      tempRevisedState = false;
    else if (revisionInterval > 15 && revisionCount < 3)
      tempRevisedState = false;
    else if (revisionInterval > 35 && revisionCount < 4)
      tempRevisedState = false;

    return tempRevisedState;
  });

  var pyqCardClass = "";
  if (solved) pyqCardClass = "card-solved";
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
  const completeCheckHandler = (solvedState) => {
    axios
      .post(USER_MAINS_URL, {
        userID: userID,
        questionID: props.hit["id"],
        isSolved: !solvedState,
        hasRevised: false,
      })
      .then((response) => {
        const userMainsString = response.data.mains.map((temp) => {
          return temp.questionID + " | " + temp.date + " | " + temp.hasRevised;
        });
        localStorage.setItem("userMains", userMainsString.join(" - "));
        console.log(userMainsString.join(" - "));
      })
      .catch((err) => console.log(err));
    setSolved(!solvedState);
  };
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
              onChange={() => completeCheckHandler(solved)}
              defaultChecked={solved}
            ></input>
          </div>
          {revised
            ? null
            : `You solved this ${revisionInterval} days ago. Solve again to remember.`}
        </div>
      )}
    </div>
  );
}
