<template>
  <div class="orderExcuteView">
    <PatientTree
      class="orderExcuteView__patientTree"
      :wardID="wardID"
      :episodeID="episodeID"
      :allPatientChecked="allPatientChecked"
      @checkChange="onCheckChange"
    ></PatientTree>
    <Tab
      class="orderExcuteView__tabs"
      :data="tabsData"
      backgroundColor="#509de1"
      color="#ffffff"
      border="1px solid #ffffff"
      :defaultSelectedTabIndex="0"
    >
      <component :is="currentView" slot="contentSlot" class="orderExcuteView__routerView"></component>
    </Tab>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Tab from "../components/Tab";
import OrderExcute from "../bizcomponents/orderExcute/OrderExcute";
import PatientTree from "../components/PatientTree";
import SESSION from "../store/api/session";

export default {
  name: "orderExucteView",
  data() {
    return {
      currentView: "OrderExcute",
      episodeID: SESSION.USER.EPISODEID,
      allPatientChecked: false || !!SESSION.USER.ALLPATIENTCHECKED,
      firstMount: true
    };
  },
  components: {
    Tab,
    PatientTree,
    OrderExcute
  },
  computed: {
    ...mapGetters(["wardID", "selectedPatients"]),
    tabsData() {
      const tabs = [];
      const tabExcute = {};
      tabExcute.name = "护士执行";
      tabExcute.ID = "1";
      tabExcute.index = 0;
      tabs.push(tabExcute);
      /* const tabDrug = {};
      tabDrug.name = '领药审核';
      tabDrug.ID = '2';
      tabDrug.index = 1;
      tabs.push(tabDrug);*/
      return tabs;
    }
  },
  methods: {
    /* onCheckChange(checkedKeys) {
      this.$store.commit('updateSelectedPatients', {
        selectedPatients: checkedKeys,
      });
    },*/

    onCheckChange(checkedKeys, checkedNodes) {
      const selectedEpisodeIds = checkedNodes.map(node => node.ID);
      this.$store.commit("updateSelectedPatients", {
        selectedPatients: selectedEpisodeIds
      });
      if (this.firstMount) {
        this.$eventBus.$emit("patientTree-patients-change", selectedEpisodeIds);
        this.firstMount = false;
      }
    }
  }
};
</script>
<style>
@import "../assets/main.css";
:root {
  --orderExcuteView--border: 1px solid var(--mainColor);
  --orderExcuteView--margin: 4px;
}

@b orderExcuteView {
  transform: translateZ(0);
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  @e patientTree {
    flex: 0 0 208px;
    border: var(--orderExcuteView--border);
    margin: var(--orderExcuteView--margin);
    background-color: #f5f5f5;
    white-space: nowrap;
    overflow: auto;
  }
  @e tabs {
    flex: 1 0 400px;
    margin: var(--orderExcuteView--margin) var(--orderExcuteView--margin)
      var(--orderExcuteView--margin) 0;
    border: var(--orderExcuteView--border);
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    & > .tab__wrapper {
      height: 0;
      min-height: 0;
    }
  }
  @e routerView {
    flex-grow: 1;
    /* position: relative;*/
  }
}

/*
ul {
  background-color: #509de1;
}*/
</style>

