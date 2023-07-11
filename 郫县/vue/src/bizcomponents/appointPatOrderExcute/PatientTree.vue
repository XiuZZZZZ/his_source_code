<template>
  <div class="patientTree">
    <!-- <CommonInput class="patientTree__input"
                 placeholder="请输入患者信息"
                 width="200px"
                 iconClass="fa fa-search">
    </CommonInput> -->
     <el-popover  placement="right" trigger="click">
        <PatSearch ></PatSearch>
        <el-button class="patientTree__patSearchBtn" slot="reference">住院证信息查询</el-button>
    </el-popover>
    <el-button class="patientTree__patSearchBtn" @click="readCard">读卡</el-button>
    <el-input class="patientTree__input"
              placeholder="请输入患者信息"
              v-model="filterText">
              <el-button slot="append" icon="el-icon-refresh" @click="searchClick"></el-button>
    </el-input>
    <!-- <el-switch class="patientTree__switch"
               v-model="ifSortByGroup"
               active-text="专业组"
               inactive-text="床位"></el-switch> -->
    <el-tree class="patientTree__tree"
             :data="patients"
             @current-change="onCurrentChange"
             :highlight-current="select===''||select"
             node-key="ID"
             :default-checked-keys="defaultCheckedKeys"
             :default-expand-all="true"
             :filter-node-method="filterNode"
             ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <el-tooltip disabled class="item" effect="dark" content="Right Center 提示文字" placement="right">
              <span>{{ data.label }}</span>
            </el-tooltip>            
          </span>>      
    </el-tree>
  </div>
</template>
<script>
import CommonInput from "../../components/CommonInput";
import CommonButton from "../../components/CommonButton";
import appointApi from "../../store/api/appointPatOrder";
import pinyinUtil from "../../comm/pinyinUtil";
import menuParam from "../../comm/menuParam";
import PatSearch from "./PatSearch";

export default {
  name: "PatientTree",
  props: ["wardID", "episodeID", "select"],
  data() {
    return {
      patients: [],
      filterText: "",
      filterCode: ""
    };
  },
  beforeMount() {
    this.getWardPatients("", "");
  },
  mounted() {
    this.$eventBus.$on("pat-search-row-click", row => {
      const episodeIDTo = row.episodeIDTo;
      if (episodeIDTo !== "") {
        this.getWardPatients(episodeIDTo, "");
      }
    });
  },
  watch: {
    filterText(value) {
      this.$refs.tree.filter(value);
    },
    ward() {
      this.getWardPatients("", "");
    },
    ifSortByGroup() {
      this.getWardPatients("", "");
    }
  },
  components: {
    CommonInput,
    CommonButton,
    PatSearch
  },
  computed: {
    defaultCheckedKeys() {
      const keys = [];
      keys.push(this.episodeID);
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
    getWardPatients(episodeIDTo, papmiId) {
      // if (this.wardID !== '') {
      if (this.wardID !== "13213213213213213213") {
        appointApi
          .getAppPatList(this.wardID, episodeIDTo, papmiId)
          .then(patients => {
            this.patients = patients;
            // this.$eventBus.$emit("patientTree-patients-change", this.patients);
            this.$nextTick(() => {
              // this.onCheckChange();
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
    getPatientByEpisode(episodeID) {
      console.log(episodeID);
    },
    searchClick() {
      this.filterText = "";
      this.getWardPatients("", "");
    },
    // onCheckChange(data) {
    //   debugger;
    //   if (typeof data !== "undefined" && data.episodeID) {
    //     menuParam.selectBedToTMenu(data.episodeID, data.patientID, "0");
    //   }
    //   this.$emit(
    //     "checkChange",
    //     this.$refs.tree.getCheckedKeys(false),
    //     this.$refs.tree.getCheckedNodes(false)
    //   );
    // },
    onCurrentChange(patient) {
      if (patient) {
        menuParam.selectBedToTMenu(patient.episodeID, patient.patientID, "0");
        this.$emit("currentChange", patient);
      }
    },
    readCard() {
      /* global window */
      const cardInfo = window.ReadCard();
      const myAry = cardInfo.toString().split("^");
      const rtn = myAry[0];
      let cardNo = "";
      let papmiId = "";
      let patientNo = "";
      switch (rtn) {
        case "0":
          cardNo = myAry[1];
          papmiId = myAry[4];
          patientNo = myAry[5];
          console.log(cardNo, papmiId, patientNo);
          this.getWardPatients("", papmiId);
          break;
        case "-200":
          this.$message.error("卡无效");
          break;
        case "-201":
          cardNo = myAry[1];
          papmiId = myAry[4];
          patientNo = myAry[5];
          console.log(cardNo, papmiId, patientNo);
          break;
        default:
      }
    }
  }
};
</script>

<style>
@import "../../assets/main.css";
@b patientTree {
  & .el-input-group__append {
    border-color: var(--mainColor);
  }
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  @e input {
    margin: 4px;
    width: 239px;
    height: 36px;
    & .el-input__inner {
      height: 36px;
      border: 1px solid var(--mainColor);
    }
    /* & .el-input--suffix {
      width: 100px;
    } */
  }
  @e patSearchBtn {
    color: #fff;
    margin: 4px;
    width: 239px;
    align-content: center;
    height: 38px;
    min-height:38px !important;
    background-color: var(--mainColor);
    border-radius: 0;
  }
  @e switch {
    margin: 0 35px;
  }
  @e tree {
    overflow: auto;
    border: none;
    margin-top: 5px;
    border-right: none !important;
    border-bottom: none !important;
    border-left: none !important;
    background-color: #f5f5f5;
  }
  @e dispostateSearch {
    margin: 4px 10px 4px 0;
    float: right;
    z-index: 2;
  }
  & .el-tree-node__content {
    &:hover {
      border: 1px solid var(--mainColor);
    }
  }
  & .is-current {
    color: var(--mainColor);
    border: 1px solid var(--mainColor);
  }
}
</style>
