<template>
  <div class="TemperatureMeasureMutiply">
    <PatientTree class="TemperatureMeasureMutiply__patientTree"
                 :wardID="wardID"
                 :episodeID="episodeID"
                 :babyFlag="babyFlag"
                 @checkChange="checkChange"></PatientTree>
    <MeasureMutiply class="TemperatureMeasureMutiply__measureMutiply"
                    :patients="currentPatients"
                    :tempConfig="tempConfig.mutiplyConfig?tempConfig.mutiplyConfig:{}"></MeasureMutiply>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import PatientTree from "../components/PatientTree";
import MeasureMutiply from "../bizcomponents/temperatureMeasure/MeasureMutiply";
import SESSION from "../store/api/session";

export default {
  name: "TemperatureMeasureMutiply",
  data() {
    return {
      currentPatients: [],
      currentPatientKeys: [],
      episodeID: SESSION.USER.EPISODEID
    };
  },
  created() {
    this.getTempConfig();
  },
  computed: {
    ...mapGetters(["wardID", "tempConfig", "babyFlag"])
  },
  methods: {
    ...mapActions(["getTempConfig"]),
    ...mapMutations(["requestQuery"]),
    checkChange(keys, nodes) {
      if (
        keys.length !== this.currentPatientKeys.length ||
        this.currentPatientKeys.toString() !== keys.toString()
      ) {
        this.currentPatientKeys = keys;
        this.requestQuery();
        setTimeout(() => {
          this.currentPatients = nodes.filter(node => !isNaN(node.ID));
        }, 400);
      }
      // this.currentPatients = nodes;
    }
  },
  components: {
    PatientTree,
    MeasureMutiply
  }
};
</script>
<style>
:root {
  --orderExcuteView--border: 1px solid #ccc;
  --orderExcuteView--margin: 4px;
}

@b TemperatureMeasureMutiply {
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
    & .el-tree {
      background-color: #f5f5f5;
      border: none;
    }
  }
  @e measureMutiply {
    flex: 1 0 300px;
    margin: var(--orderExcuteView--margin) var(--orderExcuteView--margin)
      var(--orderExcuteView--margin) 0;
    border: var(--orderExcuteView--border);
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
  }
}

/*
ul {
  background-color: #509de1;
}*/
</style>

