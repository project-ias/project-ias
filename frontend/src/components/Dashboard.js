import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/free-brands-svg-icons";
import {
  faInstagram,
  faTelegramPlane,
} from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { INSTA_URL, TELEGRAM_URL } from "../constants/constants";

const Dashboard = (props) => {
  var userEmail = props.email;

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

  return (
    <div className="dashboard-cover">
      <div className="dashboard-div">
        <div className="menu-exit">
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => {
              props.hide();
            }}
          />
        </div>
        {emailDiv}
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
