import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { reviewActions } from "../../store/reviews";
import { useSelector, useDispatch } from "react-redux";
import "./PostReviewModal.css";
import { useModal } from "../../context/Modal";
import { find } from "lodash";

const PostReviewModal = () => {
  const [review, setReview] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [hoverRating, setHoverRating] = useState(0);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spotDetails);

  const { closeModal } = useModal();

  const handleRatingChange = (e) => {
    setStarRating(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (review.length < 10) {
      setErrors({
        ...errors,
        review: "Review must be at least 10 characters long",
      });
      return;
    }

    const newReview = {
      review,
      stars: starRating,
      userId: currentUser.id,
    };

    // const existingReview = spot.reviews.find(
    //   (review) => review.userId === currentUser.id
    // );

    const existingReview = find(spot.reviews, { userId: currentUser.id });

    if (existingReview) {
      setErrors({ ...errors, errors: "Review already exists for this spot" });
      return;
    }

    try {
      await dispatch(reviewActions.postReview(spot.id, newReview));
      await dispatch(reviewActions.fetchReviews(spot.id));
      closeModal();
    } catch (error) {
      setErrors({
        ...errors,
        review: "There was a problem submitting your review. Please try again.",
      });
    }

    setErrors({});
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const className = `star ${
        i <= starRating ? "solid-star" : "hollow-star"
      }`;

      stars.push(
        <label key={i}>
          <input
            type="radio"
            name="rating"
            value={i}
            onChange={handleRatingChange}
            style={{ display: "none" }}
          />
          <FontAwesomeIcon
            icon={faStar}
            className={className}
            style={{
              color:
                i <= hoverRating || i <= starRating ? "#ffc857" : "#303030",
            }}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setStarRating(i)}
          />
        </label>
      );
    }

    return stars;
  };

  return (
    <div className="reviewform-container">
      <h1>How was your experience?</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="review">Review</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        {errors.review && <p className="errors">{errors.review}</p>}
        <div className="rating-container">{renderStars()}</div>
        <button className="review-submit" type="submit">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default PostReviewModal;
