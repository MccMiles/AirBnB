import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";

function ShowSpots({ isLoaded }) {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  if (!spots) {
    return <div>Loading...</div>;
  }

  return (
    isLoaded && (
      <div className="spots-container">
        {spots.map((spot) => (
          <div className="spot-card" key={spot.id} data-spot-name={spot.name}>
            <img
              className="spot-card-image"
              src={spots.previewImage}
              alt={spot.name}
              style={{ width: "200px", height: "200px" }}
            />
            <div className="spot-card-details">
              <h2 className="spot-card-location">
                {spot.city}, {spot.state}
              </h2>
              <p className="spot-card-price">${spot.price} night</p>
            </div>
          </div>
        ))}
      </div>
    )
  );
}

export default ShowSpots;
