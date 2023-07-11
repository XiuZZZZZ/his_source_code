/**
 * @description 获取住院服务中心js songchao
 * 
 */
import { runServerMethod } from './runServerMethod';

const className = 'Nur.InService.Interface';
const ifHospNeedAppByWard = 'ifHospNeedAppByWard';
const ifPatAppBed = "ifPatAppBed";
const ifBedApped = 'ifBedApped';

export default {

    /**
     * @description 获取病区是否开启床位预约 songchao     * 
     * @param {any} wardID 病区ID
     */
    ifHospNeedAppByWard(wardID) {
        return runServerMethod(className, ifHospNeedAppByWard, wardID);
    },
    /**
     * @description 获取病区下的病人 songchao     * 
     * @param {any} IPBookID 住院证ID
     */
    ifPatAppBed(IPBookID) {
        return runServerMethod(className, ifPatAppBed, IPBookID);
    },
    /**
     * @description 床位是否被预约
     * @param {any} IPBookID 住院证ID
     */
    ifBedApped(bedID, episodeID) {
        return runServerMethod(className, ifBedApped, bedID, episodeID);
    }
};
