import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
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
  const hasChild = node.children ? true : false;

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

        <div
          className="tree-menu-label"
          onClick={() => topicSelectHandler(node.label || node)}
        >
          {node.label || node}
        </div>
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
