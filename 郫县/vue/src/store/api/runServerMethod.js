/**
 * @description 实现cspRunServer功能并添加 cls:method:paramter 字符串调用功能   pengjunfu
 */
import http from './common';
import config from '../api/config';

// const apiUrl = '/runServerMethod';
let apiUrl = '/dhc.nurse.ip.common.getdata.csp';
/* global _WEBPACKTEST*/
if (_WEBPACKTEST) {
  apiUrl = `/dhc.nurse.ip.common.getdata.csp?1=1&CacheUserName=${config.cacheInfo.CacheUserName}&CachePassword=${config.cacheInfo.CachePassword}&CacheNoRedirect=${config.cacheInfo.CacheNoRedirect}`;
}

export const queryBrokerCls = 'Nur.QueryBrokerNew';
export const getQueryColumnsMethod = 'getTableColumnOfElementUI';
/**
 * @author songchao
 * @description 运行服务器方法  
 * @param {any} cls class名称字符串
 * @param {any} method method名E称字符串
 * @param {any} args method的参数列表
 * @returns  promise回调
 */
export function postServerMethod(cls, method, ...args) {
  const methodParArray = method.split('.');
  const params = {
    className: cls,
    methodName: methodParArray[0],
    limit: methodParArray[1] || '',
  };
  for (let i = 0; i < args.length; i += 1) {
    params[`parameter${i + 1}`] = args[i] !== undefined ? args[i] : '';
  }
  return http.postJson({
    apiUrl,
    params,
  });
}

/**
 * @description 运行服务器方法  pengjunfu
 * 
 * @export
 * @param {any} cls class名称字符串
 * @param {any} method method名E称字符串
 * @param {any} args method的参数列表
 * @returns  promise回调
 */
export function runServerMethod(cls, method, ...args) {
  const methodParArray = method.split('.');
  const params = {
    className: cls,
    methodName: methodParArray[0],
    limit: methodParArray[1] || '',
  };
  for (let i = 0; i < args.length; i += 1) {
    params[`parameter${i + 1}`] = args[i] !== undefined ? args[i] : '';
  }
  return http.getJson({
    apiUrl,
    params,
  });
}

/**
 * @description 运行服务器方法 pengjunfu
 *  
 * @export
 * @param {any} str cls:method:parameter1:parameter2
 * @returns  返回promise回调
 */
export function runServerMethodStr(str) {
  const paramArray = str.split(':');
  const methodParArray = paramArray[1].split('.');
  const params = {
    className: paramArray[0],
    methodName: methodParArray[0],
    limit: methodParArray[1] || '',
  };
  for (let i = 2; i < paramArray.length; i += 1) {
    params[`parameter${i - 1}`] = paramArray[i] !== undefined ? paramArray[i] : '';
  }
  return http.getJson({
    apiUrl,
    params,
  });
}

