import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import * as spotActions from "../../store/spots";

const EditForm = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const currentSpot = useSelector((state) => state.spots.spotDetails);
  const ownerId = useSelector((state) => state.spots.spotDetails?.Owner?.id);

  useEffect(() => {
    dispatch(spotActions.fetchSpotDetails(spotId)).finally(() => {
      setLoading(false);
    });
  }, [dispatch, spotId]);

  useEffect(() => {
    if (!loading && currentSpot && userId === ownerId) {
      setAddress(currentSpot?.address || "");
      setCountry(currentSpot?.country || "");
      setCity(currentSpot?.city || "");
      setState(currentSpot?.state || "");
      setDescription(currentSpot?.description || "");
      setPrice(currentSpot?.price || "");
      setName(currentSpot?.name || "");
    }
  }, [userId, ownerId, loading, currentSpot]);

  const [country, setCountry] = useState(currentSpot?.country || "");
  const [city, setCity] = useState(currentSpot?.city || "");
  const [state, setState] = useState(currentSpot?.state || "");
  const [address, setAddress] = useState(currentSpot?.address || "");
  const [description, setDescription] = useState(
    currentSpot?.description || ""
  );
  const [price, setPrice] = useState(currentSpot?.price || "");
  const [name, setName] = useState(currentSpot?.name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spot = {
      address,
      country,
      city,
      state,
      description,
      price,
      name,
    };

    await dispatch(spotActions.spotUpdate(spot, spotId)).then((spot) => {
      history.push(`/spots/${spotId}`);
    });
  };

  return !loading && currentSpot ? (
    <div className="Main">
      <form className="spot-form" onSubmit={handleSubmit}>
        <h1>Update Spot</h1>

        <div className="section">
          <h2>Where's your place located?</h2>
          <p>
            Guest will only get your exact address once they booked a
            reservation
          </p>
          <label className="label">
            Country <p className="errors">{errors.country}</p>
            <br />
            <input
              type="text"
              value={country}
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label className="label">
            Street Address <p className="errors">{errors.address}</p>
            <br />
            <input
              type="text"
              value={address}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label className="label">
            City <p className="errors">{errors.city}</p>
            <br />
            <input
              type="text"
              value={city}
              placeholder="dity"
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label className="label">
            State <p className="errors">{errors.state}</p>
            <br />
            <input
              type="text"
              value={state}
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
          </label>
        </div>

        <div className="section">
          <h2>About your place</h2>
          <label className="label">
            Description <p className="errors">{errors.description}</p>
            <br />
            <textarea
              value={description}
              placeholder="Tell guests about your place"
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="label">
            Price per night <p className="errors">{errors.price}</p>
            <br />
            <input
              type="number"
              value={price}
              placeholder="Price per night"
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label className="label">
            Spot name <p className="errors">{errors.name}</p>
            <br />
            <input
              type="text"
              value={name}
              placeholder="Name your spot"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" className="button">
          Update
        </button>

        <Link to={`/spots/${spotId}`} className="link">
          <button className="button">Cancel</button>
        </Link>
      </form>
    </div>
  ) : null;
};

export default EditForm;
