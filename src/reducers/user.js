export const SET_JWT_TOKEN = "SET_JWT_TOKEN";
export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const SECOND_SAGA = "SECOND_SAGA";
export const SET_AUTH_TYPE = "SET_AUTH_TYPE";
export const SET_AUTH_WAITING = "SET_AUTH_WAITING";
export const SET_AUTH_ACCEPT = "SET_AUTH_ACCEPT";
export const SET_AUTH_INIT = "SET_AUTH_INIT";

export const setJwtToken = (jwtToken) => ({
  type: SET_JWT_TOKEN,
  payload: jwtToken,
});

export const setUserProfile = (userProfile) => ({
  type: SET_USER_PROFILE,
  payload: userProfile,
});

export const setAuthType = (authType) => ({
  type: SET_AUTH_TYPE,
  payload: authType,
});
export const setAuthWaiting = (data) => ({
  type: SET_AUTH_WAITING,
  payload: data,
});
export const setAuthAccept = (data) => ({
  type: SET_AUTH_ACCEPT,
  payload: data,
});
export const setAuthInit = (data) => ({
  type: SET_AUTH_INIT,
  payload: data,
});

const initialState = {
  jwtToken: null,
  userProfile: null,
  message: "",
  authType: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_JWT_TOKEN:
      return {
        ...state,
        jwtToken: action.payload,
      };

    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };

    case SET_AUTH_TYPE:
      return {
        ...state,
        authType: action.payload,
      };

    case SET_AUTH_WAITING:
      return {
        ...state,
        authType: state.authType.concat(action.payload),
      };

    case SET_AUTH_ACCEPT:
      return {
        ...state,
        authType: state.authType.map((item) => {
          if (item.cid === action.payload.cid) {
            return action.payload;
          }
          return item;
        }),
      };

    case SET_AUTH_INIT:
      return {
        ...state,
        authType: state.authType.filter(
          (item) => item.cid !== action.payload.cid
        ),
      };
    case SECOND_SAGA:
      return {
        ...state,
        message: action.payload,
      };

    default:
      return state;
  }
};

export default user;
