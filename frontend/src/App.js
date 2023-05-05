//frontend/src/App.js
import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ShowSpots from "./components/ShowSpots";
import SpotDetails from "./components/SpotDetails";
import SpotForm from "./components/SpotForm";
import ManageSpots from "./components/ManageSpots";
import EditForm from "./components/UpdateSpot";
import SpotReviews from "./components/SpotReviews";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <ShowSpots isLoaded={isLoaded} />
          </Route>
          <Route path={`/spots/new`}>
            <SpotForm />
          </Route>
          <Route path="/spots/current">
            <ManageSpots />
          </Route>
          <Route path="/spots/:spotId/edit">
            <EditForm />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
            <SpotReviews />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails isLoaded={isLoaded} />
            {/* <reviews></reviews> */}
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
