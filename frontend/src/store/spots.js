import { csrfFetch } from "./csrf";

export const spotActions = {
  setSpots: (spots) => ({
    type: "spots/setSpots",
    payload: spots,
  }),

  setSpotDetails: (spotDetails) => ({
    type: "spots/setSpotDetails",
    payload: spotDetails,
  }),

  removeSpot: (spotId) => ({
    type: "spots/removeSpot",
    payload: spotId,
  }),

  setErrors: (errors) => ({
    type: "spots/setErrors",
    payload: errors,
  }),

  createSpot: (spotData) => async (dispatch) => {
    try {
      console.log("Creating spot...");
      const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spotData),
      });

      if (!response.ok) {
        throw new Error("Failed to create spot");
      }

      const data = await response.json();

      if (data.errors) {
        // Handle errors returned from the API
        dispatch(spotActions.setErrors(data.errors));
      } else {
        // Dispatch an action to set the created spot
        console.log("Spot created:", data);
        dispatch(spotActions.setSpotDetails(data));
      }
    } catch (error) {
      console.error("Error creating spot:", error);
      // Handle error if necessary
    }
  },

  createSpotImage: (spotId, spotImage) => ({
    type: "spots/createSpotImage",
    payload: {
      spotId,
      spotImage,
    },
  }),

  updateSpot: (spotId, spot) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spot),
      });
      if (!response.ok) {
        throw new Error("Failed to update spot");
      }
      const data = await response.json();
      console.log("Spot updated:", data.updatedSpot);
      dispatch(spotActions.setSpotDetails(data.updatedSpot)); // Update this line
      return data.updatedSpot;
    } catch (error) {
      console.error("Error updating spot:", error);
      throw error;
    }
  },

  deleteSpot: (spotId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete spot");
      }

      dispatch(spotActions.removeSpot(spotId));
      return true; // Return a success flag
    } catch (error) {
      console.error("Error deleting spot:", error);
      return false; // Return a failure flag
    }
  },

  fetchSpots: () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    dispatch(spotActions.setSpots(data.Spots));
  },

  fetchSpotDetailsById: (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();
    dispatch(spotActions.setSpotDetails(data));
  },
};

const initialState = {
  spots: [],
  spotDetails: null,
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "spots/setSpots":
      return { ...state, spots: action.payload };

    case "spots/setSpotDetails":
      return { ...state, spotDetails: action.payload };

    case "spots/createSpot": // Update the action type
      return { ...state, spotDetails: action.payload }; // Update spotDetails with the action payload
    case "spots/createSpotImage":
      return state;

    case "spots/updateSpot":
      return {
        ...state,
        spotDetails: action.payload,
      };

    case "spots/removeSpot":
      const filteredSpots = state.spots.filter(
        (spot) => spot.id !== action.payload
      );
      return { ...state, spots: filteredSpots };

    default:
      return state;
  }
};

export default spotsReducer;
