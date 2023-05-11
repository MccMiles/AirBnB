//GET MY ERRORS TO DISPLAY PROPERLY
//UPDATE STATE AND REDIRECT TO THE HOMEPAGE

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import * as sessionActions from "../../store/session";
import "./SignupForm.css";
import { useModal } from "../../context/Modal";

function SignupFormModal() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [usernameValid, setUsernameValid] = useState(false);

  const { closeModal } = useModal();

  const MIN_EMAIL_LENGTH = 5;
  const MIN_USERNAME_LENGTH = 4;
  const MIN_FIRSTNAME_LENGTH = 2;
  const MIN_LASTNAME_LENGTH = 2;
  const MIN_PASSWORD_LENGTH = 6;
  const MIN_CONFIRM_PASSWORD_LENGTH = 6;

  const vFirstName = firstName.length >= MIN_FIRSTNAME_LENGTH;
  const vLastName = lastName.length >= MIN_LASTNAME_LENGTH;
  const vEmail = email.length >= MIN_EMAIL_LENGTH;
  const vUsername = username.length >= MIN_USERNAME_LENGTH;
  const vPassword = password.length >= MIN_PASSWORD_LENGTH;
  const vConfirmPassword =
    confirmPassword.length >= MIN_CONFIRM_PASSWORD_LENGTH;
  const passwordMatch = password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordMatch) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };

  async function checkUsername(username) {
    const response = await fetch(`/api/users/${username}`);
    const data = await response.json();
    if (response.status === 200) {
      setUsernameValid(data.valid);
    } else {
      setUsernameValid(false);
    }
  }

  return (
    <div className="signup-form-modal">
      <h1 id="signup-text">Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <ul>
          {Object.values(errors).map((error, idx) => {
            return (
              <li className="signup-errors" key={idx}>
                {error}
              </li>
            );
          })}
        </ul>
        <label className="signup-input">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
          />
        </label>
        <label className="signup-input">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />
        </label>
        <label className="signup-input">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </label>
        <label className="signup-input">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
            placeholder="Username"
          />
        </label>
        <label className="signup-input">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        <label className="signup-input">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </label>
        <div id="div-signup-submit">
          <button type="submit" id="signup-submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
