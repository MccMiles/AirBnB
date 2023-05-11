import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { reviewActions } from "../../store/reviews";

const DeleteReview = ({ reviewId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();

  const reviewUser = useSelector((state) => state.reviews.reviews);
  console.log("==REVIEW======>", reviewUser);

  const deleteReview = async (e) => {
    e.preventDefault();

    const review = reviewUser.find((review) => review.id === reviewId);

    if (review) {
      await dispatch(reviewActions.deleteReviewThunk(review.id)).then(() => {
        history.push("/spots/current");
      });
    }
  };

  const handleNoClick = () => {
    closeModal();
  };

  return (
    <form onSubmit={deleteReview}>
      <div className="confirm-container">
        <h1>Confirm Delete</h1>
        <p id="confirm">Are you sure you want to delete this review?</p>
        <div className="confirm-container">
          <button type="submit" className="confirm-button">
            Yes (Delete Review)
          </button>
          <button className="deny-button" onClick={handleNoClick}>
            No (Keep Review)
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteReview;
