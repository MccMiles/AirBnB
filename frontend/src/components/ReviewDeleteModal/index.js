import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { reviewActions } from "../../store/reviews";

const DeleteReview = ({ reviewId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(reviewActions.deleteReviewThunk(reviewId));
    closeModal();
    history.push("/spots/current");
  };

  const handleNo = () => {
    closeModal();
  };

  return (
    <div className="confirm-container">
      <form onSubmit={handleDelete}>
        <h1>Confirm Delete</h1>
        <p className="question">Are you sure you want to delete this review?</p>
        <div className="button-box">
          <button type="submit" className="confirm-button">
            Yes (Delete Review)
          </button>
          <button className="confirm-button" onClick={handleNo}>
            No (Keep Review)
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteReview;
