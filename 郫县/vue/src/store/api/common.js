/**
 * @description 封装axios通用接口 pengjunfu
 */
import qs from 'qs';
import axios from 'axios';
import config from './config';

// 拦截器,在请求url前加上baseUrl地址
axios.interceptors.request.use(
  axiosConfig => {
    Object.keys(config.proxyTable).forEach(key => {
      if (axiosConfig.url.indexOf(key) > -1 && key.indexOf('.csp') > -1) {
        axiosConfig.url = `${config.proxyTable[key]}${axiosConfig.url}`;
      } else if (
        axiosConfig.url.indexOf('.csp') < 0 &&
        key.indexOf('.csp') < 0
      ) {
        axiosConfig.url = `${config.proxyTable[key]}${axiosConfig.url}`;
      }
    });
    return axiosConfig;
  },
  error => Promise.reject(error),
);
export default {
  /**
   * @description 封装axios get方法接口 pengjunfu
   *
   * @param {any} obj.apiUrl http请求的url,  obj.params 请求的参数对象
   * @returns  promise 回调
   */
  getJson(obj) {
    return axios
      .get(obj.apiUrl, { params: obj.params })
      .then(response => response.data);
  },
  /**
   * @author songchao
   * @description 封装axios post方法接口,解决get方式参数超长
   * @param {any} obj.apiUrl http请求的url,  obj.params 请求的参数对象
   * @returns  promise 回调
   */
  postJson(obj) {
    const postData = qs.stringify(obj.params);
    return axios
      .post(obj.apiUrl, postData)
      .then(response => response.data);
  },
};
