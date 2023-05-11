import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SpotForm.css";
import { spotActions } from "../../store/spots";

import { useHistory } from "react-router-dom";

import jungleImage01 from "../../images/jungleImage01.jpeg";
import jungleImage02 from "../../images/jungleImage02.jpeg";
import jungleImage03 from "../../images/jungleImage03.jpeg";
import jungleImage04 from "../../images/jungleImage04.jpeg";
import jungleImage05 from "../../images/jungleImage05.jpeg";

function SpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState({
    url: "",
    previewImg: true,
  });
  const [image2, setImage2] = useState({ url: "", previewImg: false });
  const [image3, setImage3] = useState({ url: "", previewImg: false });
  const [image4, setImage4] = useState({ url: "", previewImg: false });
  const [image5, setImage5] = useState({ url: "", previewImg: false });
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  const currentDetails = useSelector((state) => state.spots);

  const sessionUser = useSelector((state) => state.session.user);

  const userId = sessionUser.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const spotImages = [previewImage, image2, image3, image4, image5];

    const formData = {
      country,
      city,
      state,
      address,
      description,
      price,
      name,
    };

    let hasInvalidImage = false;
    let totalErrors = {};

    spotImages.forEach((image, index) => {
      if (image.url) {
        if (!/\.(png|jpe?g)$/i.test(image.url)) {
          hasInvalidImage = true;
        }
      }
    });

    if (hasInvalidImage) {
      totalErrors.imageErrors = "Image URLs must end in .png, .jpg, or .jpeg";
    }

    if (!formData.country) {
      totalErrors.country = "Country is required";
    }

    if (!formData.address) {
      totalErrors.address = "Address is required";
    }

    if (!formData.city) {
      totalErrors.city = "City is required";
    }

    if (!formData.state) {
      totalErrors.state = "State is required";
    }

    if (!formData.description || formData.description.length < 30) {
      totalErrors.description =
        "Description must be at least 30 characters long";
    }

    if (!formData.name) {
      totalErrors.name = "Name is required";
    }

    if (!formData.price) {
      totalErrors.price = "Price is required";
    } else if (isNaN(parseFloat(formData.price))) {
      totalErrors.price = "Price must be a number";
    }

    if (Object.keys(imageErrors).length > 0) {
      totalErrors = { ...totalErrors, ...imageErrors };
    }

    if (Object.keys(totalErrors).length > 0) {
      setErrors(totalErrors);
    } else {
      await dispatch(spotActions.createSpot(formData))
        .then(() => {
          history.push("/spots");
        })
        .catch((error) => {
          console.log("Error creating spot:", error);
          // Update error state if necessary
        });
    }
  };

  const handleFillButtonClick = () => {
    setCountry("Costa Rica");
    setAddress("123 Jungle Cabin Road");
    setCity("San José");
    setState("San José");
    setDescription(
      "Experience the beauty of the jungle in this cozy cabin surrounded by lush greenery and exotic wildlife. Perfect for nature lovers and adventure seekers."
    );
    setPrice("180");
    setPreviewImage({
      url: jungleImage01,
      previewImg: true,
    });
    setImage2({
      url: jungleImage02,
      previewImg: false,
    });
    setImage3({
      url: jungleImage03,
      previewImg: false,
    });
    setImage4({
      url: jungleImage04,
      previewImg: false,
    });
    setImage5({
      url: jungleImage05,
      previewImg: false,
    });

    setName("Serene Jungle Retreat");
    setErrors({});
    setImageErrors({});
  };

  return currentDetails || userId ? (
    <div className="main">
      <form className="spot-form" onSubmit={handleSubmit}>
        <button
          className="button fill-button"
          type="button"
          onClick={handleFillButtonClick}
        >
          Fill
        </button>
        <br />
        <div className="section">
          <h1>Create a new Spot</h1>
          <h2>Where's your place located at?</h2>
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
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best featuires of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            className="description"
            value={description}
            placeholder="Please Write at least 30 characters"
            rows="12"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p className="errors">{errors.description}</p>
          <br />
        </div>

        <div className="section">
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests attention with a spot title that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            value={name}
            placeholder="Name of your spot"
            onChange={(e) => setName(e.target.value)}
          />
          <p className="errors">{errors.name}</p>
        </div>

        <div className="section">
          <h2>Set a base price for your Spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          ${" "}
          <input
            type="text"
            value={price}
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
          />
          <p className="errors">{errors.price}</p>
          <br />
        </div>

        <div className="section">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          {errors.imageErrors && <p className="errors">{errors.imageErrors}</p>}
          <input
            type="text"
            placeholder="Preview Image URL"
            value={previewImage.url}
            onChange={(e) =>
              setPreviewImage({ url: e.target.value, previewImg: true })
            }
          />

          <br />
          <input
            type="text"
            placeholder="Image URL"
            value={image2.url}
            onChange={(e) =>
              setImage2({ url: e.target.value, previewImg: false })
            }
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image3.url}
            onChange={(e) =>
              setImage3({ url: e.target.value, previewImg: false })
            }
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image4.url}
            onChange={(e) =>
              setImage4({ url: e.target.value, previewImg: false })
            }
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image5.url}
            onChange={(e) =>
              setImage5({ url: e.target.value, previewImg: false })
            }
          />
        </div>

        <button type="submit" className="button submit-button">
          Create Spot
        </button>
      </form>
    </div>
  ) : null;
}

export default SpotForm;
