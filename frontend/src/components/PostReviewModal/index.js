import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { reviewActions } from "../../store/reviews";
import { useSelector, useDispatch } from "react-redux";
import "./PostReviewModal.css";
import { useModal } from "../../context/Modal";

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

    const newReview = {
      review,
      stars: starRating,
    };

    const existingReview = spot.reviews.find(
      (review) => review.userId === currentUser.id
    );

    if (existingReview) {
      setErrors({ ...errors, errors: "Review already exists for this spot" });
      return;
    }

    try {
      await dispatch(reviewActions.postReview(spot.id, newReview));
      dispatch(reviewActions.fetchReviews(spot.id));
      closeModal();
    } catch (error) {
      setErrors({ ...errors });
    }
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
      <h1>How was your stay?</h1>
      <div className="error">
        {Object.values(errors).map((error, idx) => (
          <p key={idx}>{error}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="review"
          placeholder="Just a quick review."
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="stars">
          {renderStars()}
          <label className="stars-label">Stars</label>
        </div>

        <button disabled={review.length < 10}>Submit Your Review</button>
      </form>
    </div>
  );
};

export default PostReviewModal;
