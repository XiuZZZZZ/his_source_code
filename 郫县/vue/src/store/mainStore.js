/* 2017-1-19 pjf 添加vuex支持 */
import Vue from 'vue';
import Vuex from 'vuex';
import systemApi from './api/systemConfig';

/* eslint-disable no-shadow */
const state = {
  systemConfig: {
    dateFormat: {
      DATEFORMAT: 3,
    },
  },
};
const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = getters[key] || (state => state[key]);
});
const mutations = {
  updateSystemConfig(state, { systemConfig }) {
    state.systemConfig = systemConfig;
  },
};

const actions = {
  getSystemConfig({ commit }) {
    systemApi.getSystemConfig().then(systemConfig =>
      commit({
        type: 'updateSystemConfig',
        systemConfig,
      }),
    );
  },
};
if (Vue.config.devtools) {
  Vue.use(Vuex);
}
const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
store.dispatch('getSystemConfig');
export default store;
