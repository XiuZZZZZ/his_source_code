<template>
  <div class="TemperatureMeasureSingle">
    <PatientTree class="TemperatureMeasureSingle__patientTree"
                 :wardID="wardID"
                 @currentChange="currentChange"
                 :episodeID="currentPatient.episodeID"
                 select></PatientTree>
    <MeasureSingle class="TemperatureMeasureSingle__measureSingle"
                   :patient="currentPatient"
                   :tempConfig="tempConfig.singleConfig?tempConfig.singleConfig:{}"></MeasureSingle>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import PatientTree from "../components/PatientTree";
import MeasureSingle from "../bizcomponents/temperatureMeasure/MeasureSingle";
import SESSION from "../store/api/session";

export default {
  name: "TemperatureMeasureSingle",
  data() {
    return {
      currentPatient: {
        medicareNo: "",
        name: "",
        age: "",
        episodeID: SESSION.USER.EPISODEID
      }
    };
  },
  created() {
    this.getTempConfig();
  },
  computed: {
    ...mapGetters(["wardID", "tempConfig"])
  },
  methods: {
    ...mapActions(["getTempConfig"]),
    currentChange(data) {
      if (data) {
        //  && !data.children
        this.currentPatient = data;
      }
    }
  },
  components: {
    PatientTree,
    MeasureSingle
  }
};
</script>
<style>
:root {
  --orderExcuteView--border: 1px solid #ccc;
  --orderExcuteView--margin: 4px;
}

@b TemperatureMeasureSingle {
  width: 98%;
  height: 95%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  @e measureSingle {
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

