<template>
  <div class="patientTree">
    <!-- <CommonInput class="patientTree__input"
                 placeholder="请输入患者信息"
                 width="200px"
                 iconClass="fa fa-search">
    </CommonInput> -->
    <el-input class="patientTree__input"
              placeholder="请输入患者信息"
              v-model="filterText">
    </el-input>
    <el-switch class="patientTree__switch"
               v-model="ifSortByGroup"
               active-text="专业组"
               inactive-text="床位"></el-switch>
    <el-tree class="patientTree__tree"
             :data="patients"
             @check-change="onCheckChange"
             :show-checkbox="(select=== undefined)||(select===false)"
             @current-change="onCurrentChange"
             :highlight-current="select===''||select"
             node-key="ID"
             :default-checked-keys="defaultCheckedKeys"
             :default-expand-all="true"
             :filter-node-method="filterNode"
             ref="tree"></el-tree>
  </div>
</template>
<script>
import CommonInput from "../components/CommonInput";
import wardApi from "../store/api/ward";
import pinyinUtil from "../comm/pinyinUtil";
import menuParam from "../comm/menuParam";

export default {
  name: "PatientTree",
  props: ["wardID", "episodeID", "select", "babyFlag", "allPatientChecked"],
  data() {
    return {
      ifSortByGroup: false,
      patients: [],
      filterText: "",
      filterCode: ""
    };
  },
  beforeMount() {
    this.getWardPatients();
  },
  watch: {
    filterText(value) {
      this.$refs.tree.filter(value);
    },
    ward() {
      this.getWardPatients();
    },
    ifSortByGroup() {
      this.getWardPatients();
    }
  },
  components: {
    CommonInput
  },
  computed: {
    defaultCheckedKeys() {
      const keys = [];
      if (this.allPatientChecked) {
        const pushPatientKey = function(parent) {
          if (Array.isArray(parent)) {
            parent.forEach(node => {
              pushPatientKey(node);
            });
          } else if (Array.isArray(parent.children)) {
            keys.push(parent.ID);
            pushPatientKey(parent.children);
          }
        };
        pushPatientKey(this.patients);
      } else {
        keys.push(this.episodeID);
      }
      return keys;
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      if (data.episodeID) {
        const uppCaseValue = value.toUpperCase();
        const patKeys = [
          "bedCode",
          "episodeID",
          "regNo",
          "name",
          "medicareNo",
          "mainDoctor",
          "mainNurse",
          "diagnosis",
          "admReason",
          "personID"
        ];
        return !!patKeys.find(key => {
          if (data[key]) {
            const content = String(data[key]);
            if (
              content.indexOf(uppCaseValue) > -1 ||
              content.toUpperCase().indexOf(uppCaseValue) > -1 ||
              pinyinUtil.getFirstLetter(content).indexOf(uppCaseValue) > -1
            ) {
              return true;
            }
          }
          return false;
        });
      }
      return false;
    },
    getWardPatients() {
      // if (this.wardID !== '') {
      if (this.wardID !== "13213213213213213213") {
        wardApi
          .getWardPatients(
            this.wardID,
            this.episodeID,
            this.ifSortByGroup,
            this.babyFlag
          )
          .then(patients => {
            this.patients = patients;
            // this.$eventBus.$emit("patientTree-patients-change", this.patients);
            this.$nextTick(() => {
              this.onCheckChange();
              if (this.episodeID) {
                this.$refs.tree.setCurrentKey(this.episodeID);
                let selectedPatient;
                this.patients.forEach(node => {
                  if (node.children) {
                    node.children.forEach(patient => {
                      if (String(patient.ID) === String(this.episodeID)) {
                        selectedPatient = patient;
                      }
                    }, this);
                  }
                }, this);
                this.onCurrentChange(selectedPatient);
              }
            });
          });
      }
    },
    onCheckChange(data) {
      if (typeof data !== "undefined" && data.episodeID) {
        menuParam.selectBedToTMenu(data.episodeID, data.patientID, "0");
      }
      this.$emit(
        "checkChange",
        this.$refs.tree.getCheckedKeys(false),
        this.$refs.tree.getCheckedNodes(false)
      );
    },
    onCurrentChange(patient) {
      if (typeof patient === "undefined" && this.episodeID) {
        let selectedPatient;
        this.patients.forEach(node => {
          if (node.children) {
            node.children.forEach(child => {
              if (String(child.ID) === String(this.episodeID)) {
                selectedPatient = child;
              } else if (Array.isArray(child.children)) {
                child.children.forEach(leaf => {
                  if (String(leaf.ID) === String(this.episodeID)) {
                    selectedPatient = leaf;
                  }
                });
              }
            }, this);
          }
        });
        this.$emit("currentChange", selectedPatient);
      } else {
        this.$emit("currentChange", patient);
      }
    }
  }
};
</script>

<style>
@import "../assets/main.css";
@b patientTree {
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  @e input {
    margin: 4px;
    width: 199px;
    & .el-input__inner {
      border: 1px solid var(--mainColor);
    }
    /* & .el-input--suffix {
      width: 100px;
    } */
  }
  @e switch {
    margin: 0 35px;
  }
  @e tree {
    overflow: auto;
    flex-grow: 1;
    border: none;
    margin-top: 10px;
    border-right: none !important;
    border-bottom: none !important;
    border-left: none !important;
    background-color: #f5f5f5;
  }
}
</style>
