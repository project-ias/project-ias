import React from "react";
import headerImg from "../../header.svg";
import Card from "./Card";
import NavBar from "./NavBar";

const cardDetails = [
    {
        title: "What",
        text: "context specific study",
        accent: "green"
    },
    {
        title: "Why",
        text: "save time in reading newspaper",
        accent: "red"
    },
    {
        title: "How",
        text: "use our all in one search bar",
        accent: "purple"
    },
    {
        title: "Where",
        text: "start right here",
        accent: "blue"
    }
]

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
                    <div className="header-left-cards-div">
                        {cardDetails.map((card, index) => {
                            return(
                                <Card id={index} title={card.title} text={card.text} accent={card.accent}/>
                            )
                        })}
                    </div>
                    <div className="header-left-start-btn">
                        <button className="current-user-auth-btn black-btn">START</button>
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