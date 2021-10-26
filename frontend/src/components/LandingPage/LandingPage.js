import React from "react";
import HeaderCard from "./HeaderCard";
import HeaderTitle from "./HeaderTitle";
import NavBar from "./NavBar";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <NavBar/>
            <div className="header-div">
                <HeaderCard/>
            </div>
            <div className="header-title">
                <HeaderTitle/>
            </div>
        </div>
    )
}

export default LandingPage;