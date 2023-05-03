import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import { fetchReviews } from "../../store/reviews";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const currentSpot = useSelector((state) => state.spots.spotDetails);
  // const reviews = useSelector((state) => Object.values(state.reviews));

  function reserveSpot(e) {
    e.preventDefault();
    window.alert("feature coming soon!");
  }

  useEffect(() => {
    dispatch(spotActions.fetchSpotDetailsById(spotId));
    dispatch(fetchReviews(spotId));
  }, [dispatch, spotId]);

  console.log("hello");
  return (
    currentSpot && (
      <div>
        <h1>Spot Details</h1>
        <p>{currentSpot.name}</p>
        <p>
          {currentSpot.city}, {currentSpot.state}, {currentSpot.country}
        </p>
        {/* {currentSpot.spotImages.map((image) => (
        <img
          src={image.url}
          alt={currentSpot.name}
          key={image.id}
          style={{ height: "300px", width: "300px" }}
        />
      ))} */}
        <p>
          <b>Rating:</b> {currentSpot.averageRating}
        </p>
        <button onClick={reserveSpot}>Reserve this Spot</button>
      </div>
    )
  );
}
export default SpotDetails;
