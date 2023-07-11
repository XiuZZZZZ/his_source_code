import Cookies from 'js-cookie';
import session from '../api/session';
import temperatureApi from '../api/temperature';

/* eslint-disable no-shadow */
const expires = 365;
const state = {
  disposeStateInfo: {},
  babyFlag: 1,
  tempConfig: {},
  wardID: session.USER.WARDID,
  requestQueryFlag: false,
  mutiplySetting: {
    columnSetting: Cookies.getJSON('columnSetting')
      ? Cookies.getJSON('columnSetting')
      : [
        "temperature",
        "pulse",
        "breath",
        "sysPressure",
        "diaPressure",
        "defFreq"
      ],
    infoData: [],
  },
};
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
  updateTempConfig(state, { config }) {
    state.tempConfig = config;
  },
  updateMutiplySetting(state, { columnSetting }) {
    const mutiplySetting = {};
    Object.assign(mutiplySetting, state.mutiplySetting);
    if (columnSetting) {
      Cookies.set('columnSetting', columnSetting, { expires });
      mutiplySetting.columnSetting = columnSetting;
    }
    state.mutiplySetting = mutiplySetting;
  },
};

const actions = {
  getTempConfig({ commit }) {
    temperatureApi.getTempConfig(session.USER.CTLOCID, state.babyFlag).then(config =>
      commit({
        type: 'updateTempConfig',
        config,
      }),
    );
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
