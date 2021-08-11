import React, { useState } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Highlight } from "react-instantsearch-dom";
import axios from "axios";
import { USER_MAINS_URL } from "../constants/constants";

export default function HitPyqs(props) {

  var userID = null,
    userMains = [];
  var qNumber = "";
  try {
    userID = localStorage.getItem("userID");
    var userMainsObj = localStorage.getItem("userMains").split(" - ");
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
          </div>
        )}
      </div>
    );
}
