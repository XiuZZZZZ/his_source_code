/**
 * @description 系统配置相关js songchao
 * 
 */
import { runServerMethodStr } from '../../store/api/runServerMethod';

export default {
  getDateFormat() {
    return runServerMethodStr('Nur.CommonInterface.SystemConfig:getDateFormat:');
  },
  /**
 * @description 获取系统当前日期时间 pengjunfu
 * @param timeFormat:1 hh:mm:ss  2 hh:mm 
 * @returns  y-m-d^n:s
 */
  getCurrentDateTime(timeFormat) {
    return runServerMethodStr(`Nur.CommonInterface.SystemConfig:getCurrentDateTime:${timeFormat}:`);
  },
  getWebIP() {
    return runServerMethodStr('Nur.CommonInterface.SystemConfig:getWebIP:');
  },
  getSystemConfig() {
    return runServerMethodStr('Nur.CommonInterface.SystemConfig:getSystemConfig:');
  },
  getRegNoNum() {
    return runServerMethodStr('Nur.CommonInterface.SystemConfig:getRegNoNum:');
  }
};
