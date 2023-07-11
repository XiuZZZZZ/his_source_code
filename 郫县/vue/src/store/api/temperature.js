import axios from "axios";
import { runServerMethod } from "./runServerMethod";
import session from "./session";
import utils from "../../comm/utils";

const className = "Nur.CommonInterface.Temperature";
const findEventType = "findEventType";
const findEvent = "findEvent";
const findItem = "findItem";
const findTime = "findTime";
const getAllTempConfig = "getAllTempConfig";
const getDayTimes = "getDayTimes";
const getTempDataByDay = "getTempDataByDay";
const getTempDataByTime = "getTempDataByTime";
const getPatientsTempDataByTime = "getPatientsTempDataByTime";
const getTempDataByDateArea = "getTempDataByDateArea";
const getSplitCharDecimal = "getSplitCharDecimal";
const saveObsDataByDay = "saveObsDataByDay";
const saveObsDataByTime = "saveObsDataByTime";
const saveObsData = "saveObsData";
const insertEvent = "insertEvent";
const deleteEvent = "deleteEvent";
const updateEvent = "updateEvent";
const ifTimeCanInput = "ifTimeCanInput";

export default {
  className,
  findEventType,
  findEvent,
  findItem,
  findTime,
  getTempConfig(locID, babyFlag) {
    const promises = [];
    let times;
    let tempConfig;
    let splitChar;
    const getTimesPromis = runServerMethod(className, getDayTimes).then(
      result => {
        times = result;
      }
    );
    const getMeasureItemsPromis = runServerMethod(
      className,
      getAllTempConfig,
      locID,
      babyFlag
    ).then(result => {
      tempConfig = result;
    });
    const getSplitCharDecimalPromis = runServerMethod(
      className,
      getSplitCharDecimal
    ).then(result => {
      Object.keys(result).forEach(key => {
        result[key] = String.fromCharCode(result[key]);
      });
      splitChar = result;
    });
    promises.push(getTimesPromis);
    promises.push(getMeasureItemsPromis);
    promises.push(getSplitCharDecimalPromis);
    return axios.all(promises).then(() => {
      const singleConfig = {
        times,
        measureItems: tempConfig.SingleConfig,
        splitChar
      };
      const mutiplyConfig = {
        times,
        measureItems: tempConfig.MutiplyConfig,
        singleConfig,
        splitChar
      };
      return {
        singleConfig,
        mutiplyConfig
      };
    });
  },
  ifHeadNurse() {
    return runServerMethod(
      "Nur.Examples.Test1",
      "IfHeadNurse",
      session.USER.USERID
    );
  },
  getTempDataByDay(episodeID, date) {
    return runServerMethod(className, getTempDataByDay, episodeID, date);
  },
  saveObsDataByDay(episodeID, valueString, date) {
    return runServerMethod(
      className,
      saveObsDataByDay,
      episodeID,
      valueString,
      session.USER.USERID,
      date,
      session.USER.CTLOCID
    );
  },
  getTempDataByTime(episodeID, date, time) {
    return runServerMethod(className, getTempDataByTime, episodeID, date, time);
  },
  getPatientTempDataByDateArea(episodeID, startDate, endDate) {
    return runServerMethod(
      className,
      getTempDataByDateArea,
      episodeID,
      startDate,
      endDate
    );
  },
  getPatientsTempDataByTime(episodeIDArray, date, time) {
    const dayData = {};
    const promises = [];
    const promiseFactory = chunk =>
      runServerMethod(
        className,
        getPatientsTempDataByTime,
        chunk.join("^"),
        date,
        time
      ).then(data => {
        if (typeof data !== "string") {
          Object.assign(dayData, data);
        }
      });
    const chunks = utils.splitChunk([], 50, episodeIDArray);
    chunks.forEach(chunk => {
      promises.push(promiseFactory(chunk));
    });
    return axios.all(promises).then(() => dayData);
  },
  saveObsDataByTime(valueString, date, time) {
    return runServerMethod(
      className,
      saveObsDataByTime,
      valueString,
      session.USER.USERID,
      date,
      time,
      session.USER.CTLOCID
    );
  },
  saveObsData(episodeID, valueString) {
    return runServerMethod(
      className,
      saveObsData,
      episodeID,
      valueString,
      session.USER.USERID,
      session.USER.CTLOCID
    );
  },
  insertEvent(episodeID, date, time, typeID) {
    return runServerMethod(
      className,
      insertEvent,
      episodeID,
      date,
      time,
      typeID,
      session.USER.USERID
    );
  },
  updateEvent(ID, date, time, typeID) {
    return runServerMethod(
      className,
      updateEvent,
      ID,
      date,
      time,
      typeID,
      session.USER.USERID
    );
  },
  deleteEvent(ID) {
    return runServerMethod(className, deleteEvent, ID, session.USER.USERID);
  },
  getSplitCharDecimal() {
    return runServerMethod(className, getSplitCharDecimal);
  },
  ifTimeCanInput(EpisodeIDs, SearchDate, SearchTime, WardID) {
    return runServerMethod(
      className,
      ifTimeCanInput,
      EpisodeIDs,
      SearchDate,
      SearchTime,
      WardID
    );
  }
};
