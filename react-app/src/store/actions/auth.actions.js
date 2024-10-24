import axios from "axios";

export const GENERATE_TOKEN_REQUEST = "GENERATE_TOKEN_REQUEST";
export const GENERATE_TOKEN_SUCCESS = "GENERATE_TOKEN_SUCCESS";
export const GENERATE_TOKEN_FAILURE = "GENERATE_TOKEN_FAILURE";

export const FETCH_TOKEN_HISTORY_REQUEST = "FETCH_TOKEN_HISTORY_REQUEST";
export const FETCH_TOKEN_HISTORY_SUCCESS = "FETCH_TOKEN_HISTORY_SUCCESS";
export const FETCH_TOKEN_HISTORY_FAILURE = "FETCH_TOKEN_HISTORY_FAILURE";

const BASED_URI = "http://localhost:3000";

export const generateToken =
  ({ email, fullName }) =>
  async (dispatch) => {
    dispatch({ type: GENERATE_TOKEN_REQUEST });
    try {
      const response = await axios.post(`${BASED_URI}/hr/hiring/token`, {
        email,
        fullName,
      });
      dispatch({ type: GENERATE_TOKEN_SUCCESS, payload: response.data });
      dispatch(fetchTokenHistory());
    } catch (error) {
      dispatch({ type: GENERATE_TOKEN_FAILURE, payload: error.response.data });
    }
  };

export const fetchTokenHistory = () => async (dispatch) => {
  dispatch({ type: FETCH_TOKEN_HISTORY_REQUEST });
  try {
    const response = await axios.get(`${BASED_URI}/hr/hiring/token`);
    dispatch({
      type: FETCH_TOKEN_HISTORY_SUCCESS,
      payload: response.data.history,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TOKEN_HISTORY_FAILURE,
      payload: error.response?.data?.message || "Failed to fetch token history",
    });
  }
};
