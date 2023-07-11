/* 2017-1-19 pjf 添加vuex支持 */
import wardApi from '../api/ward';
import session from '../api/session';
/* eslint-disable no-shadow */

const state = {
  needToDealPatNum: 0,
  inHospitalPatNum: 0,
  needToDealPats: {},
};

const mutations = {
  updateSummaryInfo(state, payLoad) {
    state.needToDealPatNum = payLoad.needToDealPatNum;
    state.needToDealPats = payLoad.needToDealPats;
    state.inHospitalPatNum = payLoad.inHospitalPatNum;
  },
};

const getters = {
  summaryInfo(state) {
    return state;
  },
};

const actions = {
  getSummaryInfo({ commit, getters }) {
    wardApi.getSummaryInfo(getters.currentWard.wardID,session.USER.GROUPID).then(summaryInfo => {
      commit('updateSummaryInfo', summaryInfo);
      Object.keys(summaryInfo.needToDealPats).forEach(episodeID => {
        commit('signBedNeedToDeal', {
          episodeID,
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
