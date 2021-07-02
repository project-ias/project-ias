import React, { useState } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import { parse } from "node-html-parser";
import { BACKEND_URL } from "../constants/constants";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

const searchClient = instantMeiliSearch("http://localhost:7700", "masterKey");

export default function SearchPage() {
  const [pyqs, setPyqs] = useState([]);
  const [content, setContent] = useState([]);
  const [examType, setExamType] = useState("Prelims");
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

  function Hit(props) {
    console.log("props is ", props);
    return (
      <div>
        <div className="question">{props.hit.question}</div>
        <div className="options">
          Options:
          {props.hit.options.map((item) => {
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
      <div className="types">
        <div
          className={`type ${examType === "Prelims" && "current"}`}
          onClick={() => setExamType("Prelims")}
        >
          Prelims
        </div>
        <div
          className={`type ${examType === "Mains" && "current"}`}
          onClick={() => setExamType("Mains")}
        >
          Mains
        </div>
      </div>

      <InstantSearch indexName="prelims" searchClient={searchClient}>
        <SearchBox />
        {/* <RefinementList attribute="exam" /> */}
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
  // return(
  //     <InstantSearch
  //     indexName="pyqs"
  //     searchClient={searchClient}
  //   >
  //     <SearchBox />
  //     <RefinementList attribute="exam" />
  //     <Hits hitComponent={Hit} />
  //   </InstantSearch>
  // )
}
