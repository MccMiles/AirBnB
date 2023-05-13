// HIDE POST REVIEW BUTTON IF IT SPOT BELONGS TO USER
// INDENT THE REVIEW IN REVIEW BOX

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { reviewActions } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal";
import DeleteReview from "../ReviewDeleteModal";
import "./SpotReviews.css";

const SpotReviews = () => {
  const dispatch = useDispatch();
  const [review] = useState("");

  const spot = useSelector((state) => state.spots.spotDetails);

  const reviews = useSelector((state) => Object.values(state.reviews.reviews));
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.session.user);

  function handleReserve(e) {
    e.preventDefault();
    window.alert("feature coming soon!");
  }

  useEffect(() => {
    dispatch(reviewActions.fetchReviews(spotId))
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Failed to fetch reviews:", error);
        setLoading(false);
      });
  }, [dispatch, spotId]);

  const renderPostReview = () => {
    if (user && spot && !currentUserReview) {
      return (
        <OpenModalButton
          buttonText="Post Your Review"
          modalComponent={<PostReviewModal />}
        />
      );
    }
    return null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>Spot not found</div>;
  }

  const reviewsCount = reviews.length;
  const currentUserReview = reviews.find(
    (review) => review.User.id === user?.id
  );

  if (reviewsCount > 0) {
    // Sort reviews by date, with the most recent at the top
    const sortedReviews = [...reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
      <div className="review-box">
        <div className="review-header">
          <div
            className="fa-sharp fa-solid fa-star"
            style={{ color: "#ffc857" }}
          ></div>{" "}
          <p>&nbsp;&middot;&nbsp;</p>
          {reviewsCount === 0
            ? "New"
            : `${Math.floor(reviewsCount)} ${
                reviewsCount === 1 ? "review" : "reviews"
              }`}
        </div>
        {currentUserReview && (
          <div key={currentUserReview.id} className="each-review">
            <p>{currentUserReview.User.firstName}</p>
            <p>
              {new Date(currentUserReview.createdAt).toLocaleString("en-us", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="indent">{currentUserReview.review}</p>
            <br />
            <button onClick={handleReserve} className="reserve-button">
              Update
            </button>
            <OpenModalButton
              className="post-review"
              buttonText="Delete"
              modalComponent={<DeleteReview review={review} />}
            />
          </div>
        )}
        <br />
        {renderPostReview()}
        {sortedReviews.map((review) => {
          if (review.User.id === user?.id) {
            // Skip rendering user's review again
            return null;
          }
          return (
            <div key={review.id} className="each-review">
              <p>{review.User.firstName}</p>
              <p>
                {new Date(review.createdAt).toLocaleString("en-us", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>{review.review}</p>
            </div>
          );
        })}
        <br />
      </div>
    );
  } else {
    return (
      <>
        <p style={{ color: "#ffc857" }}></p>{" "}
        <div className="review-box">
          <div className="review-header">
            <div
              className="fa-sharp fa-solid fa-star"
              style={{ color: "#ffc857" }}
            ></div>{" "}
            <p>&nbsp;&middot;&nbsp;</p>
            {reviewsCount === 0
              ? "New"
              : `${Math.floor(reviewsCount)} ${
                  reviewsCount === 1 ? "review" : "reviews"
                }`}
          </div>
        </div>
      </>
    );
  }
};

export default SpotReviews;
