import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/reviews";

const ConfirmReviewDeleteModal = ({ reviewId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews);
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(deleteReviewThunk(reviewId));
    closeModal();
  };

  const handleNo = () => {
    closeModal();
  };

  return (
    <div className="confirm-container">
      <form onSubmit={handleDelete}>
        <h1>Confirm Delete</h1>
        <p className="question">Are you sure you want to delete?</p>
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

export default ConfirmReviewDeleteModal;
