<template>
  <div class="patInfo">
    <component
      v-model="ifShowDialogUpdatePatInfo"
      :is="dialogUpdatePatInfoComponentName"
      :edit="false"
      :dialogParam="dialogUpdatePatInfo"
    ></component>
  </div>
</template>
<script>
import axios from "axios";
import { mapActions } from "vuex";
import DialogUpdatePatInfo from "../bizcomponents/bedChart/DialogUpdatePatInfo";
import SESSION from "../store/api/session";
import apiPatient from "../store/api/patient";

export default {
  name: "PatInfo",
  data() {
    return {
      ifShowDialogUpdatePatInfo: false,
      dialogUpdatePatInfoComponentName: "",
      dialogUpdatePatInfo: {
        title: "病人基本信息",
        patInfo: ""
      }
    };
  },
  components: {
    DialogUpdatePatInfo
  },
  created() {
    const promises = [];
    promises.push(this.getLocLinkWards());
    const promiseGetPatInfo = apiPatient
      .getPatient(SESSION.USER.EPISODEID)
      .then(patient => {
        this.dialogUpdatePatInfo.patInfo = patient;
      });
    promises.push(promiseGetPatInfo);
    axios.all(promises).then(() => {
      this.dialogUpdatePatInfoComponentName = "DialogUpdatePatInfo";
      this.ifShowDialogUpdatePatInfo = true;
    });
  },
  methods: {
    ...mapActions(["getLocLinkWards"])
  }
};
</script>
<style>
@import "../assets/main.css";
.appointPatOrderExcuteView .el-dialog__header {
  display: none;
}
@b patInfo {
  & .el-dialog {
    position: absolute;
    top: 0;
    left: 0;
    transform: none;
    max-height: calc(100% - 0px);
    max-width: calc(100% - 0px);
  }
  & .el-dialog__header {
    display: none;
  }
}
</style>

