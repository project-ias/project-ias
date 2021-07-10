import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { Highlight } from "react-instantsearch-dom";

export default function HitPyqs(props) {
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
            <strong>Topics:</strong> {props.hit?.topics?.join(",")}
          </p>
          <span> Exam Type: {props.hit["exam"]} </span>
        </div>
      )}
    </>
  );
}
