import React, { useState } from "react";
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
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const searchClient = instantMeiliSearch(
  "https://6e5aec93d8f8.ngrok.io",
  "masterKey"
);

export default function SearchPage() {
  const [pyqs, setPyqs] = useState([]);
  const [content, setContent] = useState([]);
  const [examType, setExamType] = useState("prelims");
  const [selectedIds, setSelectedIds] = useState([]);

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
    }
  }

  function HitPrelims(props) {
    return (
      <div>
        <div className="question">{props.hit.question}</div>
        <div className="options">
          Options:
          {props.hit?.options?.map((item) => {
            return (
              <div>
                <input type="checkbox" value={item} name={item} />
                <label for={item}>{item}</label>
              </div>
            );
          })}
        </div>

        <div
          className="solution"
          onClick={() => handleSolutionClick(props.hit.id)}
        >
          <span className="show">
            {selectedIds.includes(props.hit.id) ? "Hide Answer" : "Show Answer"}
          </span>
          {selectedIds.includes(props.hit.id) &&
            ReactHtmlParser(props.hit.explanation)}
        </div>
      </div>
    );
    // return <Highlight attribute="name" hit={props.hit} />;
  }

  function HitPyqs(props) {
    return (
      <div>
        <div className="question">{props.hit.question}</div>({props.hit["year"]}
        )
        <p>
          <strong>Topics:</strong> {props.hit?.topics?.join(",")}
        </p>
        <span> Exam Type: {props.hit["exam"]} </span>
      </div>
    );
    // return <Highlight attribute="name" hit={props.hit} />;
  }

  function HitDrishti(props) {
    return (
      <div>
        <h4>
          <a href={props.hit.link}>{props.hit.title}</a> ({props.hit.exam})
        </h4>
        <div>
          {props.hit.content &&
            ReactHtmlParser(removePrevNext(props.hit.content))}
        </div>
        <p>
          <strong>Topics:</strong> {props.hit?.tags?.join(",")}
        </p>
        <br />
      </div>
    );
  }

  function handleChange(e) {
    console.log("e.", e.target.value);
    const query = e.target.value;
    const data = { query: query };
    const PYQ_URL = `${BACKEND_URL}/search_pyq`;
    const Content_URL = `${BACKEND_URL}/search_content`;

    if (query !== "") {
      console.log("Non empty query", query);
      axios
        .post(PYQ_URL, data)
        .then((res) => {
          console.log("res", res.data);
          setPyqs(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });

      axios
        .post(Content_URL, data)
        .then((res) => {
          console.log("content res", res.data);
          setContent(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    } else if (query === "") {
      setPyqs([]);
      setContent([]);
    }
  }

  function debounce(func, timeout = 300) {
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
      <h1 className="title">Project IAS</h1>

      {/* <input  onKeyUp={processChange}/>
                <h1>PYQ Mains</h1>
                        {pyqs &&
                            pyqs.map(item => (
                                <div key={item['id']}>
                                    <h4>{item['question']} ({item['year']})</h4>
                                    <div>{}</div>
                                    <p><strong>Topics:</strong> {item['topics'].join(',')}</p>
                                    <br/>
                                </div>
                            ))
                        }
                    
                    <h1>Dhristi IAS Content</h1>
                        {content &&
                            content.map(item => (
                                <div key={item['id']}>
                                    <h4><a href={item['link']}>{item['title']}</a> ({item['exam']})</h4>
                                    <div>{ReactHtmlParser(removePrevNext(item['content']))}</div>
                                    <p><strong>Topics:</strong> {item['tags'].join(',')}</p>
                                    <br/>
                                </div>
                            ))

                        } */}
      <InstantSearch indexName={examType} searchClient={searchClient}>
        <SearchBox />

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
        </div>

        <Hits hitComponent={ReturnHitComponent(examType)} />
      </InstantSearch>
    </div>
  );
}
