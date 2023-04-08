import "./DemoUser.css";
import React from "react";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../store/session";

function DemoUserLink() {
  const dispatch = useDispatch();

  const handleDemoLogin = async () => {
    const credential = "demouser";
    const password = "password";
    await dispatch(loginThunk({ credential, password }));
  };

  return (
    <div>
      <hr />
      <button onClick={handleDemoLogin}>Login as Demo</button>
    </div>
  );
}

export default DemoUserLink;
