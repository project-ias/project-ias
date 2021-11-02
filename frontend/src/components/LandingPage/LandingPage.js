import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import DemoVideo from "./DemoVideo";
import HeaderCard from "./HeaderCard";
import HeaderTitle from "./HeaderTitle";
import NavBar from "./NavBar";
import StartBox from "./StartBox";

const LandingPage = () => {
  const headerRef = useRef(null),
    titleRef = useRef(null),
    demoRef = useRef(null),
    startRef = useRef(null);

  const handleScroll = (myRef) => {
    myRef.current.scrollIntoView();
  };

  return (
    <div className="landing-page">
      <NavBar />
      <div className="header-div">
        <HeaderCard />
        <button
          className="landing-scroll"
          onClick={() => handleScroll(titleRef)}
        >
          <FontAwesomeIcon icon={faAngleDoubleDown} />
        </button>
      </div>
      <div className="header-title" ref={titleRef}>
        <HeaderTitle />
        <button
          className="landing-scroll"
          onClick={() => handleScroll(demoRef)}
        >
          <FontAwesomeIcon icon={faAngleDoubleDown} />
        </button>
      </div>
      <div className="demo-video-div" ref={demoRef}>
        <DemoVideo />
        <button
          className="landing-scroll"
          onClick={() => handleScroll(startRef)}
        >
          <FontAwesomeIcon icon={faAngleDoubleDown} />
        </button>
      </div>
      <div className="start-box-div" id="testing" ref={startRef}>
        <StartBox />
      </div>
    </div>
  );
};

export default LandingPage;
