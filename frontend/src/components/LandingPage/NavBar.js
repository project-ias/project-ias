import FelvinLogo from "../../logo.svg";

const NavBar = () => {
    return (
        <div className="navbar-div">
            <div className="navbar-logo-div">
                <img src={FelvinLogo} className="navbar-logo" alt="logo"></img>
            </div>
            <div className="navbar-links-div">
                <a className="navbar-link" href="/">Premium</a>
                <a className="navbar-link" href="/">FAQ</a>
                <a className="navbar-link" href="/">Contact Us</a>
            </div>
        </div>
    )
}

export default NavBar;