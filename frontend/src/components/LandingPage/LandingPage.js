import React from "react";
import headerImg from "../../header.svg";
import NavBar from "./NavBar";

const LandingPage = () => {
    return (
        <div className="landing-page">
            <NavBar/>
            <div className="header-div">
                <div className="header-left">
                    <div className="header-left-text-div">
                        <div className="header-left-text">PROJECT IAS</div>
                        <div className="header-left-subtext">Search through PYQs, DNS & Reading Content</div>
                    </div>
                    <div className="header-left-start-btn">
                        <button className="current-user-auth-btn red-btn">START</button>
                    </div>
                </div>
                <div className="header-right">
                    <img src={headerImg} className="header-right-img" alt="header-right-img"></img>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;