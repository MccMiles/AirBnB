import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import logo from "../../images/Airbnb_logo_PNG3.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAirbnb } from "@fortawesome/free-brands-svg-icons";

import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
          className="login-modal"
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
          className="signup-modal"
        />
      </li>
    );
  }
  return (
    <ul>
      <li style={{ position: "relative" }}>
        <NavLink exact to="/">
          <img className="home-logo" src={logo} alt="return to home" />
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}
export default Navigation;
