// import http from './common';
import { runServerMethod } from '../../store/api/runServerMethod';
import session from './session';

const className = 'Nur.CommonInterface.Loc';
const getLocLinkWards = 'getLocLinkWards';
const getLocs = 'getLocs';
const getTransLocLinkWardsByAdm = "getTransLocLinkWardsByAdm";
// const apiUrlLocLinkWards = '/locLinkWards';
export default {
  className,
  getLocs,
  getLocLinkWards() {
    const locID = session.USER.CTLOCID;
    const currWardID = session.USER.WARDID;
    return runServerMethod(className, getLocLinkWards, locID, currWardID);
  },
  getLocLinkWardsExcept(episodeID) {
    const currWardID = session.USER.WARDID;
    return runServerMethod(className, getTransLocLinkWardsByAdm, episodeID, currWardID, "Y");
  },
};
