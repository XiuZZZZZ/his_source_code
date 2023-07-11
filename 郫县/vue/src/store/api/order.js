// import http from './common';
import { runServerMethod } from '../../store/api/runServerMethod';
import session from './session';

const className = 'Nur.CommonInterface.Order';
const findMasterItem = 'findMasterItem';
// const apiUrlLocLinkWards = '/locLinkWards';
export default {
  className,
  findMasterItem,
  getAttachOrder(...args) {
    return runServerMethod(className, 'getAttachOrder', ...args);
  },
  getCollectAttention(orderID) {
    const userID = session.USER.USERID;
    const locID = session.USER.CTLOCID;
    const groupID = session.USER.GROUPID;
    return runServerMethod(className, 'getCollectAttention', orderID, userID, locID, groupID);
  },
  getLibPhaRule(orderID) {
    const userID = session.USER.USERID;
    const locID = session.USER.CTLOCID;
    const groupID = session.USER.GROUPID;
    return runServerMethod(className, 'getLibPhaRule', orderID, userID, locID, groupID);
  }
};
