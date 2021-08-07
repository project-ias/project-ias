import { faCaretRight, faCircle } from "@fortawesome/free-solid-svg-icons";
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
  const hasQuestions = node.questions ? true : false;
  var percentSolved = 0;

  if (label === null || label === undefined) label = node;

  if (hasQuestions) {
    var userMains = localStorage.getItem("userMains") || "";
    userMains = userMains.split(" - ");
    var temp = 0;
    for (var i = 0; i < userMains.length; i++) {
      if (node.questions.includes(userMains[i])) temp++;
    }
    percentSolved = Math.floor((temp * 100) / node.questions.length);
  }

  const topicSelectHandler = (query) => {
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
            <FontAwesomeIcon icon={faCaretRight} />
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
        </div>
        {hasQuestions && localStorage.getItem("userEmail") && (
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
