import config from './config';
import { runServerMethod } from './runServerMethod';
import session from './session';

const className = 'Nur.CommonInterface.UserInfo';
const getUserInfo = 'getUserInfo';
const passwordConfirm = 'passwordConfirm';

export default {
  getUserInfo() {
    return runServerMethod(
      className,
      getUserInfo,
      config.loginInfo.userID,
      config.loginInfo.locID,
    );
  },
  passwordConfirm(userCode, password) {
    return runServerMethod(
      className,
      passwordConfirm,
      userCode,
      password,
      session.USER.CTLOCID,
    );
  },
  userPassMatch(userCode, password) {
    return runServerMethod(
      className,
      passwordConfirm,
      userCode,
      password,
    );
  },
};
