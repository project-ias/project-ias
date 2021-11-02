import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { signOut } from "supertokens-auth-react/recipe/session";
import { COUPON_URL, RAZOR_URL, SUBSCRIPTION_PLANS_URL, TELEGRAM_URL, USER_URL } from "../constants/constants";
import paymentLogo from "../logo.svg";
import subscription from "../helpers/subscription";

const currentUserEmail = localStorage.getItem("userEmail") || "";


const onLogout = async () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("payDate");
    await signOut();
    window.location.href = "/auth";
};


const goBack = () => {
    window.location.href = "/";
}


const Payment = () => {

    const [rates, setRates] = useState([]);
    const [rateSelected, setRateSelected] = useState(0);
    const [coupon, setCoupon] = useState("");
    const [error, setError] = useState("");
    const [isServerError, setIsServerError] = useState(false);


    //to check for trial and subscription
    useEffect( async () => {
        if(currentUserEmail !== null && currentUserEmail !== "") {
            try {
                const {data} = await axios.post(USER_URL, {email: currentUserEmail});
                const payDate = data.payDate;
                localStorage.setItem("payDate", payDate);
                const rates = await axios.get(SUBSCRIPTION_PLANS_URL);
                setRates(rates.data);
            }
            catch(err) {
                setIsServerError(true);
            }
        }
        else {
            window.location.href = "/auth";
        }
    }, []);


    const handleCoupon = async () => {
        axios.post(COUPON_URL, {coupon: coupon})
             .then((response) => {
                 window.open(response.data.link, "_blank");
             })
             .catch((error) => {
                 setError("Coupon not found!");
             });
    }


    const ratesDiv = (ratesObj, index) => {
        var rateClass = "";
        if(index === 0) {
            rateClass = "left";
        }
        else if(index === rates.length - 1) {
            rateClass = "right";
        }
        else {
            rateClass = "center";
        }
        if(index === rateSelected) {
            rateClass += " bold";
        }

        return (
            <div className={rateClass} key={index}>Rs. {ratesObj.fee} <br/> {ratesObj.tenure}</div>
        )
    }


    return(
        <div>
            <div className="payment-topbar">
                <button className="current-user-auth-btn" onClick={goBack}>
                    Back
                </button>
                <button className="current-user-auth-btn" onClick={onLogout}>
                    Log Out
                </button>
            </div>
            {!isServerError && <div className="payment-card">
                <img src={paymentLogo} className="payment-logo" alt="payment-logo"/>
                <h1 className="payment-heading">PROJECT-IAS</h1>
                <ul className="payment-benefit-list">
                    <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Unlimited access to PYQs, dns and reading materials</li>
                    <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Progress tracking</li>
                    <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Revision reminder</li>
                </ul>
                <div className="payment-rate">
                    <input type="range" min="0" max={rates.length-1} className="payment-rate-slider" id="myPrice" onChange={(event) => setRateSelected(Number(event.target.value))} />
                    <div className="payment-rate-label">
                        { rates.map((rateObj, index) => (
                            ratesDiv(rateObj, index)
                        ))}
                    </div>
                </div>
                <div className="payment-coupon">
                    <div className="payment-coupon-input-div">
                        <input type="text" placeholder="Any coupon code ?" className="payment-coupon-input" value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())}></input>
                    </div>
                    <div className="payment-button payment-coupon-button payment-button-green">
                        <a href="#" className="payment-button-link" onClick={handleCoupon}>APPLY</a>
                    </div>
                </div>
                <div className="payment-error">{error}</div>
                <div className="payment-links-div">
                    <div className="payment-button payment-button-green" >
                        <a href={rates.length && rates[rateSelected].link} className="payment-button-link">PROCEED</a>
                    </div>
                    <div className="payment-button">
                        <a href={TELEGRAM_URL} className="payment-button-link">CONTACT</a>
                    </div>
                </div>
            </div>}
            {isServerError && <div className="payment-server-error">
                We are facing issue with payment right now! We promise it will be resolved soon. Sorry for the inconvenience caused.
            </div>}
        </div>
    )
}

export default Payment;