import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Highlight } from "react-instantsearch-dom";

export default function HitPyqs(props) {
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
  console.log("Chirag2 : " + topicArr.join(";"));
  return (
    <>
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
        </div>
      )}
    </>
  );
}
