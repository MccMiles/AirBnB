import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spotActions } from "../../store/spots";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./DeleteModal.css";

const ConfirmDelete = ({ spotId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const modalRef = useRef(null);
  const currentSpot = useSelector((state) => state.spots.spots);

  const { closeModal } = useModal();

  const handleDelete = async () => {
    if (currentSpot.length > 0) {
      await dispatch(spotActions.deleteSpot(spotId));
      closeModal();
    }
  };

  const handleNo = () => {
    closeModal();
  };

  return (
    <div className="confirmation-box" ref={modalRef}>
      <form onSubmit={handleDelete}>
        <h1>Confirm Delete</h1>
        <p className="question">Are you sure you want to delete this spot?</p>
        <div className="button-box">
          <button className="confirm-button">Yes (Delete Spot)</button>
          <button className="confirm-button" onClick={handleNo}>
            <p>No (Keep Spot)</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmDelete;
