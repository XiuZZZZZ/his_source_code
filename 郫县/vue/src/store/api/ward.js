/**
 * @description 获取病区相关信息的公用js pengjunfu
 * 
 */
import { runServerMethod } from './runServerMethod';

const className = 'Nur.CommonInterface.Ward';
const getBeds = 'getBeds';
const getWardPatients = 'getWardPatients';
const getWardRooms = 'getWardRooms';
const getSummaryInfo = 'getSummaryInfo';
const getWaitingPatients = 'getWaitingPatients';
const getBedDocNurse = 'getBedDocNurse';
const getCurrenDataTime = "getCurrenDataTime";
export default {
  /**
   * @description 获取病区床位信息 pengjunfu
   * 
   * @param {any} wardID 病区ID
   */
  getBeds(wardID) {
    return runServerMethod(className, getBeds, wardID);
  },
  /**
   * @description 获取病区下的病人 pengjunfu
   * 
   * @param {any} wardID 病区ID
   */
  getWardPatients(wardID, episodeID, groupSort, babyFlag) {
    return runServerMethod(className, getWardPatients, wardID, episodeID, groupSort, babyFlag);
  },
  /**
   * @description 获取病区的等候区 pengjunfu
   * 
   * @param {any} wardID 病区ID
   */
  getWardRooms(wardID) {
    return runServerMethod(className, getWardRooms, wardID);
  },
  /**
   * @description 获取病区概要信息 pengjunfu
   * 
   * @param {any} wardID 病区ID
   * @param {function} cb promise回调
   */
  getSummaryInfo(wardID, groupID) {
    return runServerMethod(className, getSummaryInfo, wardID, groupID);
  },
  /**
   * @description 获取等候区病人 pengjunfu
   * 
   * @param {any} wardID 病区ID
   * @param {any} roomID 等候区ID
   * @param {function} cb promise回调
   */
  getWaitingPatients(wardID, roomID) {
    return runServerMethod(className, getWaitingPatients, wardID, roomID);
  },
  /**
 * @description 获取床位关联的值班医护人员 
 * @param {any} bedID 病区ID
 * @param {function} cb promise回调
 */
  getBedDocNurse(bedID) {
    return runServerMethod(className, getBedDocNurse, bedID);
  },
  /**
  * @description 获取床位关联的值班医护人员
  * @param {any} bedID 病区ID
  * @param {function} cb promise回调
  */
  getCurrenDataTime(wardID) {
    return runServerMethod(className, getCurrenDataTime);
  },
};
