import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import * as reviewActions from "../../store/reviews";
import { fetchSpotDetails } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal";
import ConfirmReviewDeleteModal from "../ConfirmReviewDeleteModal";
import "./SpotReviews.css";

const SpotReviews = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => Object.values(state.reviews));
  const spot = useSelector((state) => state.spots.spotDetails);
  const user = useSelector((state) => state.session.user);
  const { spotId } = useParams();
  const [loading, setLoading] = useState(true);

  // Destructure currentSpot object
  const {
    country = "",
    city = "",
    state = "",
    address = "",
    description = "",
    price = "",
    name = "",
  } = spot || {};

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(reviewActions.fetchReviews(spotId)),
        dispatch(fetchSpotDetails(spotId)),
      ]);
      setLoading(false);
    };
    fetchData();
  }, [dispatch, spotId]);

  const renderPostReview = () => {
    return (
      user &&
      user.id !== spot.Owner.id &&
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

  if (reviews.length > 0 && spot && user && user.id !== spot.Owner.id) {
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
                modalComponent={
                  <ConfirmReviewDeleteModal reviewId={review.id} />
                }
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
    user.id !== spot.Owner.id
  ) {
    return (
      <div className="review-box">
        <p>Be the first to post a review!</p>
        {renderPostReview()}
      </div>
    );
  } else {
    return null;
  }
};

export default SpotReviews;
