import React from "react";
import ReactHtmlParser from "react-html-parser";
import { parse } from "node-html-parser";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function removePrevNext(htmlString) {
  let parsedHtml = parse(htmlString);
  parsedHtml.querySelector(".next-post").remove();
  return parsedHtml.toString();
}

export default function HitDrishti(props) {
  return (
    <div>
      {props.hit.content === undefined ? (
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
        <>
          <h4>
            <a href={props.hit.link}>{props.hit.title}</a> ({props.hit.exam})
          </h4>
          {ReactHtmlParser(removePrevNext(props.hit.content))}
          <p>
            <strong>Topics:</strong> {props?.hit?.tags?.join(",")}
          </p>
          <br />
        </>
      )}
    </div>
  );
}
