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

  createSpot: (spot) => async (dispatch) => {
    try {
      console.log("Creating spot with", spot);
      const response = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spot),
      });
      if (!response.ok) {
        throw new Error("Failed to create spot");
      }
      const data = await response.json();
      console.log("New spot created:", data.newSpot);
      dispatch(spotActions.setSpotDetails(data.newSpot));
      return data.newSpot;
    } catch (error) {
      console.error("Error creating spot:", error);
      throw error;
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

  deleteSpot: (spotId) => ({
    type: "spots/deleteSpot",
    payload: spotId,
  }),

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

    case "spots/deleteSpot":
      const remainingSpots = state.spots.filter(
        (spot) => spot.id !== action.payload
      );
      return { ...state, spots: remainingSpots };

    default:
      return state;
  }
};

export default spotsReducer;
