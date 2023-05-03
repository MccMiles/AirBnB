import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfAlt as halfStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as fullStar } from "@fortawesome/free-solid-svg-icons";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const currentSpot = useSelector((state) => state.spots.spotDetails);

  function reserveSpot(e) {
    e.preventDefault();
    window.alert("feature coming soon!");
  }

  useEffect(() => {
    dispatch(spotActions.fetchSpotDetailsById(spotId));
  }, [dispatch, spotId]);

  const renderStars = (avgRating) => {
    const starTotal = 5;
    let stars = [];

    const wholeStars = Math.floor(avgRating);
    for (let i = 0; i < wholeStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={fullStar} style={{ color: "#fc642d" }} />
      );
    }

    if (avgRating === 5.0) {
      // Render only full stars if the rating is exactly 5.0
      return stars;
    }

    const remainder = avgRating - wholeStars;
    if (remainder >= 0.25 && remainder < 0.75) {
      stars.push(
        <FontAwesomeIcon
          key={stars.length}
          icon={halfStar}
          style={{ color: "#fc642d" }}
        />
      );
    } else if (remainder >= 0.75) {
      stars.push(
        <FontAwesomeIcon
          key={stars.length}
          icon={fullStar}
          style={{ color: "#fc642d" }}
        />
      );
    } else {
      stars.push(
        <FontAwesomeIcon
          key={stars.length}
          icon={emptyStar}
          style={{ color: "#fc642d" }}
        />
      );
    }

    const remainderStars = starTotal - stars.length;
    for (let i = 0; i < remainderStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={stars.length}
          icon={emptyStar}
          style={{ color: "#fc642d" }}
        />
      );
    }

    return stars;
  };

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
        <div>{renderStars(currentSpot.averageRating)}</div>
        <button onClick={reserveSpot}>Reserve this Spot</button>
      </div>
    )
  );
}

export default SpotDetails;
