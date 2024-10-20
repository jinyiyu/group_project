import {
  GENERATE_TOKEN_REQUEST,
  GENERATE_TOKEN_SUCCESS,
  GENERATE_TOKEN_FAILURE,
} from "../actions/auth.actions";

const initialState = {
  loading: false,
  success: false,
  token: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERATE_TOKEN_REQUEST:
      return { ...state, loading: true, success: false, error: null };
    case GENERATE_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        token: action.payload.token,
      };
    case GENERATE_TOKEN_FAILURE:
      return { ...state, loading: false, error: action.payload.message };
    default:
      return state;
  }
};

export default authReducer;
