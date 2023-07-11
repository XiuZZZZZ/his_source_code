// import http from './common';
import { runServerMethod,postServerMethod } from '../../store/api/runServerMethod';

const className = 'Nur.CommonInterface.OrderHandle';
const setOrdPlaceNote = 'setOrdPlaceNote';
// const apiUrlLocLinkWards = '/locLinkWards';
export default {
  runServerMethodFactory(...args) {
    return runServerMethod(className, ...args);
  },
  setOrdPlaceNote(...args) {
    return runServerMethod(className, setOrdPlaceNote, ...args);
  },
  postServerMethodFactory(...args) {
    return postServerMethod(className, ...args);
  },
};
