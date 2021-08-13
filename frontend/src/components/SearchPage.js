import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LOG_URL,
  CONTENT_URL,
  DNS_URL,
  NGROK_URL,
  WFV_URL,
} from "../constants/constants";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  Stats,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useHistory, useLocation } from "react-router-dom";

import HitDrishti from "./HitDrishti";
import HitDNS from "./HitDNS";
import HitPyqs from "./HitPyqs";
import HitPrelims from "./HitPrelims";
import HitSecure from "./HitSecure";
import Dashboard from "./Dashboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import HitWFV from "./HitWFV";

const searchClient = instantMeiliSearch(NGROK_URL, "masterKey");

export default function SearchPage() {
  const [pyqs, setPyqs] = useState([]);
  const [content, setContent] = useState([]);
  const [dnsContent, setDnsContent] = useState([]);
  const [examType, setExamType] = useState("pyqs");
  const [materialType, setMaterialType] = useState("content");
  const [query, setQuery] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [showMenu, setShowMenu] = useState(false);

  const history = useHistory();
  const location = useLocation();

  // try {
  //   var temp = localStorage.getItem("userEmail");
  //   if (temp === null) temp = "";
  //   setCurrentUserEmail(temp);
  // } catch {}

  // for desktop
  const [mainsContent, setMainsContent] = useState([]);
  const [prelims, setPrelims] = useState([]);

  // updating marked questions saving scheme
  // try {
  //   const userMains = localStorage.getItem("userMains").split(" - ");
  //   if (
  //     userMains[0] !== undefined &&
  //     userMains[0] !== null &&
  //     !userMains[0].includes(" | ")
  //   ) {
  //     localStorage.clear();
  //   }
  // } catch {}

  function ReturnHitComponent(selectedType) {
    switch (selectedType) {
      case "prelims":
        return HitPrelims;
      case "pyqs":
        return HitPyqs;
      case "content":
        return HitDrishti;
      case "dns":
        return HitDNS;
      case "secure":
        return HitSecure;
      case "wfv":
        return HitWFV;
      default:
        return null;
    }
  }

  useEffect(() => {
    try {
      const tempQuery = location.search.replace("?", "").replace(/%20/gi, " ");
      setQuery(tempQuery);
    } catch (err) {
      console.log(err);
    }

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
    } else if (materialType === "wfv") {
      axios
        .post(WFV_URL, data)
        .then((res) => {
          setContent(res.data.hits);
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

    // for exam
    // for prelims and mains
    // if (examType === "prelims") {
    //   axios
    //     .post(PRELIMS_URL, data)
    //     .then((res) => {
    //       setPrelims(res.data.hits);
    //     })
    //     .catch((err) => {
    //       console.log("err is ", err);
    //     });
    // } else {
    //   axios
    //     .post(MAINS_URL, data)
    //     .then((res) => {
    //       setMainsContent(res.data.hits);
    //     })
    //     .catch((err) => {
    //       console.log("err is ", err);
    //     });
    // }
  }, [materialType]);

  function handleChange(e) {
    var data = { query: "" };
    if (e.target.value === undefined || e.target.value === null) {
      setQuery("");
      data = { query: "" };
    } else {
      setQuery(e.target.value);
      data = { query: e.target.value };
    }

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

    // for prelims and mains
    // if (examType === "prelims") {
    //   axios
    //     .post(PRELIMS_URL, data)
    //     .then((res) => {
    //       setPrelims(res.data.hits);
    //     })
    //     .catch((err) => {
    //       console.log("err is ", err);
    //     });
    // } else {
    //   axios
    //     .post(MAINS_URL, data)
    //     .then((res) => {
    //       setMainsContent(res.data.hits);
    //     })
    //     .catch((err) => {
    //       console.log("err is ", err);
    //     });
    // }

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

    history.push(`/?${e.target.value || ""}`);
  }

  function debounce(func, timeout = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const processChange = debounce((e) => handleChange(e));

  const currentUserChangeHandler = () => {
    if (currentUserEmail.length === 0) {
      history.push("/login");
    } else {
      localStorage.clear();
      setCurrentUserEmail("");
    }
  };

  const stats = (
    <Stats
      translations={{
        stats(nbHits) {
          if (nbHits !== 0 && query.length !== 0)
            return `(${nbHits.toLocaleString()})`;
          else return null;
        },
      }}
    />
  );

  var dashboard = null;

  if (showMenu) {
    dashboard = (
      <Dashboard
        hide={() => {
          setShowMenu(!showMenu);
        }}
        email={currentUserEmail}
      ></Dashboard>
    );
  }

  return (
    <div className="main">
      {dashboard}
      <div className="top-bar">
        <FontAwesomeIcon
          icon={faBars}
          className="menu-icon"
          onClick={() => setShowMenu(!showMenu)}
        />
        <div className="current-user">
          <div className="current-user-email">{currentUserEmail}</div>
          <button
            className="current-user-auth-btn"
            onClick={currentUserChangeHandler}
          >
            {currentUserEmail.length === 0 ? "Log in" : "Log Out"}
          </button>
        </div>
      </div>
      <h2 className="title">Project IAS</h2>
      <h3 className="subtitle" style={{ textAlign: "center" }}>
        Search through PYQs, DNS & Reading Content{" "}
      </h3>
      <InstantSearch indexName={examType} searchClient={searchClient}>
        <Configure hitsPerPage={25} />
        <SearchBox
          defaultRefinement={query}
          onChange={processChange}
          onReset={processChange}
          translations={{
            placeholder: "search citizen charter",
          }}
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
              className={`type ${examType === "pyqs" && "current"}`}
              onClick={() => setExamType("pyqs")}
            >
              Mains {examType === "pyqs" ? stats : null}
            </div>
            <div
              className={`type ${examType === "prelims" && "current"}`}
              onClick={() => setExamType("prelims")}
            >
              Prelims {examType === "prelims" ? stats : null}
            </div>
            <div
              className={`type ${examType === "secure" && "current"}`}
              onClick={() => setExamType("secure")}
            >
              Secure {examType === "secure" ? stats : null}
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

          {examType === "content" || examType === "wfv" ? (
            <div className="sub-types">
              <div
                className={`type ${examType === "wfv" && "current"}`}
                onClick={() => setExamType("wfv")}
              >
                Weekly Focus Vision
              </div>
              <div
                className={`type ${examType === "content" && "current"}`}
                onClick={() => setExamType("content")}
              >
                Drishti
              </div>
            </div>
          ) : null}

          <Hits hitComponent={ReturnHitComponent(examType)} />
        </div>
        <div className="results">
          <div className="division">
            <div className="types">
              <div
                className={`type ${examType === "pyqs" && "current"}`}
                onClick={() => setExamType("pyqs")}
              >
                Mains {examType === "pyqs" ? stats : null}
              </div>
              <div
                className={`type ${examType === "prelims" && "current"}`}
                onClick={() => setExamType("prelims")}
              >
                Prelims {examType === "prelims" ? stats : null}
              </div>
              <div
                className={`type ${examType === "secure" && "current"}`}
                onClick={() => setExamType("secure")}
              >
                Secure {examType === "secure" ? stats : null}
              </div>
            </div>

            <Hits hitComponent={ReturnHitComponent(examType)} />
            {/* {examType === "prelims"
              ? prelims.map((hit) => (
                  <div className="card-result">
                    <HitPrelims hit={hit} />
                  </div>
                ))
              : mainsContent.map((hit) => (
                  <div className="card-result">
                    <HitPyqs hit={hit} />
                  </div>
                ))} */}
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
                className={`type ${
                  (materialType === "content" || materialType === "wfv") &&
                  "current"
                }`}
                onClick={() => setMaterialType("content")}
              >
                Read
              </div>
            </div>
            {materialType === "content" || materialType === "wfv" ? (
              <div className="sub-types">
                <div
                  className={`type ${materialType === "wfv" && "current"}`}
                  onClick={() => setMaterialType("wfv")}
                >
                  Weekly Focus Vision
                </div>
                <div
                  className={`type ${materialType === "content" && "current"}`}
                  onClick={() => setMaterialType("content")}
                >
                  Drishti
                </div>
              </div>
            ) : null}
            <div>
              {materialType === "dns"
                ? dnsContent.map((hit) => (
                    <div className="card-result">
                      <HitDNS hit={hit} />
                    </div>
                  ))
                : materialType === "content"
                ? content.map((hit) => (
                    <div className="card-result">
                      <HitDrishti hit={hit} />
                    </div>
                  ))
                : content.map((hit) => (
                    <div className="card-result">
                      <HitWFV hit={hit} />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
