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
  const [examType, setExamType] = useState("prelims");
  const [selectedIds, setSelectedIds] = useState([]);

  // marked ques
  const [mains, setMains] = useState({})

  // DNS
  const [dnsTitle, setDNSTitle] = useState("");
  const [dnsLink, setDNSLink] = useState("");

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
    
    let current_mains = mains
    const Q = {}
    if(current_mains[props.hit.id] === undefined) {
      Q[props.hit.id] = {
        'marked': '',
        'answer': props.hit.answer
      }

    current_mains = {...current_mains, ...Q}
    setMains(current_mains)
    console.log(current_mains)
   }

   function markAns(ques_id, marked, answer) {
    const id = ques_id.toString()
    console.log("id is ",id)
    const changed = {}
    changed[id] = {
      'marked': marked,
      'answer': answer
    }
    console.log("changed ",{...mains, ...changed})
    setMains({...mains, ...changed})
   } 


    return (
      <div>
        {props.hit.options == undefined ? 
          <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          visible={true} 
          style = {{
            textAlign: 'center'
          }}
        />
        : 
        <>
          <Highlight attribute="question" hit={props.hit} />
        <div className="options">
          Options:
          {props.hit?.options?.map((item) => {
            return (
              <div>
                <input type="radio" value={item} name={item} onChange={e => markAns(props.hit.id,e.target.value, props.hit.answer)} checked={ mains[props.hit.id] !== undefined && item === mains[props.hit.id]['marked']}/>
                <label for={item}>{item} {
                  // it should be defined and marked
                  mains[props.hit.id] !== undefined && mains[props.hit.id]['marked'] !== '' ?
                     item === mains[props.hit.id]['answer'] ? '✔️' : '❌'
                  : ''
                }
                {console.log("??",mains[props.hit.id] && mains[props.hit.id]['marked'] === mains[props.hit.id]['answer'], "for ", props.hit.id)}
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
            {selectedIds.includes(props.hit.id) ? "Hide Answer" : "Show Answer"}
          </span>
          {selectedIds.includes(props.hit.id) &&
            ReactHtmlParser(props.hit.explanation)}
        </div>
        </>}
      </div>
    );
    // return <Highlight attribute="name" hit={props.hit} />;
  }

  function HitPyqs(props) {
    return (
      <>
        {props.hit.topics == undefined ? 
        <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            visible={true} 
            style = {{
              textAlign: 'center'
            }}
          />
          :
        <div>
          <Highlight attribute="question" hit={props.hit} />({props.hit["year"]})
          <p>
            <strong>Topics:</strong> {props.hit?.topics?.join(",")}
          </p>
          <span> Exam Type: {props.hit["exam"]} </span>
        </div>}
      </>
    );
    // return <Highlight attribute="name" hit={props.hit} />;
  }

  // const CustomHighlight = connectHighlight(({ highlight, attribute, hit }) => {
  //   const parsedHit = highlight({
  //     highlightProperty: "_highlightResult",
  //     attribute,
  //     hit,
  //   });

  //   return (
  //     <div>
  //       {ReactHtmlParser(hit.content).map((part) =>
  //         part.isHighlighted ? (
  //           <em className="ais-Highlight-highlighted">
  //             {ReactHtmlParser(part.value)}
  //           </em>
  //         ) : (
  //           ReactHtmlParser(part.value)
  //         )
  //       )}
  //     </div>
  //   );
  // });

  function HitDrishti(props) {
    return (
        <div>
        {props.hit.content === undefined ?  <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            visible={true} 
            style = {{
              textAlign: 'center'
            }}
          /> : props.hit.content && 
          <>
          <h4>
            <a href={props.hit.link}>{props.hit.title}</a> ({props.hit.exam})
          </h4>
          {ReactHtmlParser(removePrevNext(props.hit.content))}
          <p>
            <strong>Topics:</strong> {props.hit?.tags?.join(",")}
          </p>
           <br />
          </> } 
        </div>
    );
  }

  function handleChange(e) {
    const query = e.target.value;
    const data = { query: query };
    const PYQ_URL = `${BACKEND_URL}/search_pyq`;
    const DNS_URL = `${BACKEND_URL}/search_dns`;
    const LOG_URL = `${BACKEND_URL}/log`
    const Content_URL = `${BACKEND_URL}/search_content`;

    if (query !== "") {
      console.log("Non empty query", query);
      axios
        .post(DNS_URL, data)
        .then((res) => {
          try {
            console.log("res", res.data.hits[0].title);
            console.log(
              "res",
              res.data.hits[0].link
                .replace("/watch?v=", "/embed/")
                .replace("&t=", "?start=")
            );

            setDNSLink(
              res.data.hits[0].link
                .replace("/watch?v=", "/embed/")
                .replace("&t=", "?start=")
            );
            setDNSTitle(res.data.hits[0].title);
          } catch (e) {
            setDNSLink("");
            setDNSTitle("");
          }
        })
        .catch((err) => {
          console.log("err is ", err);
        });

      // Logging
      const log = {
        'query_data': {
          'query': query,
          'type': examType,
          'time': new Date().toString()
        }
      }
      axios
        .post(LOG_URL, log)
        .then(res => {
          console.log('res',res.data)
        })
        .catch(err => {
          console.log("err is ",err)
        })

      // ENDPOINTS DEPRACATED
      // axios
      //   .post(PYQ_URL, data)
      //   .then((res) => {
      //     console.log("res", res.data);
      //     setPyqs(res.data.hits);
      //   })
      //   .catch((err) => {
      //     console.log("err is ", err);
      //   });

      // axios
      //   .post(Content_URL, data)
      //   .then((res) => {
      //     console.log("content res", res.data);
      //     setContent(res.data.hits);
      //   })
      // .catch((err) => {
      //   console.log("err is ", err);
      // });
    } else if (query === "") {
      setPyqs([]);
      setContent([]);
    }
  }

  function debounce(func, timeout = 100) {
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
        <SearchBox onChange={processChange} />


       

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

        {dnsLink !== "" && (
          <div className="dns-video">
            <h3 className="dns-title">{dnsTitle}</h3>
            <div className="dns-video-container">
              <iframe
                title={dnsTitle}
                src={dnsLink}
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        )}

        <Hits hitComponent={ReturnHitComponent(examType)} />
           
      </InstantSearch>
    </div>
  );
}
