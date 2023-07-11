import session from '../api/session';
import temperatureApi from '../api/temperature';

/* eslint-disable no-shadow */

const state = {
  tempConfig: {},
  wardID: session.USER.WARDID,
  babyFlag: 0,
};
const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = getters[key] || (state => state[key]);
});

const mutations = {
  updateTempConfig(state, { config }) {
    state.tempConfig = config;
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
