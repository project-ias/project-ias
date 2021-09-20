import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {useEffect} from "react";
import axios from "axios";
import { signOut } from "supertokens-auth-react/recipe/session";
import { INSTAMOJO_URL, TELEGRAM_URL, USER_URL } from "../constants/constants";
import paymentLogo from "../logo.svg";
import subscription from "../helpers/subscription";

const currentUserEmail = localStorage.getItem("userEmail") || "";

const onLogout = async () => {
    localStorage.removeItem("userEmail");
    await signOut();
    window.location.href = "/auth";
};

const Payment = () => {

    //to check for trial and subscription
    useEffect( async () => {
        if(currentUserEmail !== null && currentUserEmail !== "") {
            const {data} = await axios.post(USER_URL, {email: currentUserEmail});
            const payDate = data.payDate;
            localStorage.setItem("payDate", data.payDate);
            if(subscription(payDate)) {
                window.location.href = "/";
            }
        }
        else {
            window.location.href = "/auth";
        }
    }, []);

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
                <div className="payment-rate"><strong>Rs. 500 only</strong> ( 1 year )</div>
                <div className="payment-links-div">
                    <div className="payment-button payment-button-green" >
                        <a href={INSTAMOJO_URL} rel="im-checkout" data-text="PAY" className="payment-button-link" data-layout="vertical">PAY</a>
                    </div>
                    <div className="payment-button">
                        <a href={TELEGRAM_URL} className="payment-button-link">CONTACT US</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment;