import React, { useState } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Highlight } from "react-instantsearch-dom";
import axios from "axios";
import { USER_MAINS_URL } from "../constants/constants";

export default function HitPyqs(props) {

  var userID = null,
    userMains = null;
    var qNumber = "";
    try {
      userID = localStorage.getItem("userID");
      userMains = localStorage.getItem("userMains").split(" - ");
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
        })
        .then((response) => {
          localStorage.setItem("userMains", response.data.mains.join(" - "));
          console.log(response.data.mains.join(" - "));
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
