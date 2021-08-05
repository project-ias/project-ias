import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

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
  const [childVisible, setChildVisible] = useState(false);
  const hasChild = node.children ? true : false;

  return (
    <li>
      <div onClick={() => setChildVisible((value) => !value)}>
        {hasChild && (
          <div>
            <FontAwesomeIcon icon={faCaretRight} />
          </div>
        )}

        <div>{node.label}</div>
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
