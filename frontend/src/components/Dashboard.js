import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/free-brands-svg-icons";
import {
  faInstagram,
  faTelegramPlane,
} from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { INSTA_URL, TELEGRAM_URL, TOPICS_URL } from "../constants/constants";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import TreeMenu from "./TreeMenu";
import Loader from "react-loader-spinner";
import subscription from "../helpers/subscription";

const Dashboard = (props) => {
  const node = useRef();
  var userEmail = props.email;
  const [menu, setMenu] = useState([]);
  const [subsMessage, setSubsMessage] = useState("");

  // hide if clicked outside the side menu bar 
  const handleClick = (e) => {
    // if mouse is IN the node , then nothing
    if (node.current.contains(e.target)) {
      return;
    } else {
      props.hide();
    }
  };

  useEffect(() => {
    // 1. check for subscription status 
    // 2. Get topics from backend TOPIC_URL 
    // 3. attach addEventListener to mousedown events outside the sidebar node 

    const trialStatus = localStorage.getItem("trial") !== "expired";
    const subStatus = subscription(localStorage.getItem("payDate")) > 0;

    if (trialStatus && !subStatus) setSubsMessage((100 - localStorage.getItem("searchCount")) + " searches left for trial.");
    else if (subStatus) setSubsMessage("Subscription Activated");


    axios
      .get(TOPICS_URL)
      .then((Response) => {
        console.log("menu : " + Response.data.children);
        setMenu([Response.data]);
      })
      .catch((err) => console.log(err));

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
    // if `[]` is the second argument in useEffect => run only ONCE (initially)
    // if NO second argument in useEffect => always run
    // if [var1, var2] are the second argument in useEffect => run only on change of var1 or var2 value
  }, []);


  if (userEmail === null || userEmail === undefined || userEmail === "")
    userEmail = "User";

  const emailDiv = (
    <div>
      <div className="email-logo-div">
        <div className="email-logo">{userEmail.charAt(0)}</div>
      </div>
      <div className="email-text">{userEmail}</div>
    </div>
  );

  var menuDiv = (
    <Loader
      type="Puff"
      color="#00BFFF"
      height={100}
      width={100}
      visible={true}
      style={{
        textAlign: "center",
      }}
    />
  );

  if (menu && menu.length !== 0) {
    menuDiv = (
      <div className="tree-menu">
        <TreeMenu data={menu} />
      </div>
    );
  }

  return (
    <div className="dashboard-cover">
      <div className="dashboard-div" ref={node}>
        <div className="menu-exit">
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => {
              props.hide();
            }}
          />
        </div>
        {emailDiv}
        <div className="subscription-status">{subsMessage}</div>
        {menuDiv}
        <div className="contact-us">
          <div className="contact-us-text">Contact Us!</div>
          <div className="icons-div">
            <FontAwesomeIcon
              icon={faTelegramPlane}
              onClick={() => window.open(TELEGRAM_URL, "_blank")}
              className="link-icon"
            />
            <FontAwesomeIcon
              icon={faInstagram}
              onClick={() => window.open(INSTA_URL, "_blank")}
              className="link-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
