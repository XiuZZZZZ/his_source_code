import axios from 'axios';
import { runServerMethod } from './runServerMethod';
import session from './session';
import utils from '../../comm/utils';

const className = 'Nur.CommonInterface.TemperatureMeasure';
const getNeedMeasureInfo = 'getNeedMeasureInfo';
export default {
  className,
  getNeedMeasureInfo(episodeIDArray, date, time) {
    const chunks = utils.splitChunk([], 50, episodeIDArray);
    const measureInfo = {};
    const promiseArray = chunks.map(chunk =>
      runServerMethod(
        className,
        getNeedMeasureInfo,
        chunk.join('^'),
        date,
        time,
        session.USER.CTLOCID,
      ).then(result => Object.assign(measureInfo, result)),
    );
    return axios.all(promiseArray).then(() => measureInfo);
  },
};
