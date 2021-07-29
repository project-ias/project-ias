import React, { useState } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Highlight } from "react-instantsearch-dom";
import axios from "axios";
import { USER_PRELIMS_URL } from "../constants/constants";

export default function HitPyqs(props) {
  const userID = localStorage.getItem("userID");
  const userMains = localStorage.getItem("userMains");
  const [solved, setSolved] = useState(
    userMains !== undefined && userMains.includes(props.hit["id"])
  );
  var pyqCardClass = "";
  if (solved) pyqCardClass = "card-solved";
  var topicArr = [];
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
  const completeCheckHandler = (solvedState) => {
    axios
      .post(USER_PRELIMS_URL, {
        userID: userID,
        questionID: props.hit["id"],
        isSolved: solvedState,
      })
      .then((response) => {
        console.log(response.data);
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
          <Highlight attribute="question" hit={props.hit} />(
          {/* {props.hit.question} */}
          {props.hit["year"]})
          <p>
            <strong>Topics:</strong> {topicArr.join(";")}
          </p>
          <span> Exam Type: {props.hit["exam"]} </span>
          <div className="pyqs-solved-toggle">
            <label className="pyqs-solved-toggle-text">Solved ?</label>
            <input
              type="checkbox"
              className="pyqs-solved-toggle-check"
              onChange={() => completeCheckHandler(solved)}
            ></input>
          </div>
        </div>
      )}
    </div>
  );
}
