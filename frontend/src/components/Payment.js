import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import paymentLogo from "../logo.svg";

const Payment = () => {
    return(
        <div className="payment-card">
            <img src={paymentLogo} className="payment-logo" alt="payment-logo"/>
            <h1 className="payment-heading">PROJECT-IAS</h1>
            <ul className="payment-benefit-list">
                <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Unlimited access to PYQs, dns and reading materials</li>
                <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Progress tracking</li>
                <li className="payment-benefit-item"><FontAwesomeIcon icon={faCaretRight}/> Revision reminder</li>
            </ul>
            <div className="payment-button" >
                <a href="https://imjo.in/tucwem" rel="im-checkout" data-text="PAY" className="payment-button-link" data-layout="vertical">PAY</a>
            </div>
        </div>
    )
}

export default Payment;