import {
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATIONS_SUCCESS,
  FETCH_APPLICATIONS_FAILURE,
  FETCH_INDIVIDUAL_APPLICATION_REQUEST,
  FETCH_INDIVIDUAL_APPLICATION_SUCCESS,
  FETCH_INDIVIDUAL_APPLICATION_FAILURE,
  UPDATE_APPLICATION_STATUS,
} from "../actions/application.actions";

const initialState = {
  loading: false,
  notStarted: [],
  pending: [],
  approved: [],
  rejected: [],
  error: null,
  application: null,
};

const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APPLICATIONS_REQUEST:
    case FETCH_INDIVIDUAL_APPLICATION_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_APPLICATIONS_SUCCESS:
      const notStarted = action.payload.filter(
        (app) => app.onboardStatus === "not started"
      );
      const pending = action.payload.filter(
        (app) => app.onboardStatus.toLowerCase() === "pending"
      );
      const approved = action.payload.filter(
        (app) => app.onboardStatus.toLowerCase() === "approved"
      );
      const rejected = action.payload.filter(
        (app) => app.onboardStatus.toLowerCase() === "rejected"
      );

      return {
        ...state,
        loading: false,
        notStarted,
        pending,
        approved,
        rejected,
      };
    case FETCH_INDIVIDUAL_APPLICATION_SUCCESS:
      return { ...state, loading: false, application: action.payload };
    case FETCH_APPLICATIONS_FAILURE:
    case FETCH_INDIVIDUAL_APPLICATION_FAILURE:
      return { ...state, loading: false, error: action.payload.message };
    default:
      return state;
  }
};

export default applicationReducer;
