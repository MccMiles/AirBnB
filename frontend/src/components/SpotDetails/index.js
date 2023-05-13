import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import { reviewActions } from "../../store/reviews";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const currentSpot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector((state) => Object.values(state.reviews)[0]);
  const reviewCount = Object.keys(reviews).length;
  const [currentRating, setCurrentRating] = useState(
    currentSpot ? currentSpot.avgStarRating : 0
  );

  console.log("=====currentSpot====", currentSpot);
  function handleReserve(e) {
    e.preventDefault();
    window.alert("feature coming soon!");
  }

  useEffect(() => {
    dispatch(spotActions.fetchSpotDetailsById(spotId));
    dispatch(reviewActions.fetchReviews(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    setCurrentRating(currentSpot ? currentSpot.avgStarRating : 0);
  }, [currentSpot]);

  useEffect(() => {
    if (currentSpot) {
      currentSpot.SpotImages.forEach((image) => {
        const img = new Image();
        img.onload = () => {
          console.log(
            `Original size of ${image.url}: ${img.naturalWidth}px x ${img.naturalHeight}px`
          );
        };
        img.src = image.url;
      });
    }
  }, [currentSpot]);

  return currentSpot ? (
    <div className="Main">
      <div className="spotdetail-box">
        <div className="header">
          <h1>
            {currentSpot.name}
            <span className="num-reviews">
              &middot;&nbsp;
              {reviewCount === 0
                ? "New"
                : `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}
            </span>
          </h1>

          {/* <p>
            <p>&nbsp;&middot;&nbsp;</p>
            {reviewCount === 0
              ? "New"
              : `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`}
          </p> */}
          <p className="location">
            {currentSpot.city}, {currentSpot.state}, &nbsp;{" "}
            {currentSpot.country}
          </p>
        </div>
        <div className="display-box">
          <div className="grid-container">
            {currentSpot.SpotImages.map((image) => (
              <div
                // style={{ width: "300px", height: "auto" }}
                className="item"
                key={image.id}
              >
                <img src={image.url} alt={currentSpot.name} />
              </div>
            ))}
          </div>

          <div className="description-grid">
            <div className="host-description">
              <p>
                Hosted by {currentSpot.Owner.firstName}{" "}
                {currentSpot.Owner.lastName}
              </p>
              {currentSpot.description}
            </div>

            <div className="reserve-grid">
              <p className="price">
                $
                {Number.isInteger(currentSpot.price)
                  ? currentSpot.price.toFixed(0)
                  : currentSpot.price}{" "}
                night
              </p>

              <div
                className="stars-container"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  className="fa-sharp fa-solid fa-star star-color"
                  style={{ color: "#ffc857" }}
                ></div>
                {"   "}&nbsp;
                {reviewCount === 0
                  ? "New"
                  : currentRating % 1 === 0 || currentRating % 1 === 0.5
                  ? currentRating.toFixed(1)
                  : currentRating.toFixed(2)}
              </div>

              <button onClick={handleReserve} className="reserve-button">
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default SpotDetails;
