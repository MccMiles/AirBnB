import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { NavLink } from "react-router-dom";
import "./Profile.css";
const ProfileButton = ({ user }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className="outer-buttons">
        <button onClick={openMenu}>
          <i className="fa-solid fa-user fa-sm"></i>
        </button>
      </div>
      <div className="inner-buttons">
        <ul className={ulClassName} ref={ulRef}>
          <li>
            <p>Hello, {user.firstName}</p>
          </li>
          <li>{user.email}</li>
          <NavLink className="highlight" to={`/spots/current`}>
            <li>Manage Spots</li>
          </NavLink>
          <NavLink className="highlight" to={`/reviews/current`}>
            <li>Manage Reviews</li>
          </NavLink>
          <li>
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProfileButton;
