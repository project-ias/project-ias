import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import { parse } from "node-html-parser";
import { BACKEND_URL } from "../constants/constants";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Index,
  Highlight,
  RefinementList,
  connectHighlight,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const searchClient = instantMeiliSearch(
  "https://6e5aec93d8f8.ngrok.io",
  "masterKey"
);

export default function SearchPage() {
  const [pyqs, setPyqs] = useState([]);
  const [content, setContent] = useState([]);
  const [dnsContent, setDnsContent] = useState([]);
  const [examType, setExamType] = useState("prelims");
  const [materialType, setMaterialType] = useState("content");
  const [selectedIds, setSelectedIds] = useState([]);
  const [query, setQuery] = useState("");

  // marked ques
  const [mains, setMains] = useState({});

  function removePrevNext(htmlString) {
    let parsedHtml = parse(htmlString);
    parsedHtml.querySelector(".next-post").remove();
    return parsedHtml.toString();
  }

  const handleSolutionClick = (selectedId) => {
    if (selectedIds.indexOf(selectedId) === -1) {
      setSelectedIds((Ids) => [...Ids, selectedId]);
    } else {
      setSelectedIds((Ids) => Ids.filter((Id) => Id !== selectedId));
    }
  };

  function ReturnHitComponent(selectedType) {
    switch (selectedType) {
      case "prelims":
        return HitPrelims;
        break;
      case "pyqs":
        return HitPyqs;
        break;
      case "content":
        return HitDrishti;
        break;
      case "dns":
        return HitDNS;
        break;
    }
  }

  useEffect(() => {
    const DNS_URL = `${BACKEND_URL}/search_dns`;
    const CONTENT_URL = `${BACKEND_URL}/search_content`;
    const data = { query: query };

    if (materialType === "dns") {
      axios
        .post(DNS_URL, data)
        .then((res) => {
          setDnsContent(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    } else {
      axios
        .post(CONTENT_URL, data)
        .then((res) => {
          console.log("content res", res.data);
          setContent(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    }
  }, [materialType]);

  function HitPrelims(props) {
    let current_mains = mains;
    const Q = {};
    if (current_mains[props.hit.id] === undefined) {
      Q[props.hit.id] = {
        marked: "",
        answer: props.hit.answer,
      };

      current_mains = { ...current_mains, ...Q };
      setMains(current_mains);
      console.log(current_mains);
    }

    function markAns(ques_id, marked, answer) {
      const id = ques_id.toString();
      console.log("id is ", id);
      const changed = {};
      changed[id] = {
        marked: marked,
        answer: answer,
      };
      console.log("changed ", { ...mains, ...changed });
      setMains({ ...mains, ...changed });
    }

    return (
      <div>
        {props.hit.options == undefined ? (
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
            <Highlight attribute="question" hit={props.hit} />
            <div className="options">
              Options:
              {props.hit?.options?.map((item) => {
                return (
                  <div>
                    <input
                      type="radio"
                      value={item}
                      name={item}
                      onChange={(e) =>
                        markAns(props.hit.id, e.target.value, props.hit.answer)
                      }
                      checked={
                        mains[props.hit.id] !== undefined &&
                        item === mains[props.hit.id]["marked"]
                      }
                    />
                    <label for={item}>
                      {item}{" "}
                      {
                        // it should be defined and marked
                        mains[props.hit.id] !== undefined &&
                        mains[props.hit.id]["marked"] !== ""
                          ? item === mains[props.hit.id]["answer"]
                            ? "✔️"
                            : "❌"
                          : ""
                      }
                      {console.log(
                        "??",
                        mains[props.hit.id] &&
                          mains[props.hit.id]["marked"] ===
                            mains[props.hit.id]["answer"],
                        "for ",
                        props.hit.id
                      )}
                    </label>
                  </div>
                );
              })}
            </div>

            <div
              className="solution"
              onClick={() => handleSolutionClick(props.hit.id)}
            >
              <span className="show">
                {selectedIds.includes(props.hit.id)
                  ? "Hide Answer"
                  : "Show Answer"}
              </span>
              {selectedIds.includes(props.hit.id) &&
                ReactHtmlParser(props.hit.explanation)}
            </div>
          </>
        )}
      </div>
    );
  }

  function HitPyqs(props) {
    return (
      <>
        {props.hit.topics == undefined ? (
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

  function HitDNS(props) {
    return (
      <>
        {props.link === undefined && props?.hit?.link === undefined ? (
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
          <div className="dns-video">
            <h3 className="dns-title">{props.title || props?.hit?.title}</h3>
            <div className="dns-video-container">
              <iframe
                title={props.title || props?.hit?.title}
                src={
                  props.link ||
                  props?.hit?.link
                    .replace("/watch?v=", "/embed/")
                    .replace("&t=", "?start=")
                }
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        )}
      </>
    );
  }

  function HitDrishti(props) {
    return (
      <div>
        {props.content === undefined && props?.hit?.content === undefined ? (
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
              <a href={props.link || props?.hit?.link}>
                {props.title || props?.hit?.title}
              </a>{" "}
              ({props.exam || props?.hit?.exam})
            </h4>
            {ReactHtmlParser(
              removePrevNext(props.content || props?.hit?.content)
            )}
            <p>
              <strong>Topics:</strong>{" "}
              {props?.tags?.join(",") || props?.hit?.tags?.join(",")}
            </p>
            <br />
          </>
        )}
      </div>
    );
  }

  function handleChange(e) {
    setQuery(e.target.value);
    const data = { query: e.target.value };
    const PYQ_URL = `${BACKEND_URL}/search_pyq`;
    const DNS_URL = `${BACKEND_URL}/search_dns`;
    const LOG_URL = `${BACKEND_URL}/log`;
    const CONTENT_URL = `${BACKEND_URL}/search_content`;

    // if(query !== ""){
    // console.log("Non empty query", query);
    if (materialType === "dns") {
      axios
        .post(DNS_URL, data)
        .then((res) => {
          setDnsContent(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    } else {
      axios
        .post(CONTENT_URL, data)
        .then((res) => {
          console.log("content res", res.data);
          setContent(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    }

    // Logging
    const log = {
      query_data: {
        query: query,
        type: examType,
        time: new Date().toString(),
      },
    };
    axios
      .post(LOG_URL, log)
      .then((res) => {
        console.log("res", res.data);
      })
      .catch((err) => {
        console.log("err is ", err);
      });
  }

  function debounce(func, timeout = 250) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const processChange = debounce((e) => handleChange(e));

  return (
    <div className="main">
      <h2 className="title">Project IAS</h2>
      <h3 className="subtitle" style={{ textAlign: "center" }}>
        Search through PYQs, DNS & Reading Content{" "}
      </h3>

      <InstantSearch indexName={examType} searchClient={searchClient}>
        <SearchBox
          onChange={processChange}
          submit={
            <svg
              width="175"
              height="175"
              viewBox="0 0 175 175"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.1515 32.1515C23.6365 40.6851 18.8543 52.2479 18.8543 64.3031C18.8543 76.3583 23.6365 87.9211 32.1516 96.4546C37.2446 101.547 43.4751 105.355 50.3295 107.566C57.1838 109.777 64.4655 110.327 71.574 109.17C78.1433 108.121 84.3997 105.633 89.896 101.885L114.939 126.928C117.14 125.146 119.245 123.25 121.247 121.247C123.25 119.245 125.146 117.14 126.928 114.939L101.885 89.896C105.633 84.3997 108.121 78.1433 109.17 71.574C110.327 64.4655 109.777 57.1838 107.566 50.3295C105.355 43.4751 101.547 37.2446 96.4547 32.1516C87.9211 23.6365 76.3583 18.8543 64.3031 18.8543C52.2479 18.8543 40.6851 23.6365 32.1515 32.1515ZM92.2374 58.6401C93.5364 65.0696 92.5892 71.7501 89.554 77.565C88.2155 80.1086 86.5 82.4352 84.4657 84.4657C82.4352 86.5 80.1086 88.2155 77.565 89.554C71.7501 92.5892 65.0696 93.5364 58.6401 92.2373C53.1441 91.1394 48.0977 88.4346 44.1405 84.4657C38.8009 79.1141 35.8021 71.8629 35.8021 64.3031C35.8021 56.7432 38.8009 49.4921 44.1405 44.1405C49.4921 38.8008 56.7432 35.8021 64.3031 35.8021C71.8629 35.8021 79.1141 38.8009 84.4657 44.1405C88.4346 48.0977 91.1394 53.1441 92.2374 58.6401Z"
                fill="white"
              />
              <path
                d="M86.3381 123.934L99.2579 136.854C69.2891 151.265 32.1762 146.064 7.35907 121.247C5.76924 119.657 4.8761 117.501 4.8761 115.253C4.8761 113.004 5.76924 110.848 7.35907 109.258C8.94891 107.668 11.1052 106.775 13.3535 106.775C15.6019 106.775 17.7582 107.668 19.348 109.258C27.9488 117.843 38.8272 123.787 50.6979 126.388C62.5686 128.988 74.9357 128.137 86.3381 123.934Z"
                fill="white"
              />
              <path
                d="M121.247 7.35911C146.064 32.1763 151.265 69.2891 136.854 99.258L123.934 86.3381C128.137 74.9358 128.988 62.5687 126.388 50.6979C123.787 38.8272 117.843 27.9489 109.258 19.3481C107.668 17.7582 106.775 15.6019 106.775 13.3536C106.775 11.1052 107.668 8.94895 109.258 7.35911C110.848 5.76928 113.004 4.87614 115.253 4.87614C117.501 4.87614 119.657 5.76928 121.247 7.35911Z"
                fill="white"
              />
            </svg>
          }
        />

        <div className="mobile-view">
          <div className="types">
            <div
              className={`type ${examType === "prelims" && "current"}`}
              onClick={() => setExamType("prelims")}
            >
              Prelims
            </div>
            <div
              className={`type ${examType === "pyqs" && "current"}`}
              onClick={() => setExamType("pyqs")}
            >
              Mains
            </div>
            <div
              className={`type ${examType === "content" && "current"}`}
              onClick={() => setExamType("content")}
            >
              Read
            </div>
            <div
              className={`type ${examType === "dns" && "current"}`}
              onClick={() => setExamType("dns")}
            >
              DNS
            </div>
          </div>

          <Hits hitComponent={ReturnHitComponent(examType)} />
        </div>

        <div className="results">
          <div className="division">
            <div className="types">
              <div
                className={`type ${examType === "prelims" && "current"}`}
                onClick={() => setExamType("prelims")}
              >
                Prelims
              </div>
              <div
                className={`type ${examType === "pyqs" && "current"}`}
                onClick={() => setExamType("pyqs")}
              >
                Mains
              </div>
            </div>

            <Hits hitComponent={ReturnHitComponent(examType)} />
          </div>

          <div className="division">
            <div className="types">
              <div
                className={`type ${materialType === "dns" && "current"}`}
                onClick={() => setMaterialType("dns")}
              >
                DNS
              </div>
              <div
                className={`type ${materialType === "content" && "current"}`}
                onClick={() => setMaterialType("content")}
              >
                Read
              </div>
            </div>
            <div>
              {materialType === "dns"
                ? dnsContent.map((hit) => (
                    <div className="card-result">
                      <HitDNS link={hit.link} title={hit.title} />
                    </div>
                  ))
                : content.map((hit) => (
                    <div className="card-result">
                      <HitDrishti
                        content={hit.content}
                        exam={hit.link}
                        link={hit.link}
                        tags={hit.tags}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
