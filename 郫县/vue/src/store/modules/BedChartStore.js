/* 2017-1-19 pjf 添加vuex支持 */
import Vue from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import wardApi from '../api/ward';
import locApi from '../api/loc';
import patientApi from '../api/patient';
import moduleSummaryInfo from './summaryInfo';
import { runServerMethodStr } from '../api/runServerMethod';
import Bed from '../object/bed';
import printApi from '../api/print';
import utils from '../../comm/utils';

/* eslint-disable no-shadow */
const expires = 365;
const state = {
  locLinkWards: [],
  beds: [],
  bedSize: {
    height: Cookies.get('bedHeight')
      ? parseInt(Cookies.get('bedHeight'), 10)
      : 170,
    headHeight: Cookies.get('bedHeadHeight')
      ? parseInt(Cookies.get('bedHeadHeight'), 10)
      : 24,
    infoHeight: Cookies.get('bedInfoHeight')
      ? parseInt(Cookies.get('bedInfoHeight'), 10)
      : 108,
    width: Cookies.get('bedWidth')
      ? parseInt(Cookies.get('bedWidth'), 10)
      : 181,
    fontSize: Cookies.get('bedFontSize')
      ? parseInt(Cookies.get('bedFontSize'), 10)
      : 14,
    minHeight: 170,
    minWidth: 181,
    maxHeight: 260,
    maxWidth: 300,
    minInfoHeight: 108,
    maxInfoHeight: 216
  },
  infoSetting: {
    detailInfo: Cookies.getJSON('detailInfo')
      ? Cookies.getJSON('detailInfo')
      : [
        'sex',
        'age',
        'medicareNo',
        'illState',
        'inHospDateTime',
        'diagnosis',
        'mainDoctor',
      ],
    popoverInfo: Cookies.getJSON('popoverInfo')
      ? Cookies.getJSON('popoverInfo')
      : ['admReason'],
    infoData: [],
  },
  bedListSetting: {
    bedListColumns: Cookies.getJSON('bedListColumns')
      ? Cookies.getJSON('bedListColumns')
      : ['name', 'episodeID'],
  },
  patBedMap: {},
  currentWard: null,
  wardRooms: [],
  imagesInitState: '',
  activedWaitRoomIndex: 0,
  ifShowDetailInfo: true,
  ifShowBedList: false,
  selectedInfo: {
    images: new Set(),
    episodeID: '',
    waitingEpisodeID: '',
    waitingRoom: ''
  },
  printConfigInfo: {
    wirstBandPrintFlag: 0,
    childWirstBandPrintFlag: 0
  },
  requestQueryFlag: false,
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
  updateBedSize(state, { width, height, infoHeight, headHeight, fontSize }) {
    const bedSize = {};
    Object.assign(bedSize, state.bedSize);
    if (height) {
      Cookies.set('bedHeight', height, { expires });
      bedSize.height = height;
    }
    if (width) {
      Cookies.set('bedWidth', width, { expires });
      bedSize.width = width;
    }
    if (infoHeight) {
      Cookies.set('bedInfoHeight', infoHeight, { expires });
      bedSize.infoHeight = infoHeight;
    }
    if (headHeight) {
      Cookies.set('bedHeadHeight', headHeight, { expires });
      bedSize.headHeight = headHeight;
    }
    if (fontSize) {
      Cookies.set('bedFontSize', fontSize, { expires });
      bedSize.fontSize = fontSize;
    }
    state.bedSize = bedSize;
  },
  updateInfoSetting(state, { detailInfo, popoverInfo, infoData }) {
    const infoSetting = {};
    Object.assign(infoSetting, state.infoSetting);
    if (infoData) {
      infoSetting.infoData = infoData;
    }
    if (detailInfo) {
      Cookies.set('detailInfo', detailInfo, { expires });
      infoSetting.detailInfo = detailInfo;
    }
    if (popoverInfo) {
      Cookies.set('popoverInfo', popoverInfo, { expires });
      infoSetting.popoverInfo = popoverInfo;
    }
    state.infoSetting = infoSetting;
  },
  updateBedListSetting(state, { bedListColumns }) {
    const bedListSetting = {};
    if (bedListColumns) {
      Cookies.set('bedListColumns', bedListColumns, { expires });
      bedListSetting.bedListColumns = bedListColumns;
    }
    state.bedListSetting = bedListSetting;
  },
  updateIfShowDetailInfo(state, { ifShowDetailInfo }) {
    state.ifShowDetailInfo = ifShowDetailInfo;
  },
  updateIfShowBedList(state, { ifShowBedList }) {
    state.ifShowBedList = ifShowBedList;
  },
  updateWaitingPatients(state, { waitingPatients, index }) {
    waitingPatients.forEach(patient => {
      const { episodeID } = patient;
      if (episodeID) {
        state.patBedMap[episodeID] = patient;
      }
    });
    Vue.set(state.wardRooms[index], 'patients', waitingPatients);
  },
  insertPatBedMap(state, { patient }) {
    state.patBedMap[patient.episodeID] = patient;
  },
  updatePrintConfigInfo(state, { wirstbandFlag }) {
    state.printConfigInfo.wirstBandPrintFlag = wirstbandFlag.printFlag;
    state.printConfigInfo.childWirstBandPrintFlag = wirstbandFlag.childPrintFlag;
  },
  updateBeds(state, { beds }) {
    state.beds = beds.map(bed => {
      const { episodeID } = bed.patient;
      if (episodeID) {
        state.patBedMap[episodeID] = bed.patient;
      }
      return new Bed(bed);
    });
  },
  updateBedShowState(state, { ifShow, ifFloat, index, showIndex }) {
    const bed = state.beds[index];
    bed.ifShow = ifShow;
    bed.ifFloat = ifFloat;
    if (showIndex) {
      bed.showIndex = showIndex;
    }
  },
  signBedNeedToDeal(state, { episodeID }) {
    if (state.patBedMap[episodeID]) {
      state.patBedMap[episodeID].needToDeal = true;
    }
  },
  updateBedImages(state, { index, images }) {
    if (state.beds[index]) {
      state.beds[index].images = images;
    }
  },

  updateImagesInitState(state, { imagesInitState }) {
    state.imagesInitState = imagesInitState;
  },
  updateLocLinkWards(state, { wards }) {
    state.locLinkWards = wards;
  },
  initData(state) {
    // state.beds = [];
    state.currentWard = null;
    state.selectedInfo = {
      images: new Set(),
      episodeID: '',
      waitingEpisodeID: '',
      waitingRoom: ''
    };
    state.wardRooms = [];
    state.imagesInitState = '';
    state.activedWaitRoomIndex = 0;
  },
  updateCurrentWard(state, { index }) {
    state.currentWard = state.locLinkWards[index];
  },
  updateWardRooms(state, { wardRooms }) {
    state.wardRooms = wardRooms;
  },
  updateSelWardRoom(state, { activedWaitRoomIndex }) {
    state.activedWaitRoomIndex = activedWaitRoomIndex;
  },
  clearSelectedCategory(state) {
    state.selectedInfo.images = new Set();
  },
  updateSelectedInfo(state, { image, episodeID, waitingEpisodeID, waitingRoom }) {
    if (image !== undefined && image !== '') {
      if (state.selectedInfo.images.has(image)) {
        state.selectedInfo.images.delete(image);
      } else {
        state.selectedInfo.images.clear();
        state.selectedInfo.images.add(image);
      }
    } else if (image === '') {
      state.selectedInfo.images = new Set();
    }
    // if (categoryDetail !== undefined) {
    //   if (state.selectedInfo.categoryDetail.has(categoryDetail)) {
    //     state.selectedInfo.categoryDetail.delete(categoryDetail);
    //   } else {
    //     state.selectedInfo.categoryDetail.add(categoryDetail);
    //   }
    // }
    if (episodeID !== undefined) {
      state.selectedInfo.episodeID = episodeID;
    }
    if (waitingEpisodeID !== undefined) {
      state.selectedInfo.waitingEpisodeID = waitingEpisodeID;
    }
    if (waitingRoom !== undefined) {
      state.selectedInfo.waitingRoom = waitingRoom;
    }
  },
};

const actions = {
  getWardInitData({ commit, dispatch }) {
    commit('updateImagesInitState', {
      imagesInitState: '',
    });
    commit('updateSelectedInfo', {
      category: '',
      episodeID: '',
      waitingEpisodeID: '',
      waitingRoom: '',
    });
    dispatch('getWardRooms');
    dispatch('getBeds');
    dispatch('getSummaryInfo');
    dispatch('getPrintConfigInfo');
  },
  getPrintConfigInfo({ commit }) {
    printApi.getWirstbandPrintFlag().then(wirstbandFlag =>
      commit({
        type: 'updatePrintConfigInfo',
        wirstbandFlag,
      }),
    );
  },
  getBeds({ commit, state }) {
    wardApi
      .getBeds(state.currentWard.wardID)
      .then(beds => {
        // beds.sort(utils.compareByProperty('code'));
        commit({
          type: 'updateBeds',
          beds,
        });
        commit('finishQuery');
        return beds;
      })
      .then(beds => {
        const bedInPatients = [];
        const bedIndexInpatients = [];
        beds.forEach((bed, index) => {
          if (bed.patient.episodeID) {
            bedInPatients.push(bed.patient.episodeID);
            bedIndexInpatients.push(index);
          }
        });
        const chunks = utils.splitChunk(
          [],
          20,
          bedInPatients,
          bedIndexInpatients,
        );
        return chunks.map(chunk =>
          patientApi.getChunkImages(chunk[0].join('^')).then(result => {
            if (result.length) {
              result.forEach((imageObject, index) => {
                commit('updateBedImages', {
                  index: chunk[1][index],
                  images: result[index],
                });
              });
            }
          }),
        );
      })
      .then(requestImages => {
        axios.all(requestImages).then(() => {
          const imagesInitState = 'finish';
          commit({
            type: 'updateImagesInitState',
            imagesInitState,
          });
        });
      });
  },
  getLocLinkWards({ commit, dispatch }) {
    dispatch('getInfoSettingData');
    locApi.getLocLinkWards().then(wards => {
      commit('updateLocLinkWards', {
        wards,
      });
      if (wards[0]) {
        commit('updateCurrentWard', {
          index: 0,
        });
        dispatch('getWardInitData');
      }
    });
  },
  getWardRooms({ commit, state, dispatch }) {
    wardApi.getWardRooms(state.currentWard.wardID).then(wardRooms => {
      commit('updateWardRooms', {
        wardRooms,
      });
      wardRooms.forEach((wardRoom, index) => {
        dispatch('getWaitingPatients', {
          wardID: state.currentWard.wardID,
          roomID: wardRoom.roomID,
          index,
        });
      });
    });
  },
  getWaitingPatients({ commit }, { index, wardID, roomID }) {
    wardApi.getWaitingPatients(wardID, roomID).then(patients => {
      commit('updateWaitingPatients', {
        index,
        waitingPatients: patients,
      });
    });
  },
  changeCurrentWard({ commit, dispatch }, { index }) {
    commit('initData');
    commit('updateCurrentWard', {
      index,
    });
    dispatch('getWardInitData');
  },
  getInfoSettingData({ commit }) {
    runServerMethodStr('Nur.CommonInterface.Patient:getPatientKeys').then(
      infoData => {
        commit('updateInfoSetting', { infoData });
      },
    );
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
  modules: {
    summaryInfo: moduleSummaryInfo,
  },
};
