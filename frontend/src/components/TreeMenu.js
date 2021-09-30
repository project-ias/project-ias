import {
  faCaretSquareRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { updateSearchCountDashboard } from "../helpers/trialPeriod";

const TreeMenu = ({ data = [] }) => {
  return (
    <div className="tree-menu-root">
      <ul className="tree-menu-column">
        {data.map((tree) => {
          return <TreeNode node={tree} />;
        })}
      </ul>
    </div>
  );
};

const TreeNode = ({ node }) => {
  const history = useHistory();
  const location = useLocation();
  const [childVisible, setChildVisible] = useState(
    node.category === "examType" ? true : false
  );
  var label = node.label;
  const hasChild = node.children ? true : false;
  const showPercentage =
    (node.category === "examSubType" || node.category === "mainTopic") &&
    localStorage.getItem("userEmail");
  var percentSolved = 0,
    totalQuestions = 0;
  var pathColor = "red";

  if (label === null || label === undefined) label = node;

  var userMains;

  if (showPercentage) {
    try {
      userMains = localStorage.getItem("userMains") || "[]";
      userMains = JSON.parse(userMains).map((item) => item.questionID);
    } catch (err) {
      userMains = [];
    }

    if(node.category === "mainTopic") console.log(node.questions)

    var temp = 0;
    for (var i = 0; i < userMains.length; i++) {
      if (node.category === "mainTopic") {
        if (node.questions.includes(userMains[i])) temp++;
        totalQuestions = node.questions.length;
      } else {
        for (var j = 0; j < node.children.length; j++) {
          if (node.children[j].questions.includes(userMains[i])) temp++;
          totalQuestions += node.children[j].questions.length;
        }
      }
    }

    if (userMains.length === 0) {
      if (node.category === "mainTopic") {
        totalQuestions = node.questions.length;
      } else {
        for (j = 0; j < node.children.length; j++) {
          totalQuestions += node.children[j].questions.length;
        }
      }
    }

    if (node.category === "examSubType" && userMains.length !== 0)
      totalQuestions /= userMains.length; //in case of examSubType, the questions get added multiple times as it is put inside the userMains for loop.
    percentSolved = Math.floor((temp * 100) / totalQuestions);
    if (percentSolved < 30) pathColor = "red";
    else pathColor = "green";
  }

  const topicSelectHandler = (query) => {
    if (node.category === "examType") return;
    var urlParams = new URLSearchParams(location.search);
    urlParams.set("query", query);
    urlParams.set("exam", "pyqs");
    updateSearchCountDashboard();
    history.push(`/?${urlParams}`);
    history.go(`/?${urlParams}`);
  };

  return (
    <li className="tree-menu-list">
      <div className="tree-menu-item">
        {hasChild && (
          <div
            className={`tree-menu-caret ${
              childVisible ? "tree-menu-active" : ""
            }`}
            onClick={() => setChildVisible((value) => !value)}
          >
            <FontAwesomeIcon icon={faCaretSquareRight} />
          </div>
        )}

        {!hasChild && (
          <div>
            <FontAwesomeIcon icon={faCircle} />
          </div>
        )}

        <div
          className="tree-menu-label"
          onClick={() => topicSelectHandler(label)}
        >
          {label}
          <span className="tree-menu-solved-fraction">
            {showPercentage ? ` ( ${temp} / ${totalQuestions} ) ` : ""}
          </span>
        </div>
        {showPercentage && (
          <div className="tree-menu-solved">
            <CircularProgressbar
              className="tree-menu-solved-svg"
              value={percentSolved}
              text={`${percentSolved}%`}
              background
              backgroundPadding={0}
              styles={buildStyles({
                // backgroundColor: "#333",
                // textColor: "#fefaee",
                backgroundColor: "transparent",
                textColor: "#333",
                textSize: "1.4rem",
                pathColor: pathColor,
                trailColor: "#000",
              })}
            />
          </div>
        )}
      </div>

      {hasChild && childVisible && (
        <div>
          <ul className="tree-menu-column">
            <TreeMenu data={node.children} />
          </ul>
        </div>
      )}
    </li>
  );
};

export default TreeMenu;


