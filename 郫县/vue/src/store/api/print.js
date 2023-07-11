import { runServerMethodStr } from '../../store/api/runServerMethod';

export default {
  /**
   * @description 获取病区配置信息 songchao
   */
  getWirstbandPrintFlag() {
    return runServerMethodStr('Nur.CommonInterface.PrintConfig:getWirstbandPrintFlag::');
  },
  /**
   * @description 获取xlxs打印模板 songchao
   */
  getXlsPath() {
    return runServerMethodStr('Nur.CommonInterface.PrintConfig:getXlsPath::');
  },
};
