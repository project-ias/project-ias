import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { TELEGRAM_URL } from "../../constants/constants";
import useWindowDimensions from "../../helpers/WindowDimensions";
import FelvinLogo from "../../logo.svg";

const NavBar = () => {
  const { width } = useWindowDimensions();
  const [navbarLinkDiv, setNavbarLinkDiv] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const menuToggler = () => {
    const temp = showMenu;
    setShowMenu(!temp);
  };

  useEffect(() => {
    if (width < 1000) {
      //hamburger
      setNavbarLinkDiv(
        <div>
          <FontAwesomeIcon
            icon={showMenu ? faTimes : faBars}
            className="navbar-menu"
            onClick={() => menuToggler()}
          />
        </div>
      );
    } else {
      setNavbarLinkDiv(
        <div className="navbar-links-div">
          <a className="navbar-link" href="/payment">
            Premium
          </a>
          <a className="navbar-link" href={TELEGRAM_URL}>
            FAQ
          </a>
          <a className="navbar-link" href={TELEGRAM_URL}>
            Contact Us
          </a>
          <a className="navbar-link navbar-link-special" href="/auth">
            LOGIN
          </a>
        </div>
      );
    }
  }, [width, showMenu]);

  var menuDiv = null;
  if (showMenu) {
    menuDiv = (
      <div className="navbar-menu-list">
        <a className="navbar-link" href="/payment">
          Premium
        </a>
        <a className="navbar-link" href={TELEGRAM_URL}>
          FAQ
        </a>
        <a className="navbar-link" href={TELEGRAM_URL}>
          Contact Us
        </a>
        <a className="navbar-link navbar-link-special" href="/auth">
          LOGIN
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar-div">
        <div className="navbar-logo-div">
          <img src={FelvinLogo} className="navbar-logo" alt="logo"></img>
          <div className="navbar-title">
            <span className="navbar-title-main">PROJECT IAS</span>
            <span className="navbar-title-sub">
              Search through PYQs, DNS and reading materials in a go
            </span>
          </div>
        </div>
        {navbarLinkDiv}
      </div>
      {menuDiv}
    </div>
  );
};

export default NavBar;
