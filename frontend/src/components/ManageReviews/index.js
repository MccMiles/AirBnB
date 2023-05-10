import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reviewActions } from "../../store/reviews";
import "./ManageReviews.css";
import OpenModalButton from "../OpenModalButton";
import ConfirmDelete from "../DeleteModal";
import { Link } from "react-router-dom";

const ManageReviews = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const currentUserReviews = useSelector((state) =>
    Object.values(state.reviews.reviews)
  ).filter((review) => review.userId === user.id);

  useEffect(() => {
    console.log("Fetching reviews...");
    dispatch(reviewActions.userReviews(user.id));
  }, [dispatch, user.id]);

  console.log(
    "my userReviews------------>",
    useSelector((state) => Object.values(state.reviews.reviews))
  );

  return currentUserReviews.length > 0 ? (
    <div>
      <h1>Manage Your Reviews</h1>
      <div className="reviews-container">
        {currentUserReviews.map((review) => (
          <Link
            to={`/spots/${review.Spot.id}`}
            className="each-review"
            key={review.id}
          >
            <div className="each-review" key={review.id}>
              <p>{review.Spot.name}</p>
              <p>
                {new Date(review.createdAt).toLocaleString("en-us", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>{review.review}</p>
              <div className="update-delete">
                <Link to={`/spots/${review.Spot.id}/reviews/${review.id}/edit`}>
                  <button>Update</button>
                </Link>
                <OpenModalButton
                  buttonText={"Delete"}
                  className={"delete-button"}
                  modalComponent={<ConfirmDelete />}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <h1>You haven't written any reviews yet.</h1>
      <p>Go to a spot page and write a review.</p>
    </div>
  );
};

export default ManageReviews;
