<template>
  <el-dialog
    class="dialogTransaction"
    :visible.sync="ifShow"
    width="850px"
    @close="closeDialog"
  >
    <template slot="title">
      <i class="dialogTransaction__icon fa fa-bed"></i>
      <span class="dialogTransaction__title">{{ dialogTitle }}</span>
    </template>
    <template>
      <pat-info-banner :patInfo="patBedMap[episodeID]"></pat-info-banner>
      <span class="dialogTransaction__content">
        <span class="dialogTransaction__ifFirstBed" v-if="ifShowObsData"
          >首次分床&nbsp;&nbsp;&nbsp;&nbsp;</span
        >
        <span>将&nbsp;&nbsp;</span>
        <yl-select
          v-model="episodeID"
          class="dialogTransaction__patient"
          clearable
          disabled
          :filter-method="filterPatient"
          filterable
        >
          <el-option
            v-for="item in patients"
            :key="item.episodeID"
            :label="`${
              item.bedCode ? item.bedCode + '床' : item.bedCode + '等候区'
            } ${item.name}`"
            :value="item.episodeID"
          ></el-option>
        </yl-select>
        <!-- <span class="dialogTransaction__content--important">{{dialogTransFrom}}&nbsp&nbsp{{dialogTransPatient}}</span> -->
        <span>&nbsp;分配至&nbsp;&nbsp;</span>
        <span class="dialogTransaction__content--important">{{
          dialogTransTo
        }}</span>
      </span>
      <el-form
        class="dialogTransaction__form"
        label-width="100px"
        size="small"
        :model="transactionForm"
        :rules="transactionRules"
        ref="transactionForm"
      >
        <el-row v-if="ifShowObsData">
          <el-col :span="12">
            <el-form-item label="分床日期" key="transDate">
              <yl-date-picker
                v-model="transactionForm.transDate"
                class="dialogTransaction__datePicker"
                align="right"
                type="date"
                :readonly="true"
                :editable="false"
                :picker-options="datePickerOptions"
              >
              </yl-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时间" key="transTime">
              <el-time-select
                v-model="transactionForm.transTime"
                class="dialogTransaction__timeSelect"
                @input="onTransTimeChange"
                @blur="transTimeSelectBlur"
                :picker-options="timeOption"
              >
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="主管医生"
              :required="true"
              prop="mainDoc"
              key="transactionFormMainDoc"
            >
              <yl-select
                size="small"
                v-model="transactionForm.mainDoc"
                @update:data="(value) => (dialogMainDocs = value)"
                filterable
                :filter-method="filterDoctor"
                clearable
                multiple
                :multiple-limit="1"
                :runServerMethodStr="getDoctorMethodStr"
                @change="blurMainDoc"
                ref="docSelect"
              >
                <el-option
                  v-for="item in dialogMainDocs"
                  :key="item.ID"
                  :label="item.name"
                  :value="item.ID"
                ></el-option>
              </yl-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--  </el-row>
            <el-row type="flex" class="row-bg" justify="center">-->
            <el-form-item label="主管护士">
              <yl-select
                size="small"
                v-model="transactionForm.mainNurse"
                @update:data="(value) => (dialogMainNurses = value)"
                multiple
                filterable
                :filter-method="filterNurse"
                clearable
                :runServerMethodStr="getNurseMethodStr"
                :multiple-limit="2"
                ref="nurseSelect"
              >
                <el-option
                  v-for="item in dialogMainNurses"
                  :key="item.ID"
                  :label="item.name"
                  :value="item.ID"
                ></el-option>
              </yl-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ifShowObsData">
          <el-col :span="12">
            <el-form-item label="体温">
              <el-input
                v-model="transactionForm.temperature"
                maxlength="4"
                @keyup.enter.native="keyup('temperature')"
                ref="formTemperature"
              >
                <template slot="append">℃&nbsp;</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血压">
              <pressure-input
                v-model="transactionForm.bloodPressure"
                @keyup.enter.native="keyup('bloodPressure')"
                ref="formBloodPressure"
              ></pressure-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ifShowObsData">
          <el-col :span="12">
            <el-form-item label="身高">
              <el-input
                v-model="transactionForm.height"
                maxlength="3"
                @keyup.enter.native="keyup('height')"
                ref="formHeight"
              >
                <template slot="append">cm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重">
              <el-input
                v-model="transactionForm.weight"
                maxlength="5"
                @keyup.enter.native="keyup('weight')"
                ref="formWeight"
              >
                <template slot="append">kg</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span class="dialogTransaction__error" v-if="errorMsg !== ''">{{
        errorMsg
      }}</span>
      <span class="dialogTransaction__line"></span>
      <span class="dialogTransaction__footcontent">是否确认?</span>
      <span slot="footer">
        <common-button width="70" @click="confirmDialog">是</common-button>
        <span style="width: 80px; display: inline-block"></span>
        <common-button width="70" @click="closeDialog">否</common-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Select from "../../components/Select";
import CommonButton from "../../components/CommonButton";
import pinyinUtil from "../../comm/pinyinUtil";
import temperatureApi from "../../store/api/temperature";
import PatInfoBanner from "./PatInfoBanner";
import datetTimeFormat from "../../comm/utils";
import wardApi from "../../store/api/ward";
import PressureInput from "../../components/PressureInput";
import DatePicker from "../../components/DatePicker";

export default {
  name: "DialogTransaction",
  props: [
    "value",
    "transType",
    "dialogEpisodeID",
    "dialogTitle",
    "dialogTransTo",
    "transBed",
    "dialogTransPatient",
    "errorMsg",
  ],
  data() {
    return {
      episodeID: "",
      ifShow: false,
      ifShowObsData: false,
      dialogExcuteMethod: null,
      dialogMainNurses: [],
      dialogMainDocs: [],
      transactionForm: {
        mainDoc: [],
        mainNurse: [],
        height: "",
        weight: "",
        temperature: "",
        bloodPressure: {
          sysPressure: "",
          diaPressure: "",
        },
        transDate: "",
        transTime: "",
      },
      transactionRules: {
        mainDoc: [
          {
            required: true,
            message: "请选择主管医生",
            trigger: "change",
            type: "array",
          },
        ],
      },
      patients: [],
      datePickerOptions: {
        disabledDate(time) {
          return time.getDate() !== new Date().getDate();
        },
      },
      timeOption: {
        start: "00:00",
        end: "23:59",
        step: "00:01",
      },
    };
  },
  mounted() {
    this.ifShow = true;
    if (this.dialogEpisodeID) {
      this.initFormData(this.dialogEpisodeID);
      this.episodeID = this.dialogEpisodeID;
    }
    this.initPatients();
  },
  watch: {
    value(value) {
      if (value) {
        this.$refs.docSelect.initData();
        this.$refs.nurseSelect.initData();
        if (this.dialogEpisodeID) {
          this.initFormData(this.dialogEpisodeID);
          this.episodeID = this.dialogEpisodeID;
        }
        this.initPatients();
      } else {
        this.clearData();
      }
      this.ifShow = value;
    },
    episodeID(value) {
      if (value) {
        this.initFormData(value);
        this.ifShowObsData =
          this.patBedMap[this.episodeID].ifFirstToBed &&
          this.patBedMap[this.episodeID].ifFirstToBed === "Y";
      }
    },
  },
  computed: {
    ...mapGetters(["currentWard", "patBedMap"]),
    patientInfo() {
      return this.patBedMap[this.episodeID];
    },
    getNurseMethodStr() {
      return `Nur.CommonInterface.Ward:getMainNurses:${this.currentWard.locID}:`;
    },
    getDoctorMethodStr() {
      let locID = this.currentWard.docLocID;
      if (this.episodeID !== "") {
        locID = this.patBedMap[this.episodeID].currLocID;
      }
      return `Nur.CommonInterface.Ward:getMainDoctors:${locID}:`;
    },
  },
  methods: {
    ...mapMutations(["insertPatBedMap"]),
    initFormData(episodeID) {
      this.transactionForm.mainNurse = this.patBedMap[episodeID].mainNurseID;
      this.transactionForm.mainDoc = this.patBedMap[episodeID].mainDoctorID;
      wardApi.getCurrenDataTime().then((ret) => {
        const retArray = ret.split("^");
        this.transactionForm.transDate = retArray[1];
        this.transactionForm.transTime = retArray[2];
      });
      /* 
      this.transactionForm.height = this.patBedMap[episodeID].height;
      this.transactionForm.weight = this.patBedMap[episodeID].weight;
      this.transactionForm.salvage = this.patBedMap[episodeID].salvage; */
      if (
        this.transactionForm.mainNurse.length === 0 ||
        this.transactionForm.mainDoc.length === 0
      ) {
        const that = this;
        wardApi.getBedDocNurse(this.transBed.ID).then((bedDocNur) => {
          const { bedDoc, bedNur } = bedDocNur;
          if (
            bedDoc &&
            that.transactionForm.mainDoc.length === 0 &&
            bedDoc !== ""
          ) {
            that.transactionForm.mainDoc.push(bedDoc);
          }
          if (
            bedNur &&
            that.transactionForm.mainNurse.length === 0 &&
            bedNur !== ""
          ) {
            that.transactionForm.mainNurse.push(bedNur);
          }
        });
      }
    },
    clear() {
      this.lendPatientLabel = "";
      this.episodeID = "";
    },

    closeDialog() {
      this.ifShow = false;
      this.$refs.transactionForm.resetFields();
      this.$emit("input", false);
    },
    initPatients() {
      const patients = [];
      Object.keys(this.patBedMap).forEach((episodeID) => {
        if (this.transType === "BED") {
          patients.push(this.patBedMap[episodeID]);
        } else if (
          this.transType === "WAITING" &&
          this.patBedMap[episodeID].bedCode !== ""
        ) {
          patients.push(this.patBedMap[episodeID]);
        }
      });
      this.patients = patients.sort(
        (prePat, nextPat) => prePat.bedCode - nextPat.bedCode
      );
    },
    clearData() {
      this.dialogMainNurses = [];
      this.dialogMainDocs = [];
      this.transactionForm.mainDoc = [];
      this.transactionForm.mainNurse = [];
      this.transactionForm.height = "";
      this.transactionForm.weight = "";
      this.transactionForm.temperature = "";
      this.transactionForm.bloodPressure = {
        sysPressure: "",
        diaPressure: "",
      };
      this.episodeID = "";
    },
    filterPatient(query) {
      const queryStr = query.toUpperCase();
      this.initPatients();
      this.patients = this.patients.filter(
        (patient) =>
          patient.name.indexOf(queryStr) > -1 ||
          String(patient.bedCode).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(patient.name).indexOf(queryStr) > -1
      );
    },
    filterDoctor(query) {
      const queryStr = query.toUpperCase();
      this.dialogMainDocs = this.$refs.docSelect.optionsData.filter(
        (doc) =>
          doc.name.indexOf(queryStr) > -1 ||
          String(doc.jobNo).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(doc.name).indexOf(queryStr) > -1
      );
    },
    filterNurse(query) {
      const queryStr = query.toUpperCase();
      this.dialogMainNurses = this.$refs.nurseSelect.optionsData.filter(
        (nurse) =>
          nurse.name.indexOf(queryStr) > -1 ||
          String(nurse.jobNo).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(nurse.name).indexOf(queryStr) > -1
      );
    },
    confirmDialog() {
      // this.saveHeightWeight();
      this.$refs.transactionForm.validate((valid) => {
        if (valid) {
          const { mainDoc, mainNurse } = this.transactionForm;
          if (this.episodeID !== "") {
            this.$emit(
              "confirmDialog",
              this.episodeID,
              mainDoc,
              mainNurse,
              this
            );
            /* if (
              this.patBedMap[this.episodeID].ifFirstToBed &&
              this.patBedMap[this.episodeID].ifFirstToBed === "Y"
            ) {
              // this.saveHeightWeight(() => {
                this.$emit("confirmDialog", this.episodeID, mainDoc, mainNurse,this);
              // });
            } 
            else {
              this.$emit("confirmDialog", this.episodeID, mainDoc, mainNurse);
            }*/
          } else {
            this.$message.error("请选择病人!");
            return false;
          }
        } else {
          return false;
        }
        return true;
      });
    },
    saveHeightWeight(callBack) {
      const that = this;
      temperatureApi.getSplitCharDecimal().then((splitChar) => {
        datetTimeFormat.getCurrentDateTime("1").then((dateTime) => {
          const searchDate = datetTimeFormat.formatDate(new Date());
          const searchTime = dateTime.time;
          const dateTimeSplitChar = String.fromCharCode(
            splitChar.dateTimeSplitChar
          );
          const codeValueSplitChar = String.fromCharCode(
            splitChar.codeValueSplitChar
          );
          const codeSplitChar = String.fromCharCode(splitChar.codeSplitChar);
          const codeArray = [
            "height",
            "weight",
            "temperature",
            "sysPressure",
            "diaPressure",
          ];
          const dateTimeString = `${searchDate}${dateTimeSplitChar}${searchTime}${dateTimeSplitChar}`;
          let editItemValueString = "";
          let codeValueStrs = "";
          codeArray.forEach((code) => {
            let codeValueString = "";
            if (code === "sysPressure" || code === "diaPressure") {
              codeValueString = `${code}${codeValueSplitChar}${that.transactionForm.bloodPressure[code]}`;
            } else {
              codeValueString = `${code}${codeValueSplitChar}${that.transactionForm[code]}`;
            }
            codeValueStrs += `${codeValueString}${codeSplitChar}`;
          });
          editItemValueString = `${dateTimeString}${codeValueStrs}`;
          if (editItemValueString !== "") {
            temperatureApi
              .saveObsData(that.episodeID, editItemValueString)
              .then((ret) => {
                if (String(ret) === "0") {
                  callBack();
                } else {
                  this.$message.error("生命体征信息保存失败!");
                }
              });
          }
        });
      });
    },
    blurMainDoc() {
      this.$refs.docSelect.blur();
    },
    keyup(val) {
      switch (val) {
        case "temperature":
          this.$refs.formBloodPressure.focus();
          break;
        case "bloodPressure":
          this.$refs.formHeight.focus();
          break;
        case "height":
          this.$refs.formWeight.focus();
          break;
        default:
          break;
      }
    },
    transTimeSelectBlur(timeSelect) {
      const currTimeValue = timeSelect.$children[0].currentValue;
      if (datetTimeFormat.formatTime(currTimeValue) !== "") {
        this.transactionForm.transTime = currTimeValue;
      }
    },
    onTransTimeChange(time) {
      this.transactionForm.transTime = time;
    },
  },
  components: {
    CommonButton,
    YlSelect: Select,
    PatInfoBanner,
    PressureInput,
    YlDatePicker: DatePicker,
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b dialogTransaction {
  & .el-dialog__body {
    padding-top: 2px;
  }
  @e icon {
    color: white;
  }
  @e title {
    padding: 0 0 0 7px;
    font-size: var(--navFontSize);
    color: white;
  }
  @e content {
    display: block;
    text-align: center;
    color: black;
    font-size: var(--navFontSize);
    margin: 10px 0 20px 0;
    vertical-align: sub;
    @m important {
      font-size: 18px;
      color: var(--mainColor);
    }
  }
  @e patient {
    width: 150px;
  }
  @e form {
    width: 550px;
    margin: auto;
  }
  @e line {
    display: block;
    height: 0;
    border-bottom: 1px dashed #556983;
    margin: 38px 15px;
  }
  @e footcontent {
    display: block;
    text-align: center;
    color: black;
    font-size: var(--navFontSize);
  }
  @e error {
    display: block;
    text-align: center;
    color: red;
    font-size: var(--navFontSize);
  }
  @e ifFirstBed {
    color: red;
    font-size: var(--navFontSize);
  }
  @e datePicker {
    width: 175px !important;
  }
  @e timeSelect {
    width: 175px !important;
  }
}
</style>
