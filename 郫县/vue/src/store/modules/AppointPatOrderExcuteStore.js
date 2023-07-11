import Vue from 'vue';
import axios from 'axios';
import sheetApi from '../api/orderSheet';
import nurseExcuteApi from '../api/nurseExcute';
import session from '../api/session';
/* eslint-disable no-shadow */

const state = {
  orderList: {
    columns: [],
    data: {},
  },
  buttons: [],
  sheetsCode: [],
  defaulSheetIndex: 0,
  defaultSheetCode: '',
  disposeStateInfo: {},
  selectedPatients: [],
  searchInfo: {
    startDate: new Date(),
    startTime: '00:00',
    endDate: new Date(),
    endTime: '00:00',
    doctorOrderFlag: true,
    excutedOrderFlag: false,
    printedOrderFlag: false,
    createOrderFlag: false,
    sheetCode: '',
    hospitalID: '',
    orderType: 'A',
    longOrderFlag: false,
    tempOrderFlag: false,
  },
  requestQueryFlag: false,
  wardID: session.USER.WARDID,
};
sheetApi.getDisposeStateInfo().then(info => {
  state.disposeStateInfo = info;
});
const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = getters[key] || (state => state[key]);
});

const mutations = {
  requestQuery(state) {
    state.requestQueryFlag = true;
  },
  finishQuery(state) {
    state.requestQueryFlag = false;
  },
  updateSheetCloumns(state, { columns }) {
    state.orderList = Object.assign({}, state.orderList, {
      columns,
      data: {},
    });
  },
  updateSheetButtons(state, { buttons }) {
    state.buttons = buttons;
  },
  updateSheetData(state, { result }) {
    let data = result;
    if (typeof result === 'string') {
      data = {
        orders: [],
      };
    }
    state.sheetsCode.forEach(sheetCode => {
      sheetCode.badge = (!!data[sheetCode.ID]);
    });
    /* data.orders.sort((a,b) => 
      (typeof a.labNo !=='undefined')(typeof b.labNo !=='undefined')&&(parseInt(a.labNo,10) -parseInt(b.labNo,10))
    );*/
    data.orders.forEach(order => {
      Vue.set(order, 'check', false);
      Vue.set(order, 'focus', false);
      Vue.set(order, 'indeterminate', false);
      Vue.set(order, 'show', true);
      if (order.execInfos) {
        const sttDates = [];
        const sttTimes = [];
        const exist = {};
        order.execInfos.forEach(execInfo => {
          Vue.set(execInfo, 'check', false);
          if (!exist[execInfo.sttDate]) {
            sttDates.push(execInfo.sttDate);
            exist[execInfo.sttDate] = true;
          }
          if (!exist[execInfo.sttTime]) {
            sttTimes.push(execInfo.sttTime);
            exist[execInfo.sttTime] = true;
          }
        });
        sttTimes.sort(
          (a, b) =>
            parseInt(a.split(':')[0], 10) - parseInt(b.split(':')[0], 10),
        );
        Vue.set(order, 'sttDates', sttDates);
        Vue.set(order, 'sttTimes', sttTimes);
      }
    });
    Vue.set(data, 'indeterminate', false);
    Vue.set(data, 'check', false);
    state.orderList = Object.assign({}, state.orderList, {
      data,
    });
  },
  updateSelectedPatients(state, { selectedPatients }) {
    state.selectedPatients = selectedPatients;
  },
  updateSearchInfo(state, { key, value }) {
    state.searchInfo[key] = value;
  },
  updateSheetCode(state, { sheetCode, hospitalID }) {
    state.searchInfo.sheetCode = sheetCode;
    state.searchInfo.hospitalID = hospitalID;
  },
  updateSheetsCode(state, { sheetsCode, defaulSheetIndex }) {
    state.sheetsCode = sheetsCode;
    state.defaulSheetIndex = defaulSheetIndex;
  },
  updateOrderListCheckStatus(state, { indeterminate, check }) {
    if (indeterminate !== undefined) {
      state.orderList.data.indeterminate = indeterminate;
    }
    if (check !== undefined) {
      state.orderList.data.check = check;
    }
  },
  updateExecsCheckStatusByDisposeStatCode(
    state,
    { disposeStatCode, index, check },
  ) {
    const execs = state.orderList.data.orders[index].execInfos;
    if (execs) {
      execs.forEach(execInfo => {
        /* eslint no-nested-ternary: "off" */
        execInfo.check =
          disposeStatCode === execInfo.disposeStatCode
            ? check !== undefined ? check : !execInfo.check
            : execInfo.check;
      });
    }
  },
  updateExecsCheckStatusBySttDate(state, { sttDate, index }) {
    const execs = state.orderList.data.orders[index].execInfos;
    if (execs) {
      execs.forEach(execInfo => {
        execInfo.check =
          sttDate === execInfo.sttDate ? !execInfo.check : execInfo.check;
      });
    }
  },
  updateExecsCheckStatusBySttTime(state, { sttTime, index }) {
    const execs = state.orderList.data.orders[index].execInfos;
    if (execs) {
      execs.forEach(execInfo => {
        execInfo.check =
          sttTime === execInfo.sttTime ? !execInfo.check : execInfo.check;
      });
    }
  },
  updateExecsCheckStatus(state, { index, check }) {
    const execs = state.orderList.data.orders[index].execInfos;
    if (execs) {
      execs.forEach(execInfo => {
        if (check !== undefined) {
          execInfo.check = check;
        }
      });
    }
  },
  updateExecCheckStatus(state, { index, execIndex }) {
    const check = state.orderList.data.orders[index].execInfos[execIndex].check;
    state.orderList.data.orders[index].execInfos[execIndex].check = !check;
  },
  updateOrderCheckStatus(state, { indeterminate, check, index }) {
    if (indeterminate !== undefined) {
      state.orderList.data.orders[index].indeterminate = indeterminate;
    }
    if (check !== undefined) {
      state.orderList.data.orders[index].check = check;
    }
  },
  updateOrdersCheckStatus(state, { indeterminate, check }) {
    state.orderList.data.orders.forEach(order => {
      if (check !== undefined) {
        order.check = check;
      }
      if (indeterminate !== undefined) {
        order.indeterminate = indeterminate;
      }
      if (order.execInfos) {
        order.execInfos.forEach(execInfo => {
          if (check !== undefined) {
            execInfo.check = check;
          }
        });
      }
    });
  },
};
const initSearchDateTimeFunc = function ({ commit }, { sheetCode, hospitalID }) {
  commit({
    type: 'updateSheetCode',
    sheetCode,
    hospitalID,
  });
  return sheetApi
    .getSheetDateTime(sheetCode, hospitalID)
    .then(dateTimeObject => {
      commit({
        type: 'updateSearchInfo',
        key: 'startDate',
        value: dateTimeObject.startDate,
      });
      commit({
        type: 'updateSearchInfo',
        key: 'startTime',
        value: dateTimeObject.startTime,
      });
      commit({
        type: 'updateSearchInfo',
        key: 'endDate',
        value: dateTimeObject.endDate,
      });
      commit({
        type: 'updateSearchInfo',
        key: 'endTime',
        value: dateTimeObject.endTime,
      });
    });
};
const initColumnsAndButtonsFunc = function (
  { commit },
  { sheetCode, hospitalID, excutedOrderFlag, printedOrderFlag },
) {
  commit({
    type: 'updateSheetCode',
    sheetCode,
    hospitalID,
  });
  const promises = [];
  promises.push(
    sheetApi.getSheetColumns(sheetCode, hospitalID).then(columns => {
      commit({
        type: 'updateSheetCloumns',
        columns,
      });
    }),
  );
  promises.push(
    sheetApi.getSheetButtons(sheetCode, hospitalID, excutedOrderFlag, printedOrderFlag).then(buttons => {
      commit({
        type: 'updateSheetButtons',
        buttons,
      });
    }),
  );
  /* promises.push(sheetApi.getSheetDateTime(sheetCode, hospitalID).then((dateTimeObject) => {
    commit({
      type: 'updateSearchInfo',
      key: 'startDate',
      value: dateTimeObject.startDate,
    });
    commit({
      type: 'updateSearchInfo',
      key: 'startTime',
      value: dateTimeObject.startTime,
    });
    commit({
      type: 'updateSearchInfo',
      key: 'endDate',
      value: dateTimeObject.endDate,
    });
    commit({
      type: 'updateSearchInfo',
      key: 'endTime',
      value: dateTimeObject.endTime,
    });
  }));*/
  return axios.all(promises);
};
const actions = {
  initOrderExcuteState({ commit, state }) {
    let defaulSheetIndex = 0;
    let defaultSheetCode = '';
    let defaultHospitalID = '';
    const specifySheetCode = session.USER.SPECIFYSHEETCODE;
    sheetApi
      .getSheetsOfSSGroup()
      .then(sheets => {
        const sheetsCode = sheets.map((sheet, index) => {
          const { code, desc, hospitalID } = sheet;
          if (((index === 0 || sheet.default) && !specifySheetCode) || (specifySheetCode && code === specifySheetCode)) {
            defaulSheetIndex = index;
            defaultSheetCode = code;
            defaultHospitalID = hospitalID;
          }
          return {
            name: desc,
            ID: code,
            index,
            badge: false,
            hospitalID,
          };
        });
        commit({
          type: 'updateSheetsCode',
          sheetsCode,
          defaulSheetIndex,
        });
      })
      .then(() => {
        const promises = [];
        promises.push(
          initColumnsAndButtonsFunc(
            { commit },
            {
              sheetCode: defaultSheetCode,
              hospitalID: defaultHospitalID,
              excutedOrderFlag: state.searchInfo.excutedOrderFlag,
              printedOrderFlag: state.searchInfo.printedOrderFlag,
            },
          ),
        );
        promises.push(
          initSearchDateTimeFunc(
            { commit },
            {
              sheetCode: defaultSheetCode,
              hospitalID: defaultHospitalID,
            },
          ),
        );
        axios.all(promises);
        // .then(() => {
        //   commit({
        //     type: 'requestQuery',
        //   });
        // });
      });
  },
  initSearchDateTime({ commit }, { sheetCode, hospitalID }) {
    initSearchDateTimeFunc({ commit }, { sheetCode, hospitalID }).then(() => {
      commit({
        type: 'requestQuery',
      });
    });
  },
  initColumnsAndButtons({ commit, state }, { sheetCode, hospitalID }) {
    commit({
      type: 'requestQuery',
    });
    const excutedOrderFlag = state.searchInfo.excutedOrderFlag;
    const printedOrderFlag = state.searchInfo.printedOrderFlag;
    initColumnsAndButtonsFunc({ commit }, { sheetCode, hospitalID, excutedOrderFlag, printedOrderFlag });
  },
  getOrders({ commit, state }) {
    const {
      sheetCode,
      hospitalID,
      startDate,
      startTime,
      endDate,
      endTime,
      doctorOrderFlag,
      createOrderFlag,
      excutedOrderFlag,
      orderType,
      printedOrderFlag,
      longOrderFlag,
      tempOrderFlag
    } = state.searchInfo;
    const groupID = session.USER.GROUPID;
    const locID = session.USER.CTLOCID;
    const wardID = session.USER.WARDID;
    nurseExcuteApi
      .getOrders(
        state.selectedPatients.join('^'),
        sheetCode,
        hospitalID,
        groupID,
        startDate,
        startTime,
        endDate,
        endTime,
        wardID,
        locID,
        doctorOrderFlag,
        createOrderFlag,
        excutedOrderFlag,
        orderType,
        printedOrderFlag,
        longOrderFlag,
        tempOrderFlag,

      )
      .then(data => {
        commit({
          type: 'updateSheetData',
          result: data,
        });
        commit({
          type: 'finishQuery',
        });
      }).then(() => {
        sheetApi.getSheetButtons(sheetCode, hospitalID, excutedOrderFlag, printedOrderFlag).then(buttons => {
          commit({
            type: 'updateSheetButtons',
            buttons,
          });
        });
      });
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
