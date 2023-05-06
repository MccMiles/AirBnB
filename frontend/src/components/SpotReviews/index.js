import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { reviewActions } from "../../store/reviews";
// import { spotActions } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal";
import DeleteReview from "../ReviewDeleteModal";
import "./SpotReviews.css";

const SpotReviews = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => Object.values(state.reviews));
  const spot = useSelector((state) => state.spots.spotDetails);
  const user = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(reviewActions.fetchReviews(spotId)),
        // dispatch(spotActions.fetchSpotDetailsById(spotId)),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [dispatch, spotId]);

  const renderPostReview = () => {
    return (
      user &&
      user.id !== (spot?.Owner?.id || null) &&
      !reviews.length && (
        <OpenModalButton
          buttonText="Post Your Review"
          modalComponent={<PostReviewModal />}
        />
      )
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (
    reviews.length > 0 &&
    spot &&
    user &&
    user.id !== (spot?.Owner?.id || null)
  ) {
    return (
      <div className="review-box">
        {renderPostReview()}
        {reviews.map((review) => (
          <div key={review.id} className="each-review">
            <p>{review.User.firstName}</p>
            <p>
              {new Date(review.createdAt).toLocaleString("en-us", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p>{review.review}</p>
            {user && review.User.id === user.id && (
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteReview reviewId={review.id} />}
              />
            )}
          </div>
        ))}
      </div>
    );
  } else if (
    reviews.length === 0 &&
    spot &&
    user &&
    user.id !== (spot?.Owner?.id || null)
  ) {
    return (
      <div className="review-box">
        <p>No reviews yet. Be the first to review!</p>
        {renderPostReview()}
      </div>
    );
  }

  return null;
};

export default SpotReviews;
