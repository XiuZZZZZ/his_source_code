import session from './session';
import { runServerMethod } from '../../store/api/runServerMethod';

const className = 'Nur.CommonInterface.OrderSheet';
const getSheetsOfSSGroup = 'getSheetsOfSSGroup';
const getSheetColumns = 'getSheetColumns';
const getSheetButtons = 'getSheetButtons';
const getDisposeStateInfo = 'getDisposeStateInfo';
const getSheetDateTime = 'getSheetDateTime';
const getSheetDispStateInfo = 'getSheetDispStateInfo';
export default {
  getSheetColumns(sheetCode, hospitalID) {
    return runServerMethod(className, getSheetColumns, sheetCode, hospitalID);
  },
  getSheetButtons(sheetCode, hospitalID, excuteOrderFlag, printedOrderFlag) {
    return runServerMethod(className, getSheetButtons, sheetCode, hospitalID, excuteOrderFlag, printedOrderFlag);
  },
  getSheetDateTime(sheetCode, hospitalID) {
    return runServerMethod(className, getSheetDateTime, sheetCode, hospitalID);
  },
  getSheetsOfSSGroup() {
    return runServerMethod(className, getSheetsOfSSGroup, session.USER.GROUPID, session.USER.CTLOCID);
  },
  getDisposeStateInfo() {
    return runServerMethod(className, getDisposeStateInfo);
  },
  getSheetDispStateInfo(sheetCode, hospitalID) {
    return runServerMethod(className, getSheetDispStateInfo, sheetCode, hospitalID);
  },
};
