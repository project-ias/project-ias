import {
  faCaretSquareRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

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
  const [childVisible, setChildVisible] = useState(false);
  var label = node.label;
  const hasChild = node.children ? true : false;
  const showPercentage =
    node.category === "examSubType" || node.category === "mainTopic";
  var percentSolved = 0,
    totalQuestions = 0;

  if (label === null || label === undefined) label = node;

  if (showPercentage) {
    var userMains = localStorage.getItem("userMains") || "";
    userMains = userMains.split(" - ");
    var temp = 0;
    for (var i = 0; i < userMains.length; i++) {
      if (node.category === "mainTopic") {
        if (node.questions.includes(userMains[i])) temp++;
        totalQuestions = node.questions.length;
      } else {
        for (var j = 0; j < node.children.length; j++) {
          console.log(node.children[j].questions.includes(userMains[i]));
          if (node.children[j].questions.includes(userMains[i])) temp++;
          console.log("temp : " + temp);
          totalQuestions += node.children[j].questions.length;
        }
      }
    }
    if (node.category === "examSubType") totalQuestions /= userMains.length; //in case of examSubType, the questions get added multiple times as it is put inside the userMains for loop.
    percentSolved = Math.floor((temp * 100) / totalQuestions);
  }

  const topicSelectHandler = (query) => {
    if (node.category === "examType") return;
    history.push(`/?${query}`);
    history.go(`/?${query}`);
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
        {showPercentage && localStorage.getItem("userEmail") && (
          <div className="tree-menu-solved">
            <CircularProgressbar
              className="tree-menu-solveed-svg"
              value={percentSolved}
              text={`${percentSolved}%`}
              background
              backgroundPadding={6}
              styles={buildStyles({
                backgroundColor: "#333",
                textColor: "#fefaee",
                pathColor: "#fefaee",
                trailColor: "transparent",
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
