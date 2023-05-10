import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { reviewActions } from "../../store/reviews";

const DeleteReview = ({ reviewId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const reviews = useSelector((state) => Object.values(state.reviews.reviews));
  const currentUser = useSelector((state) => state.session.user);

  const handleDelete = async (e) => {
    e.preventDefault();
    const review = reviews.find(
      (review) =>
        review.id === parseInt(reviewId) && review.userId === currentUser.id
    );

    await dispatch(reviewActions.deleteReviewThunk(review.id)).then(closeModal);
  };

  const handleNo = () => {
    closeModal();
  };

  return (
    <div className="confirm-container">
      <form onSubmit={handleDelete}>
        <h1>Confirm Delete</h1>
        <p className="confirm-question">Are you sure you want to delete?</p>
        <div className="confirm-buttons">
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
