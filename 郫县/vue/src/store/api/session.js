/**
 * @description 封装登录用户常用信息  pengjunfu
 */
import userInfoApi from './userInfo';
import config from './config';
/*  eslint no-underscore-dangle: ['error', { 'allow': ['_session'] }] */
const _session = {
  USER: {},
  // {
  //   USERID: 1,
  //   USERCODE: 1,
  //   USERNAME: 1,
  //   GROUPID: 1,
  //   GROUPDESC: 1,
  //   LOCID: 1,
  //   WARDID: 1,
  //   HOSPITALID: 1,
  // },
};
/*  global session:true */
// export function cspValidate(){
//   const fragment=document.createDocumentFragment();
//   const formElement=document.createElement('form');
//   formElement.setAttribute('id','form');
//   formElement.setAttribute('method','post');
//   formElement.setAttribute('name','default_form');
//   formElement.setAttribute('action','http://192.168.200.11/dthealth/web/csp/dhc.nurse.vue.logon.csp');
//   const createInput=(name,type,value)=>{
//     const inputElement=document.createElement('input');
//     inputElement.setAttribute('type',type);
//     inputElement.setAttribute('name',name);
//     inputElement.setAttribute('value',value);
//     return inputElement;
//   };
//   // formElement.appendChild(createInput('CacheNoRedirect','hidden','0'));
//   formElement.appendChild(createInput('CacheUserName','hidden','dhsyslogin'));
//   formElement.appendChild(createInput('CachePassword','hidden','1q2w3e4r'));
//   // formElement.appendChild(createInput('LANGID','hidden','1'));
//   fragment.appendChild(formElement);
//   document.body.appendChild(fragment);
//   document.querySelector('#form').submit();
// }
export function getSession() {
  // cspValidate();
  return userInfoApi.getUserInfo().then(json => {
    _session.USER = json;
    Object.keys(config.loginInfo).forEach(key => {
      _session.USER[key.toUpperCase()] = config.loginInfo[key];
    });
  });
}
export function initSession() {
  Object.keys(session).forEach(key => {
    if (key.indexOf('.') > 0) {
      _session.USER[key.split('.')[1]] = session[key];
    } else {
      _session.USER[key.toUpperCase()] = session[key];
    }
  });
  // _session.USER = {
  //   USERID: session['LOGON.USERID'],
  //   USERCODE: session['LOGON.USERCODE'],
  //   USERNAME: session['LOGON.USERNAME'],
  //   LOCID: session['LOGON.CTLOCID'],
  //   HOSPITALID: session['LOGON.HOSPID'],
  //   WARDID: session['LOGON.WARDID'],
  //   GROUPID: session['LOGON.GROUPID'],
  //   GROUPDESC: session['LOGON.GROUPDESC'],
  //   WEBIP: session['LOGON.WEBIP'],
  //   EPISODEID: session.EpisodeID,
  // };
}
export default _session;
