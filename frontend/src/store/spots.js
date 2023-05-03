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

  createSpot: (spot) => ({
    type: "spots/createSpot",
    payload: spot,
  }),

  createSpotImage: (spotId, spotImage) => ({
    type: "spots/createSpotImage",
    payload: {
      spotId,
      spotImage,
    },
  }),

  updateSpot: (spot) => ({
    type: "spots/updateSpot",
    payload: spot,
  }),

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

    case "spots/createSpot":
      return { ...state, spots: [...state.spots, action.payload] };

    case "spots/createSpotImage":
      return state;

    case "spots/updateSpot":
      const index = state.spots.findIndex(
        (spot) => spot.id === action.payload.id
      );
      const updatedSpots = [...state.spots];
      updatedSpots[index] = action.payload;
      return { ...state, spots: updatedSpots };

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
