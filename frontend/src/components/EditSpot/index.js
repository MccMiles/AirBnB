import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { spotActions } from "../../store/spots";

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(true);

  const currentSpot = useSelector((state) => state.spots.spotDetails);
  const ownerId = useSelector((state) => state.spots.spotDetails?.Owner?.id);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(spotActions.fetchSpotDetailsById(spotId)).finally(() => {
      setLoading(false);
    });
  }, [dispatch, spotId]);

  useEffect(() => {
    if (!loading && currentSpot && ownerId === currentSpot?.Owner?.id) {
      setAddress(currentSpot?.address || "");
      setCountry(currentSpot?.country || "");
      setCity(currentSpot?.city || "");
      setState(currentSpot?.state || "");
      setDescription(currentSpot?.description || "");
      setPrice(currentSpot?.price || "");
      setName(currentSpot?.name || "");
    }
  }, [ownerId, loading, currentSpot]);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const spotData = {
      address,
      country,
      city,
      state,
      description,
      price,
      name,
    };

    try {
      await dispatch(spotActions.updateSpot(spotId, spotData));
      history.push(`/spots/${spotId}`);
    } catch (error) {
      setErrors(error.response.data.errors);
    }
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
              placeholder="City"
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
              placeholder="Tell us about your place"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
          <label className="label">
            Price per night <p className="errors">{errors.price}</p>
            <br />
            <input
              type="text"
              value={price}
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
        </div>

        <div className="section">
          <h2>Title your spot</h2>
          <label className="label">
            Title <p className="errors">{errors.name}</p>
            <br />
            <input
              type="text"
              value={name}
              placeholder="Title"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>

        <div className="actions">
          {/* <Link to={`/spots/${spotId}`} className="cancel-link">
            <button type="submit">Update Spot</button>
          </Link> */}
          <button type="submit">Update Spot</button>
          <Link to={`/spots/current`} className="cancel-link">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default UpdateSpot;
