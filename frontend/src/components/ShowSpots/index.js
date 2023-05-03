import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotActions } from "../../store/spots";
import { Link } from "react-router-dom";
import "./ShowSpots.css";

function ShowSpots({ isLoaded }) {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(spotActions.fetchSpots());
  }, [dispatch]);

  if (!spots) {
    return (
      <div style={{ fontSize: "20px", fontWeight: "bold", marginTop: "47px" }}>
        Loading...
      </div>
    );
  }

  return (
    isLoaded && (
      <div className="spots-container">
        {spots.map((spot) => (
          <Link
            to={`/spots/${spot.id}`}
            key={spot.id}
            data-spot-name={spot.name}
          >
            <div className="spot-card">
              <img
                className="spot-card-image"
                src={spot.previewImage}
                alt={spot.name}
                style={{ width: "200px", height: "200px" }}
              />
              <div className="spot-card-details">
                <h2 className="spot-card-location">
                  {spot.city}, {spot.state}
                </h2>
                <p className="spot-card-price">${spot.price} night</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  );
}

export default ShowSpots;
