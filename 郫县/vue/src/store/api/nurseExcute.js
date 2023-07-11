import { runServerMethod } from '../../store/api/runServerMethod';

// const apiUrlOrders = '/orders';
const className = 'Nur.IP.NurseExcute';
const getOrders = 'getOrders';
// const className = 'Nur.IP.NurseExcute';
export default {
  // getOrders(params, cb) {
  //   return runServerMethodOld(className,getOrders).then(cb);
  //   http.getJson({
  //     apiUrl: apiUrlOrders,
  //     params,
  //   }).then(cb);
  // },
  getOrders(...args) {
    return runServerMethod(className, getOrders, ...args);
  },
};
