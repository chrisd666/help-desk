const { actionTypes } = require('./types');

const initialState = {
  isLoggedIn: false,
  jwt: null,
  jwtToken: null,
  changeLoginState: null,
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.IS_LOGGED_IN:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
