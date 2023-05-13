import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotActions } from "../../store/spots";
import { Link } from "react-router-dom";
import "./ShowSpots.css";

function ShowSpots({ isLoaded }) {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const currentSpot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector((state) => Object.values(state.reviews)[0]);
  const reviewCount = Object.keys(reviews).length;
  const [currentRating, setCurrentRating] = useState(
    currentSpot ? currentSpot.avgStarRating : 0
  );

  console.log("spots==========", spots);
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
      <div className="show-spots-container">
        <div className="spots-container">
          {spots.map((spot) => (
            <div className="spot-card" key={spot.id}>
              <div className="image-box">
                <Link to={`/spots/${spot.id}`} className="spot-link">
                  <img
                    className="spot-card-image"
                    src={spot.previewImage}
                    alt={spot.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
              <div className="detail-box">
                <div className="spot-card-location">
                  {spot.city}, {spot.state}
                </div>

                <div
                  className="rating-box"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    className="spot-card-rating fa-sharp fa-solid fa-star star-color"
                    style={{ color: "#ffc857", marginRight: "0.1rem" }}
                  ></div>
                  &middot;&nbsp;
                  {spot.avgRating ? spot.avgRating : "New"}
                </div>
                <div className="spot-card-price">${spot.price} night</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}

export default ShowSpots;
