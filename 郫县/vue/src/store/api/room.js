/**
 * @description 房间相关js songchao
 * 
 */
import { runServerMethodStr } from '../../store/api/runServerMethod';
import session from './session';

export default {
  transToRoomServer(episodeID, roomID, wardID) {
    const userID = session.USER.USERID;
    return runServerMethodStr(`Nur.CommonInterface.Bed:transToWaitRoom:${episodeID}:${wardID}:${userID}:${roomID}:`);
  },
};
