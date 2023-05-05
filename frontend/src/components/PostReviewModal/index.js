import React, { useState } from "react";
import { reviewActions } from "../../store/reviews";

import { useSelector, useDispatch } from "react-redux";

import "./PostReviewModal.css";

import { useModal } from "../../context/Modal";

const PostReviewModal = () => {
  const [review, setReview] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const spot = useSelector((state) => state.spots.spotDetails);

  const { closeModal } = useModal();

  const handleRatingChange = (e) => {
    setStarRating(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars: parseInt(starRating, 10),
    };

    await dispatch(reviewActions.postReview(spot.id, newReview))
      .then(() => {
        dispatch(reviewActions.fetchReviews(spot.id));
        closeModal();
      })
      .catch((error) => {
        setErrors({ ...errors, errors: "Review already exists for this spot" });
      });
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <label key={i}>
          <input
            type="radio"
            name="rating"
            value={i}
            onChange={handleRatingChange}
            style={{ display: "none" }}
          />
          <i
            className={
              i <= starRating ? "fas fa-star checked" : "far fa-star checked"
            }
            onClick={() => setStarRating(i)}
          />
        </label>
      );
    }
    return stars;
  };

  return (
    <div className="reviewform-container">
      <h1>How was your stay?</h1>
      <div className="error">
        {Object.values(errors).map((error, idx) => (
          <p key={idx}>{error}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="review"
          placeholder="Please leave your review here..."
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="stars">
          {renderStars()}

          <p>stars</p>
        </div>
        <button disabled={review.length < 10}>Submit Your Review</button>
      </form>
    </div>
  );
};

export default PostReviewModal;
