import { parse } from "node-html-parser";
import React from "react";
import ReactHtmlParser from "react-html-parser";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function removePrevNext(htmlString) {
  let parsedHtml = parse(htmlString);
  parsedHtml.querySelector(".next-post").remove();
  [].forEach.call(parsedHtml.querySelectorAll("a"), (a) => {
    const rawAttrsArr = a.rawAttrs.split(" ");
    if (rawAttrsArr[0].includes("href") && !rawAttrsArr[0].includes("http"))
      rawAttrsArr[0] = rawAttrsArr[0].replace(
        'href="',
        'href="https://www.drishtiias.com'
      );
    a.rawAttrs = rawAttrsArr.join(" ");
  });
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
