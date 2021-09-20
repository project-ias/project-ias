import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LOG_URL,
  CONTENT_URL,
  DNS_URL,
  SEARCHCLIENT_URL,
  WFV_URL,
  VISION_URL,
  USER_URL,
} from "../constants/constants";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  Stats,
  Pagination,
} from "react-instantsearch-dom";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/free-solid-svg-icons";
import { faArrowUp, faBars } from "@fortawesome/free-solid-svg-icons";
import Session from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import searchLogo from "../logo.svg";

import HitDrishti from "./HitDrishti";
import HitDNS from "./HitDNS";
import HitPyqs from "./HitPyqs";
import HitPrelims from "./HitPrelims";
import HitSecure from "./HitSecure";
import HitVision from "./HitVision";
import HitWFV from "./HitWFV";
import Dashboard from "./Dashboard";
import useWindowDimensions from "./WindowDimensions";
import subscription from "../helpers/subscription";

const searchClient = instantMeiliSearch(SEARCHCLIENT_URL, "masterKey");

export default function SearchPage() {

  const history = useHistory();
  const location = useLocation();
  Session.addAxiosInterceptors(axios);

  var urlParams = new URLSearchParams(location.search);
  const {width} = useWindowDimensions();
  const currentUserEmail = localStorage.getItem("userEmail") || "";

  const [content, setContent] = useState([]);
  const [dnsContent, setDnsContent] = useState([]);
  const [examType, setExamType] = useState(urlParams.get("exam") || "pyqs");
  const [materialType, setMaterialType] = useState(urlParams.get("material") || "content");
  const [query, setQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  //Supertokens logout
  const onLogout = async () => {
    localStorage.removeItem("userEmail");
    await signOut();
    window.location.href = "/auth";
  };

  function ReturnHitComponent(selectedType) {
    switch (selectedType) {
      case "prelims_sheet":
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
        case "vision":
          return HitVision;
      default:
        return null;
    }
  }

  //to check for trial and subscription
  useEffect(() => {
    if(currentUserEmail !== null && currentUserEmail !== "") {
      const payDate = localStorage.getItem("payDate");
      if(!subscription(payDate)) {
        window.location.href = "/payment";
      }
    }
  }, []);

  //Exam type is left tab in desktop. in mobiles it is the only tab shown.
  useEffect(() => {
    if(width > 1000) {
      var urlParams = new URLSearchParams(location.search);
      var tempExamMode = urlParams.get("exam");
      if(tempExamMode !== "pyqs" && tempExamMode !== "prelims_sheet" && tempExamMode !== "secure") {
        setExamType("pyqs");
        setMaterialType(tempExamMode || "content");
    }
    }
  }, [width]);

  useEffect(() => {
    try {
      var urlParams = new URLSearchParams(location.search);
      setQuery(urlParams.get('query'));
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
    } else if (materialType === "vision") {
      axios
        .post(VISION_URL, data)
        .then((res) => {
          setContent(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    }
     else {
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

  useEffect(() => {
    var urlParams = new URLSearchParams(location.search);
    urlParams.set('exam', examType);
    urlParams.set('material', materialType);
    history.push(`/?${urlParams || ""}`);
  },[examType, materialType])

  function handleChange(e) {
    e.preventDefault();
    var data = { query: "" };
    if (e.target.value === undefined || e.target.value === null) {
      setQuery("");
      data = { query: "" };
    } else {
      setQuery(e.target.value);
      data = { query: e.target.value };
    }

    if(performance.now() - parseFloat(localStorage.getItem("timeNow")) > 5000) {
      localStorage.setItem("searchCount", parseInt(localStorage.getItem("searchCount")) + 1);
    }

    localStorage.setItem("timeNow", performance.now());

    if(localStorage.getItem("searchCount") > 100 && (currentUserEmail === "" || currentUserEmail === null)) {
      localStorage.setItem("trial", "expired");
      history.go("/auth");
    }


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
    } else if (materialType === "vision") {
      axios
        .post(VISION_URL, data)
        .then((res) => {
          setContent(res.data.hits);
        })
        .catch((err) => {
          console.log("err is ", err);
        });
    }
     else {
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

    var urlParams = new URLSearchParams(location.search);
    urlParams.set('query', e.target.value || "");
    history.push(`/?${urlParams || ""}`);
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

  const stats = (
    <Stats
      translations={{
        stats(nbHits) {
          if (nbHits !== 0 && query !== null && query.length !== 0)
            return `(${nbHits.toLocaleString()})`;
          else return null;
        },
      }}
    />
  );

  const dashboard = showMenu ? (
    <Dashboard
      hide={() => {
        setShowMenu(!showMenu);
      }}
      email={currentUserEmail}
    ></Dashboard>
  ) : null;

  const pagination = (
    <Pagination
            defaultRefinement={1}
            padding={1}
            translations={{
              previous: "<",
              next: ">",
              first: "<<",
              last: ">>",
              page(currentRefinement) {
                return currentRefinement;
              },
              ariaPrevious: "Previous page",
              ariaNext: "Next page",
              ariaFirst: "First page",
              ariaLast: "Last page",
              ariaPage(currentRefinement) {
                return `Page ${currentRefinement}`;
              },
            }}
          />
  );

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
          <button
            className="current-user-auth-btn"
            onClick={onLogout}
          >
            {(currentUserEmail !== null && currentUserEmail !== "") ? "Log Out" : "Log In"}
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
            <img src={searchLogo} className="search-logo" alt="search-logo"/>
          }
        />
        {width <= 1000 && <div className="mobile-view">
          {pagination}
          <div className="types">
            <div
              className={`type ${examType === "pyqs" && "current"}`}
              onClick={() => setExamType("pyqs")}
            >
              Mains {examType === "pyqs" ? stats : null}
            </div>
            <div
              className={`type ${examType === "prelims_sheet" && "current"}`}
              onClick={() => setExamType("prelims_sheet")}
            >
              Prelims {examType === "prelims_sheet" ? stats : null}
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

          {examType === "content" || examType === "wfv" || examType === "vision" ? (
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
              <div
                className={`type ${examType === "vision" && "current"}`}
                onClick={() => setExamType("vision")}
              >
                Vision Monthly
              </div>
            </div>
          ) : null}

          <Hits hitComponent={ReturnHitComponent(examType)} />
            {pagination}

        </div>}
        {width > 1000 && <div className="results">
          <div className="division">
            <div className="types">
              <div
                className={`type ${examType === "pyqs" && "current"}`}
                onClick={() => setExamType("pyqs")}
              >
                Mains {examType === "pyqs" ? stats : null}
              </div>
              <div
                className={`type ${examType === "prelims_sheet" && "current"}`}
                onClick={() => setExamType("prelims_sheet")}
              >
                Prelims {examType === "prelims_sheet" ? stats : null}
              </div>
              <div
                className={`type ${examType === "secure" && "current"}`}
                onClick={() => setExamType("secure")}
              >
                Secure {examType === "secure" ? stats : null}
              </div>
            </div>

            {pagination}

            <Hits hitComponent={ReturnHitComponent(examType)} />

            {pagination}
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
                  (materialType === "content" || materialType === "wfv" || materialType === "vision") &&
                  "current"
                }`}
                onClick={() => setMaterialType("content")}
              >
                Read
              </div>
            </div>
            {materialType === "content" || materialType === "wfv" || materialType === "vision" ? (
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
                <div
                  className={`type ${materialType === "vision" && "current"}`}
                  onClick={() => setMaterialType("vision")}
                >
                  Vision Monthly
                </div>
              </div>
            ) : null}
            <div>
              {materialType === "dns"
                && dnsContent.map((hit) => (
                    <div className="card-result">
                      <HitDNS hit={hit} />
                    </div>
                  )) }
                { materialType === "content"
                && content.map((hit) => (
                    <div className="card-result">
                      <HitDrishti hit={hit} />
                    </div>
                  )) }
                { materialType === "wfv"
                && content.map((hit) => (
                    <div className="card-result">
                      <HitWFV hit={hit} />
                    </div>
                  ))}
                { materialType === "vision"
                && content.map((hit) => (
                    <div className="card-result">
                      <HitVision hit={hit} />
                    </div>
                  ))}
            </div>
          </div>
        </div>}
      </InstantSearch>
      <a href="#top" className="back-to-top"><FontAwesomeIcon icon={faArrowUp}/></a>
    </div>
  );
}
