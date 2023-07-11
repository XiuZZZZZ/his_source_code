// import http from './common';
import { runServerMethod, runServerMethodStr } from '../../store/api/runServerMethod';
import session from './session';

const className = 'Nur.CommonInterface.Patient';
const getBedImages = 'getBedImages';
const getChunkImages = 'getChunkImages';
const findSex = 'findSex';
// const apiUrlBedImages = '/bedImages';
export default {
  className,
  findSex,
  getPatient(episodeID) {
    return runServerMethod(className, 'getPatient', episodeID);
  },
  getImages(episodeID) {
    return runServerMethod(className, getBedImages, episodeID);
  },
  getChunkImages(episodeIDString) {
    return runServerMethod(className, getChunkImages, episodeIDString);
  },
  getTransRecords(episodeID) {
    return runServerMethod(className, 'getTransRecord', episodeID);
  },
  transLoc(episodeID, ctlocID, wardID, mainDoc, transDeptDate, transDeptTime) {
    const userID = session.USER.USERID;
    return runServerMethod('Nur.CommonInterface.Bed', 'transLoc', episodeID, ctlocID, wardID, mainDoc, userID, transDeptDate, transDeptTime);
  },
  transWard(episodeID, wardID, bedID, tempLoc) {
    const userID = session.USER.USERID;
    return runServerMethod('Nur.CommonInterface.Bed', 'transWard', episodeID, wardID, bedID, tempLoc, userID);
  },
  transLocAbnormalOrder(episodeID, loc) {
    return runServerMethod('Nur.CommonInterface.ADTDischarge', 'getAbnormalOrder', episodeID, 'Trans', '', '', loc);
    // return abnormalOrderStr;
  },
  ifHasTransOrder(episodeID, loc, locLinkWard) {
    return runServerMethod('Nur.CommonInterface.ADTDischarge', 'ifHasTransOrd', episodeID, loc, locLinkWard);
  },
  updateMainDocNur(episodeID, mainDocID, mainNurIDArray) {
    const userID = session.USER.USERID;
    return runServerMethodStr(`Nur.CommonInterface.Patient:updateMainDocNur:${episodeID}:${mainDocID}:${mainNurIDArray}:${userID}:`);
  },
  transLocApply(episodeID, ctlocID, wardID, transDeptDate, transDeptTime) {
    const userID = session.USER.USERID;
    return runServerMethod('Nur.CommonInterface.Bed', 'transLocApply', episodeID, ctlocID, wardID, userID, transDeptDate, transDeptTime);
  },
  cancelTransLocApply(episodeID) {
    const userID = session.USER.USERID;
    return runServerMethod('Nur.CommonInterface.Bed', 'cancelTransLocApply', episodeID, userID);
  },
  getTransLocDateTime(episodeID) {
    return runServerMethod('Nur.CommonInterface.Bed', 'getTransLocDateTime', episodeID);
  }
};

