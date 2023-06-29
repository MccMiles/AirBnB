import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { reviewActions } from "../../store/reviews";
import "./ReviewDeleteModal.css";

const DeleteReview = ({ reviewId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const reviews = useSelector((state) => state.reviews);
  const sessionUser = useSelector((state) => state.session.user);

  const userId = sessionUser.id;

  const handleDelete = async (e) => {
    e.preventDefault();

    const foundReview = Object.values(reviews.reviews).find(
      (review) => review.userId === userId
    );

    if (foundReview) {
      const spotId = foundReview.spotId;

      await dispatch(reviewActions.deleteReviewThunk(foundReview.id));

      history.push(`/spots/${spotId}`);
      closeModal();
    }
  };

  const handleNoClick = () => {
    closeModal();
  };

  return (
    <form className="main">
      <div className="confirm-container">
        <h1 className="heading">Confirm Delete</h1>
        <p id="question">Are you sure you want to delete this review?</p>
        <div className="confirm-container">
          <button
            type="button"
            className="answer-button"
            onClick={handleDelete}
          >
            Yes (Delete Review)
          </button>
          <button className="answer-button" onClick={handleNoClick}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteReview;
