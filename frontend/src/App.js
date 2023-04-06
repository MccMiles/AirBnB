//frontend/src/App.js
import React, { useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ShowSpots from "./components/ShowSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <ShowSpots isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
    </>
  );
}

export default App;
