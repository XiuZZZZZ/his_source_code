<template>
  <div class="appointPatOrderExcuteView">
    <PatientTree class="appointPatOrderExcuteView__patientTree"
                 :wardID="wardID"
                 :episodeID="episodeID"
                 @currentChange="onCurrentChange"></PatientTree>
    <Tab class="appointPatOrderExcuteView__tabs"
         :data="tabsData"
         backgroundColor="#509de1"
         color="#ffffff"
         border="1px solid #ffffff"
         :defaultSelectedTabIndex="0">
      <component :is="currentView"
                 slot="contentSlot"
                 class="appointPatOrderExcuteView__routerView">
      </component>
    </Tab>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Tab from "../components/Tab";
import OrderExcute from "../bizcomponents/appointPatOrderExcute/OrderExcute";
import PatientTree from "../bizcomponents/appointPatOrderExcute/PatientTree";
import SESSION from "../store/api/session";

export default {
  name: "orderExucteView",
  data() {
    return {
      currentView: "OrderExcute",
      episodeID: SESSION.USER.EPISODEID
    };
  },
  components: {
    Tab,
    PatientTree,
    OrderExcute
  },
  computed: {
    ...mapGetters(["wardID"]),
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
    /* onCheckChange(checkedKeys, checkedNodes) {
      const selectedEpisodeIds = checkedNodes.map(node => node.ID);
      this.$store.commit("updateSelectedPatients", {
        selectedPatients: selectedEpisodeIds
      });
      this.$eventBus.$emit("patientTree-patients-change", selectedEpisodeIds);
    },*/
    onCurrentChange(patient) {
      const selectedEpisodeIds = [];
      selectedEpisodeIds.push(patient.ID);
      this.$store.commit("updateSelectedPatients", {
        selectedPatients: selectedEpisodeIds
      });
      this.$store.commit("updateSearchInfo", {
        key: "startDate",
        value: patient.startDate
      });
      this.$store.commit("updateSearchInfo", {
        key: "endDate",
        value: patient.endDate
      });
      this.$eventBus.$emit("appPatTree-patients-change", selectedEpisodeIds);
    }
  }
};
</script>
<style>
@import "../assets/main.css";
:root {
  --appointPatOrderExcuteView--border: 1px solid var(--mainColor);
  --appointPatOrderExcuteView--margin: 4px;
}

@b appointPatOrderExcuteView {
  transform: translateZ(0);
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  @e patientTree {
    flex: 0 0 248px;
    border: var(--appointPatOrderExcuteView--border);
    margin: var(--appointPatOrderExcuteView--margin);
    background-color: #f5f5f5;
    white-space: nowrap;
    overflow: auto;
    min-height: 75%;
  }
  @e tabs {
    flex: 1 0 400px;
    margin: var(--appointPatOrderExcuteView--margin)
      var(--appointPatOrderExcuteView--margin)
      var(--appointPatOrderExcuteView--margin) 0;
    border: var(--appointPatOrderExcuteView--border);
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

