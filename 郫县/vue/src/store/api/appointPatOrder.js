/**
 * @description 获取预约患者相关信息的公用js songchao
 * 
 */
import { runServerMethod } from './runServerMethod';

const className = 'Nur.InService.AppointPatOrder';
const getAppPatList = 'getAppPatList';
const findBookPat = "findBookPat"
export default {

    /**
     * @description 获取病区下的病人 songchao     * 
     * @param {any} wardID 病区ID
     */
    getAppPatList(wardID, episodeIDTo, papmiId) {
        return runServerMethod(className, getAppPatList, wardID, episodeIDTo, papmiId);
    },
    /**
     * @description 获取病区下的病人 songchao     * 
     * @param {any} wardID 病区ID
     */
    findBookPat(bookNo, regNo, startDate, endDate, patName, bookLoc, bookWard, bookDoctor, bookStatus) {
        return runServerMethod(className, findBookPat, bookNo, regNo, startDate, endDate, patName, bookLoc, bookWard, bookDoctor, bookStatus);
    }
};
