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
    payload: reviewId,
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
      const deletedReview = await response.json();
      if (response.ok) {
        console.log("Deleted review:", deletedReview); // Add this line
        dispatch(reviewActions.deleteReview(deletedReview.reviewId));
      }
      return deletedReview;
    } catch (error) {
      console.error(error);
    }
  },

  fetchUser: (userId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      console.error(error);
    }
  },
};
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "reviews/setReviews":
      return { ...state, reviews: action.payload, error: null };

    case "reviews/createReview":
      return {
        ...state,
        reviews: { ...state.reviews, [action.payload.id]: action.payload },
        error: null,
      };

    case "reviews/updateReview":
      const { reviewId, updatedReview } = action.payload;
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [reviewId]: { ...state.reviews[reviewId], ...updatedReview },
        },
        error: null,
      };

    case "reviews/deleteReview":
      console.log("Deleting review:", action.payload); // Add this line
      const { [action.payload]: deletedReview, ...rest } = state.reviews;
      return { ...state, reviews: rest, error: null };

    case "reviews/setError":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default reviewsReducer;
