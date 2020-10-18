import { actionTypes } from './types';

export const changeLoginState = (isLoggedIn, user, jwt) => ({
  type: actionTypes.IS_LOGGED_IN,
  payload: { isLoggedIn, user, jwt },
});
