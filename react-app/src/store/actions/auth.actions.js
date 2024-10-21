import axios from "axios";

export const GENERATE_TOKEN_REQUEST = "GENERATE_TOKEN_REQUEST";
export const GENERATE_TOKEN_SUCCESS = "GENERATE_TOKEN_SUCCESS";
export const GENERATE_TOKEN_FAILURE = "GENERATE_TOKEN_FAILURE";

const BASED_URI = "http://localhost:3000";

export const generateToken = (email) => async (dispatch) => {
  dispatch({ type: GENERATE_TOKEN_REQUEST });
  try {
    const response = await axios.post(`${BASED_URI}/hr/hiring/token`, {
      email,
    });
    dispatch({ type: GENERATE_TOKEN_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GENERATE_TOKEN_FAILURE, payload: error.response.data });
  }
};
