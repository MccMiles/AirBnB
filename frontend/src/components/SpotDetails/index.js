import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import { reviewActions } from "../../store/reviews";
import { useParams } from "react-router-dom";
import "./SpotDetails.css";

function SpotDetails() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const currentSpot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector((state) => Object.values(state.reviews));

  function handleReserve(e) {
    e.preventDefault();
    window.alert("feature coming soon!");
  }

  useEffect(() => {
    dispatch(spotActions.fetchSpotDetailsById(spotId));
    dispatch(reviewActions.fetchReviews(spotId));
  }, [dispatch, spotId]);

  return currentSpot ? (
    <div className="Main">
      <div className="spotdetail-box">
        <div className="header">
          <h1>{currentSpot.name}</h1>
          <p className="location">
            {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
          </p>
        </div>
        <div className="grid-container">
          {currentSpot.SpotImages.map((image) => (
            <div className="item" key={image.id}>
              <img src={image.url} alt={currentSpot.name} />
            </div>
          ))}
        </div>

        <div className="description-grid">
          <div>
            <p>
              Hosted by {currentSpot.Owner.firstName}{" "}
              {currentSpot.Owner.lastName}
            </p>
            <p>{currentSpot.description}</p>
          </div>

          <div className="reserve-grid">
            <p className="price">
              $
              {Number.isInteger(currentSpot.price)
                ? currentSpot.price.toFixed(2)
                : currentSpot.price}{" "}
              night
            </p>
            <div
              className="stars-container"
              style={{ display: "flex", alignItems: "center" }}
            >
              <p className="fa-solid fa-star">
                {" "}
                {reviews.length === 0 ? "New" : reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </p>
            </div>
            <button onClick={handleReserve} className="reserve-button">
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default SpotDetails;
