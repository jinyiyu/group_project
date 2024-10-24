import axios from "axios";

export const FETCH_APPLICATIONS_REQUEST = "FETCH_APPLICATIONS_REQUEST";
export const FETCH_APPLICATIONS_SUCCESS = "FETCH_APPLICATIONS_SUCCESS";
export const FETCH_APPLICATIONS_FAILURE = "FETCH_APPLICATIONS_FAILURE";

export const GIVE_FEEDBACK_REQUEST = "GIVE_FEEDBACK_REQUEST";
export const GIVE_FEEDBACK_SUCCESS = "GIVE_FEEDBACK_SUCCESS";
export const GIVE_FEEDBACK_FAILURE = "GIVE_FEEDBACK_FAILURE";

export const FETCH_INDIVIDUAL_APPLICATION_REQUEST =
  "FETCH_INDIVIDUAL_APPLICATION_REQUEST";
export const FETCH_INDIVIDUAL_APPLICATION_SUCCESS =
  "FETCH_INDIVIDUAL_APPLICATION_SUCCESS";
export const FETCH_INDIVIDUAL_APPLICATION_FAILURE =
  "FETCH_INDIVIDUAL_APPLICATION_FAILURE";
export const UPDATE_APPLICATION_STATUS = "UPDATE_APPLICATION_STATUS";

const BASED_URI = "http://localhost:3000";

export const fetchApplications = () => async (dispatch) => {
  dispatch({ type: FETCH_APPLICATIONS_REQUEST });
  try {
    const response = await axios.get(`${BASED_URI}/hr/hiring/applications`);
    dispatch({ type: FETCH_APPLICATIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: FETCH_APPLICATIONS_FAILURE,
      payload: error.response.data,
    });
  }
};

export const fetchIndividualApplication = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_INDIVIDUAL_APPLICATION_REQUEST });
  try {
    const response = await axios.get(
      `${BASED_URI}/hr/hiring/applications/${userId}`
    );
    dispatch({
      type: FETCH_INDIVIDUAL_APPLICATION_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_INDIVIDUAL_APPLICATION_FAILURE,
      payload: error.response?.data || "Error fetching application",
    });
  }
};

export const updateApplicationStatus =
  (userId, status, feedback = "") =>
  async (dispatch) => {
    try {
      await axios.put(`${BASED_URI}/hr/hiring/applications/${userId}`, {
        status,
        feedback,
      });
      dispatch({
        type: UPDATE_APPLICATION_STATUS,
        payload: { userId, status, feedback },
      });
      dispatch(fetchIndividualApplication(userId));
      dispatch(fetchApplications());
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

export const giveFeedback = (userId, description) => async (dispatch) => {
  dispatch({ type: GIVE_FEEDBACK_REQUEST });
  try {
    const response = await axios.put(
      `${BASED_URI}/hr/hiring/applications/${userId}/feedback`,
      {
        description,
      }
    );
    dispatch({ type: GIVE_FEEDBACK_SUCCESS, payload: response.data });
    dispatch(fetchIndividualApplication(userId));
  } catch (error) {
    dispatch({
      type: GIVE_FEEDBACK_FAILURE,
      payload: error.response?.data || "Error giving feedback",
    });
  }
};
