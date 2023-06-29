import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import logo from "../../images/Airbnb_logo_PNG3.png";

import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ul>
        <ProfileButton user={sessionUser} />
      </ul>
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
    <div className="nav-flexbox">
      <div style={{ position: "relative" }}>
        <NavLink exact to="/">
          <img
            style={{ height: "40px", width: "128px" }}
            src={logo}
            alt="return to home"
          />
        </NavLink>
      </div>

      <NavLink className="spotlink" to="/spots/new">
        Create a New Spot
      </NavLink>

      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
