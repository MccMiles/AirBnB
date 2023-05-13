import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { spotActions } from "../../store/spots";
import "./ManageSpot.css";
import OpenModalButton from "../OpenModalButton";
import { Link } from "react-router-dom";
import ConfirmDelete from "../DeleteModal";

const ManageSpot = () => {
  // console.log("Entering ManageSpot component");

  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const fetchSpots = () => dispatch(spotActions.fetchSpots());
    fetchSpots();
  }, [dispatch]);

  const userSpots = Object.values(spots).filter(
    (spot) => spot.ownerId === currentUser.id
  );

  return (
    <div>
      <h1>Manage Your Spots</h1>
      <Link to="/spots/new">
        <button>Create a New Spot</button>
      </Link>

      <div>
        {userSpots.length > 0 ? (
          userSpots.map((spot) => (
            <div className="spot-card" key={spot.id}>
              <div className="image-box">
                <Link to={`/spots/${spot.id}`} className="spot-link">
                  <img
                    className="spots-image"
                    src={spot.previewImage}
                    alt={spot.name}
                    style={{ height: "300px" }}
                  />
                </Link>
              </div>

              <div className="detail-box">
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

              <div className="button-box">
                <Link to={`/spots/${spot.id}/edit`}>
                  <button>Update</button>
                </Link>
                <OpenModalButton
                  buttonText={"Delete"}
                  className={"delete-button"}
                  modalComponent={<ConfirmDelete spotId={spot?.id} />}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="no-spot">
            <h1>You haven't created any spots yet.</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSpot;
