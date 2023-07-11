/* 2017-1-19 pjf 添加vuex支持 */
import locApi from '../api/loc';



/* eslint-disable no-shadow */
const state = {
  currentWard: null,
  locLinkWards: null,

};

const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = getters[key] || (state => state[key]);
});
const mutations = {
  updateCurrentWard(state, { ward }) {
    state.currentWard = ward;
  },
};

const actions = {
  getLocLinkWards({ commit }) {
    return locApi.getLocLinkWards().then(wards => {
      if (wards[0]) {
        commit('updateCurrentWard', {
          ward: wards[0]
        });
      }
    });
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
