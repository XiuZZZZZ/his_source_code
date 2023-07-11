/**
 * @description 分娩相关js pengjunfu
 *
 */
import { runServerMethod } from './runServerMethod';
import SESSION from './session';

const className = 'Nur.IP.Delivery';
const findBaby = 'findBaby';
const findDeliverMethod = 'findDeliverMethod';
const findOutCome = 'findOutCome';
export default {
  className,
  findBaby,
  findDeliverMethod,
  findOutCome,
  getBabyDeliveryInfo(motherEpisodeID, babyID) {
    return runServerMethod(className, 'getBabyDeliveryInfo', motherEpisodeID, babyID);
  },
  saveBabyDeliveryInfo(motherEpisodeID, babyID, orderNumber, name, name2, sex, birthDate, birthTime, outCome, deliverMethod, apgarJsonString, height, weight) {
    return runServerMethod(className, 'saveBabyDeliveryInfo', motherEpisodeID, babyID, orderNumber, name,
      name2, sex, birthDate, birthTime, SESSION.USER.USERID, outCome, deliverMethod, apgarJsonString, height, weight);
  },
  delete(ID) {
    return runServerMethod(className, 'delete', ID, SESSION.USER.USERID, SESSION.USER.GROUPDESC);
  },
  // by lmm 修改信息
  changeBabyDeliveryInfo(motherEpisodeID, babyID, orderNumber, name, name2, sex, birthDate, birthTime, height, weight) {
    return runServerMethod(className, 'changeBabyDeliveryInfo', motherEpisodeID, babyID, orderNumber, name, name2, sex, birthDate, birthTime, SESSION.USER.USERID, height, weight);
  },

};