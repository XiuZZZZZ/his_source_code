/**
 * @description 床位相关js songchao
 *
 */
import {
  runServerMethod,
  runServerMethodStr,
} from '../../store/api/runServerMethod';
import session from './session';

export default {
  transToBedServer(episodeID, bedID, mainDoc, mainNurse, transDate,
    transTime) {
    const userID = session.USER.USERID;
    const timeMin = transTime.substring(3, 5);
    const timeHou = transTime.substring(0, 2);
    // eslint-disable-next-line no-param-reassign
    transTime = `${timeHou}^${timeMin}`;
    return runServerMethodStr(
      `Nur.CommonInterface.Bed:transToBed:${episodeID}:${bedID}:${userID}:${mainDoc}:${mainNurse}:${transDate}:${transTime}:`,
    );
  },
  borrowBedServer(
    episodeID,
    bedID,
    reason,
    startDate,
    startTime,
    enddate,
    endtime,
  ) {
    const userID = session.USER.USERID;
    return runServerMethod(
      'Nur.CommonInterface.Bed',
      'borrowBed',
      episodeID,
      bedID,
      reason,
      startDate,
      startTime,
      enddate,
      endtime,
      userID,
    );
  },
  finishBorrowBedServer(bedID) {
    const userID = session.USER.USERID;
    return runServerMethod(
      'Nur.CommonInterface.Bed',
      'finishBorrowBed',
      bedID,
      userID,
    );
  },
  ifBedAvailable(bedID) {
    return runServerMethodStr(
      `Nur.CommonInterface.Bed:ifBedAvailable:${bedID}:`,
    );
  },
  ifRoomSexRestrict(episodeID, bedID) {
    return runServerMethodStr(
      `Nur.CommonInterface.Bed:ifRoomSexRestrict:${episodeID}:${bedID}:`,
    );
  },
  getBedXml(episodeID, ctlocId) {
    return runServerMethodStr(
      `Nur.CommonInterface.Bed:getBedXml:${episodeID}:${ctlocId}:`,
    );
  },
  getBedMenu(ifFilter) {
    const wardID = session.USER.WARDID;
    const groupID = session.USER.GROUPID;
    return runServerMethod('Nur.BedChartMenu', 'getBedMenu', ifFilter, wardID, groupID);
  }
};
