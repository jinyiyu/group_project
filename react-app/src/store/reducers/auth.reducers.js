import {
  GENERATE_TOKEN_REQUEST,
  GENERATE_TOKEN_SUCCESS,
  GENERATE_TOKEN_FAILURE,
  FETCH_TOKEN_HISTORY_REQUEST,
  FETCH_TOKEN_HISTORY_SUCCESS,
  FETCH_TOKEN_HISTORY_FAILURE,
} from "../actions/auth.actions";

const initialState = {
  loading: false,
  success: false,
  token: null,
  error: null,
  tokenHistory: [],
  historyLoading: false,
  historyError: null,
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
    case FETCH_TOKEN_HISTORY_REQUEST:
      return { ...state, historyLoading: true, historyError: null };
    case FETCH_TOKEN_HISTORY_SUCCESS:
      return {
        ...state,
        historyLoading: false,
        tokenHistory: action.payload,
      };
    case FETCH_TOKEN_HISTORY_FAILURE:
      return { ...state, historyLoading: false, historyError: action.payload };
    default:
      return state;
  }
};

export default authReducer;
