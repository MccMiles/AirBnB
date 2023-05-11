//redirects you to home when logout

import "./LoginForm.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import { Link } from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handelDemoUser = (e) => {
    e.preventDefault();
    dispatch(sessionActions.demoLoginThunk());
    closeModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.loginThunk({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors([...errors, data.message]);
        } else {
          setErrors([...errors, "Something went wrong. Please try again."]);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="login-modal">
      <ul className="error-list">
        {errors.map((error, idx) => (
          <li key={idx} className="error">
            {error}
          </li>
        ))}
      </ul>
      <label>
        Username or Email:
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Log In</button>
      <Link to="#" onClick={handelDemoUser} className="demo-user">
        Demo User
      </Link>
    </form>
  );
}

export default LoginFormModal;
