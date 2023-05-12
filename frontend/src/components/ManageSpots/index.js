//add css styles

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import "./ManageSpot.css";
import OpenModalButton from "../OpenModalButton";
import { Link } from "react-router-dom";
import ConfirmDelete from "../DeleteModal";

const ManageSpot = () => {
  console.log("Entering ManageSpot component");

  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const currentUser = useSelector((state) => state.session.user);
  console.log("spots: ", spots);
  console.log("currentUser: ", currentUser);

  useEffect(() => {
    console.log("Entering useEffect");
    const fetchSpots = () => dispatch(spotActions.fetchSpots());
    fetchSpots();
    console.log("Leaving useEffect");
  }, [dispatch]);

  const userSpots = Object.values(spots).filter(
    (spot) => spot.ownerId === currentUser.id
  );

  console.log("userSpots: ", userSpots);

  return userSpots.length > 0 ? (
    <div>
      <h1>Manage Your Spots</h1>
      <Link to="/spots/new">
        <button>Create a New Spot</button>
      </Link>
      <div className="spots-container">
        {userSpots.map((spot) => (
          <Link to={`/spots/${spot.id}`} className="spot-link" key={spot.id}>
            <div className="spot-card" key={spot.id} data-spot-name={spot.name}>
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
  ) : (
    <div>
      <h1>You haven't created any spots yet.</h1>
      <Link to="/spots/new">
        <button>Create a New Spot</button>
      </Link>
    </div>
  );
};

export default ManageSpot;
