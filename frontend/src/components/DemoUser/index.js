import React from "react";
import { useDispatch } from "react-redux";
import { demoLoginThunk } from "../store/session";

const DemoLoginButton = () => {
  const dispatch = useDispatch();

  const handleDemoLogin = () => {
    dispatch(demoLoginThunk());
  };

  return <button onClick={handleDemoLogin}>Log in as demo user</button>;
};

export default DemoLoginButton;
