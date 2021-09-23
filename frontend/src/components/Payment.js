import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { signOut } from "supertokens-auth-react/recipe/session";
import { COUPON_URL, RAZOR_URL, TELEGRAM_URL, USER_URL } from "../constants/constants";
import paymentLogo from "../logo.svg";
import subscription from "../helpers/subscription";

const currentUserEmail = localStorage.getItem("userEmail") || "";

const onLogout = async () => {
    localStorage.removeItem("userEmail");
    await signOut();
    window.location.href = "/auth";
};
const Payment = () => {

    const [rateStyles, setRateStyles] = useState(["left", "center", "right"]);
    const [rateSelected, setrateSelected] = useState(0);
    const [coupon, setCoupon] = useState("");
    const [error, setError] = useState("");


    //to check for trial and subscription
    useEffect( async () => {
        if(currentUserEmail !== null && currentUserEmail !== "") {
            const {data} = await axios.post(USER_URL, {email: currentUserEmail});
            const payDate = data.payDate;
            localStorage.setItem("payDate", data.payDate);
            if(subscription(payDate) >= 0) {
                window.location.href = "/";
            }
        }
        else {
            window.location.href = "/auth";
        }
    }, []);

    const rateChange = (value) => {
        const tempRateStyles = ["left", "center", "right"];
        tempRateStyles[value] += " bold";
        setrateSelected(Number(value));
        setRateStyles(tempRateStyles);
    }

    const handleCoupon = async () => {
        axios.post(COUPON_URL, {coupon: coupon})
             .then((response) => {
                 window.open(response.data.link, "_blank");
             })
             .catch((error) => {
                 setError("Coupon not found!");
             });
    }

    return(
        <div>
            <div className="payment-signout">
                <button className="current-user-auth-btn" onClick={onLogout}>
                    Log Out
                </button>
            </div>
            <div className="payment-card">
                <img src={paymentLogo} className="payment-logo" alt="payment-logo"/>
                <h1 className="payment-heading">PROJECT-IAS</h1>
                <ul className="payment-benefit-list">
                    <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Unlimited access to PYQs, dns and reading materials</li>
                    <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Progress tracking</li>
                    <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Revision reminder</li>
                </ul>
                <div className="payment-rate">
                    <input type="range" min="0" max="2" className="payment-rate-slider" id="myPrice" onChange={(event) => rateChange(event.target.value)} />
                    <div className="payment-rate-label">
                        <div className={rateStyles[0]} >Rs. 50 <br/> 1 month</div>
                        <div className={rateStyles[1]} >Rs. 250 <br/> 6 months</div>
                        <div className={rateStyles[2]} >Rs. 400 <br/> 12 months</div>
                    </div>
                </div>
                <div className="payment-coupon">
                    <div className="payment-coupon-input-div">
                        <input type="text" placeholder="Any coupon code ?" className="payment-coupon-input" value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())}></input>
                    </div>
                    <div className="payment-button payment-coupon-button">
                        <a href="#" className="payment-button-link" onClick={handleCoupon}>APPLY</a>
                    </div>
                </div>
                <div className="payment-error">{error}</div>
                <div className="payment-links-div">
                    <div className="payment-button payment-button-green" >
                        <a href={RAZOR_URL[rateSelected]} className="payment-button-link">PROCEED</a>
                    </div>
                    <div className="payment-button">
                        <a href={TELEGRAM_URL} className="payment-button-link">CONTACT</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment;