import { csrfFetch } from "./csrf";

const initialState = {
  reviews: {},
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

  deleteReview: (reviewId) => ({
    type: "reviews/deleteReview",
    payload: reviewId,
  }),

  fetchReviews: (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(reviewActions.setReviews(data.Reviews));
    }
  },

  postReview: (spotId, review) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });
    if (response.ok) {
      const newReview = await response.json();
      dispatch(reviewActions.createReview(newReview));
      return newReview;
    } else {
      const data = await response.json();
      return data;
    }
  },

  deleteReviewThunk: (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const deletedReview = await response.json();
    dispatch(reviewActions.deleteReview(deletedReview.reviewId));
    return deletedReview;
  },
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "reviews/setReviews":
      const normalizedReviews = {};
      action.payload.forEach((review) => {
        normalizedReviews[review.id] = review;
      });
      return { ...state, reviews: normalizedReviews };

    case "reviews/createReview":
      return {
        ...state,
        reviews: { ...state.reviews, [action.payload.id]: action.payload },
      };

    case "reviews/deleteReview":
      const { [action.payload]: deletedReview, ...rest } = state.reviews;
      return { ...state, reviews: rest };

    default:
      return state;
  }
};

export default reviewsReducer;
