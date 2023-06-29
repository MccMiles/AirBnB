import { csrfFetch } from "./csrf";

const initialState = {
  reviews: {},
  error: null,
};

export const reviewActions = {
  setReviews: (reviews) => ({
    type: "reviews/setReviews",
    payload: reviews,
  }),

  createReview: (review) => ({
    type: "reviews/createReview",
    payload: review,
  }),

  updateReview: (reviewId, updatedReview) => ({
    type: "reviews/updateReview",
    payload: { reviewId, updatedReview },
  }),

  deleteReview: (reviewId) => ({
    type: "reviews/deleteReview",
    reviewId,
  }),

  setError: (error) => ({
    type: "reviews/setError",
    payload: error,
  }),

  fetchReviews: (spotId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
      if (response.ok) {
        const data = await response.json();
        dispatch(reviewActions.setReviews(data.Reviews));
      } else {
        throw new Error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error(error);
    }
  },

  postReview: (spotId, review) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(reviewActions.createReview(data));
      } else {
        dispatch(reviewActions.setError(data));
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  updateReviewThunk: (reviewId, updatedReview) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedReview),
      });
      const updatedReviewData = await response.json();
      if (response.ok) {
        dispatch(reviewActions.updateReview(reviewId, updatedReviewData));
      } else {
        dispatch(reviewActions.setError(updatedReviewData));
      }
      return updatedReviewData;
    } catch (error) {
      console.error(error);
    }
  },

  deleteReviewThunk: (reviewId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch(reviewActions.deleteReview(reviewId));
      return data;
    } catch (error) {
      console.error(error);
    }
  },
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "reviews/setReviews":
      const normalizedReviews = {};
      action.payload.forEach((review) => {
        normalizedReviews[review.id] = review;
      });
      return {
        ...state,
        reviews: normalizedReviews,
      };
    case "reviews/createReview":
      const newState = { ...state };
      newState.reviews[action.review.id] = action.review;
      return newState;

    case "reviews/updateReview":
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.payload.id]: action.payload,
        },
      };
    case "reviews/deleteReview":
      const newReviews = { ...state.reviews };
      delete newReviews[action.reviewId];

      return {
        ...state,
        reviews: newReviews,
      };

    case "reviews/setError":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default reviewsReducer;
