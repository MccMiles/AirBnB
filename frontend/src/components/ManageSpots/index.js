import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import "./ManageSpot.css";
import OpenModalButton from "../OpenModalButton";
import { Link } from "react-router-dom";
import ConfirmDelete from "../DeleteModal";

const ManageSpot = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.spots));
  useEffect(() => {
    dispatch(spotActions.fetchSpots());
  }, [dispatch]);

  return (
    spots && (
      <div>
        <h1>Manage Your Spots</h1>

        {spots.length === 0 ? (
          <Link to="/spots/new">
            <button>Create a New Spot</button>
          </Link>
        ) : null}

        <div className="spots-container">
          {spots.map((spot) => (
            <Link to={`/spots/${spot.id}`} className="spot-link" key={spot.id}>
              <div
                className="spot-card"
                key={spot.id}
                data-spot-name={spot.name}
              >
                <img
                  className="spots-image"
                  src={spot.previewImage}
                  alt={spot.name}
                  style={{ height: "300px" }}
                />

                <div className="card-text">
                  <p>
                    {spot.city}, {spot.state}
                  </p>
                  {isNaN(spot.avgRating) ? (
                    <div className="stars-container">
                      <p className="fa-solid fa-star">New</p>
                    </div>
                  ) : (
                    <div className="stars-container">
                      <p className="fa-solid fa-star">{spot.avgRating}</p>
                    </div>
                  )}
                  <p>${spot.price} night</p>
                </div>

                <div className="update-delete">
                  <Link to={`/spots/${spot.id}/edit`}>
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
    )
  );
};

export default ManageSpot;
