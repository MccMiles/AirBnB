import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { reviewActions } from "../../store/reviews";
import { useSelector, useDispatch } from "react-redux";
import "./PostReviewModal.css";
import { useModal } from "../../context/Modal";
import { useHistory, useParams } from "react-router-dom";

const PostReviewModal = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.spotDetails);
  const { closeModal } = useModal();

  const [review, setReview] = useState("");
  const [starRating, setStarRating] = useState(0);
  const [errors, setErrors] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);

  const MIN_LENGTH = 10;
  const validReview = review.length >= MIN_LENGTH;

  const history = useHistory();
  const params = useParams();

  const handleRatingChange = (e) => {
    setStarRating(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars: starRating,
      userId: currentUser.id,
    };

    setErrors([]);
    try {
      await dispatch(reviewActions.postReview(spot.id, newReview));
      closeModal();
      history.go(0);
    } catch (error) {
      setErrors([error.message]);
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
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="post-review-modal">
        <h1 id="post-review-text">How was your stay?</h1>
        <form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <ul className="errors">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
              {!validReview && (
                <li>Review must be at least 10 characters long</li>
              )}
            </ul>
          )}

          <label id="review-label" className="review-label">
            <textarea
              placeholder="Leave your review here..."
              onChange={(e) => setReview(e.target.value)}
              type="text"
              id="review-input"
              name="review"
              value={review}
              required
              className="review-input"
            />
          </label>
          <div id="star-rating-div">
            <div className="rating-container">{renderStars()}</div>
          </div>
          <div className="modal-buttons">
            <button
              type="submit"
              id="submit-button"
              disabled={!validReview}
              className="review-submit"
            >
              Submit Your Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PostReviewModal;
