import React from "react";
import { useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteModal.css";

const ConfirmDelete = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    const a = spotActions.deleteSpot(spotId);

    try {
      const success = await dispatch(spotActions.deleteSpot(spotId));
      if (success) {
        closeModal();
      } else {
        console.error("Error deleting spot");
        closeModal();
        // console.log("FAILED");
      }
    } catch (error) {
      console.error("Error deleting spot:", error);
      closeModal();
      // console.log("FAILED");
    }
  };

  const handleNo = () => {
    closeModal();
  };

  return (
    <div className="confirmation-box">
      <form onSubmit={handleDelete}>
        <h1>Confirm Delete</h1>
        <p className="question">Are you sure you want to delete this spot?</p>
        <div className="button-box">
          <button type="submit" className="confirm-button">
            Yes (Delete Spot)
          </button>
          <button className="confirm-button" onClick={handleNo}>
            No (Keep Spot)
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmDelete;
