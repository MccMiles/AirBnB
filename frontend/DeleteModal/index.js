import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";

const ConfirmDelete = () => {
  const history = useHistory();
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  // Access the spotDetails object from the Redux store
  const currentSpot = useSelector((state) => state.spots.spotDetails);

  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    dispatch(spotActions.deleteSpot(currentSpot.id)).then(closeModal);
    history.push("/spots/current");
  };

  const handleNo = () => {
    closeModal();
    history.push("/spots/current");
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
