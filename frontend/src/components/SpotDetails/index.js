import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import { fetchReviews } from "../../store/reviews";

function SpotDetails() {
  const dispatch = useDispatch();
  const currentSpot = useSelector((state) => state.spots.spotDetails);
  const reviews = useSelector((state) => Object.values(state.reviews));
  const avgRating = calculateAvgRating(reviews);

  function handleReserve(e) {
    e.preventDefault();
    window.alert("feature coming soon!");
  }

  useEffect(() => {
    dispatch(spotActions.fetchSpotDetailsById(currentSpot.id));
    dispatch(fetchReviews(currentSpot.id));
  }, [dispatch, currentSpot.id]);

  function calculateAvgRating(reviews) {
    if (reviews.length === 0) {
      return NaN;
    }
    const totalRating = reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0);
    return totalRating / reviews.length;
  }

  return currentSpot ? (
    <div className="spotdetail-container">
      <h1>{currentSpot.name}</h1>
      <p className="location">
        {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
      </p>

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
            Hosted by {currentSpot.Owner.firstName} {currentSpot.Owner.lastName}
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
          {isNaN(avgRating) ? (
            <p className="fa-solid fa-star">New</p>
          ) : (
            <div
              className="stars-container"
              style={{ display: "flex", alignItems: "center" }}
            >
              <p className="fa-solid fa-star">{avgRating.toFixed(1)}</p>
              <p>&nbsp;&middot;&nbsp;</p>
              <h2>
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </h2>
            </div>
          )}
          <button onClick={handleReserve} className="reserve-button">
            Reserve
          </button>
        </div>
      </div>

      <div className="review-count">
        {reviews.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              wordSpacing: "5px",
            }}
          >
            <p className="fa-solid fa-star">New</p>
          </div>
        ) : (
          <div className="reviews">
            {isNaN(avgRating) ? (
              <p className="fa-solid fa-star">New</p>
            ) : (
              <div
                className="stars-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p className="fa-solid fa-star">{avgRating.toFixed(1)}</p>
                <p>&nbsp;&middot;&nbsp;</p>
                <h2>
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default SpotDetails;
