<template>
  <el-dialog :visible.sync="ifShow" :width="dialogSize" @close="closeDialog">
    <template class="borrowBed" slot="title">
      <i class="borrowBed__icon fa fa-bed"></i>
      <span class="borrowBed__title">{{dialogTitle}}</span>
    </template>
    <template v-if="ifBorrowBed">
      <el-form
        class="borrowBed__form"
        label-position="right"
        label-width="105px"
        :model="bedForm"
        :rules="bedRules"
        ref="borrowBedForm"
      >
        <el-row class="row-bg" type="flex" justify="space-around">
          <el-col :span="6">
            <el-form-item label="包床患者" :required="ifRequiredPat">
              <yl-select
                v-model="dialogPatient"
                :disabled="ifSelectedBed"
                :filter-method="filterPatient"
                filterable
                clearable
              >
                <el-option
                  v-for="item in dialogPatients"
                  :key="item.patient.episodeID"
                  :label="item.patient.name"
                  :value="item.patient.episodeID"
                ></el-option>
              </yl-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开始日期" :required="true" prop="startDate">
              <yl-date-picker v-model="bedForm.startDate" :pickerOptions="startPickerOptions"></yl-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开始时间" :required="true" prop="startTime">
              <el-time-picker v-model="bedForm.startTime"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-bg" type="flex" justify="space-around">
          <el-col :span="6">
            <el-form-item label="床位代码">
              <yl-select
                v-model="dialogBed"
                :disabled="ifSelectedBed"
                filterable
                clearable
                ref="bedSelect"
              >
                <el-option
                  v-for="item in dialogBeds "
                  :key="item.ID"
                  :label="item.code"
                  :value="item.ID"
                ></el-option>
              </yl-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束日期">
              <yl-date-picker v-model="bedForm.endDate" :pickerOptions="endPickerOptions"></yl-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间">
              <el-time-picker v-model="bedForm.endTime"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-bg" type="flex" justify="space-around">
          <el-col :span="6">
            <el-form-item label="不可用原因" :required="true" prop="reason">
              <yl-select
                v-model="bedForm.reason"
                @update:data="value=>dialogReasons=value"
                @change="reasonSelectChange"
                filterable
                :filter-method="filterReason"
                clearable
                multiple
                :multiple-limit="1"
                :runServerMethodStr="getBedUnavailReasonStr"
                ref="reasonSelect"
              >
                <el-option
                  v-for="item in dialogReasons"
                  :key="item.ID"
                  :label="item.reason"
                  :value="item.ID"
                ></el-option>
              </yl-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户" v-if="false">
              <el-input placeholder="请输入用户名" v-model="dialogUserCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="密码" v-if="false">
              <el-input placeholder="请输入密码" type="password" v-model="dialogUserPass"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="bedForm.reason.length===0" class="row-bg" type="flex" justify="center">
          <span class="borrowBed__error">{{errInfo}}</span>
        </el-row>
        <el-row class="row-bg" type="flex" justify="center" align="middle">
          <el-col :span="9" :push="7" v-if="false">
            <common-button
              border="0px solid #cccccc"
              color="#FFFFFF"
              backgroundColor="#F16E56"
              width="80"
            >删除</common-button>
          </el-col>
          <el-col :span="18" :push="8">
            <common-button
              color="#FFFFFF"
              backgroundColor="#509de1"
              width="80"
              @click="clickUpdate"
            >更新</common-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template class="cancleBed" v-if="!ifBorrowBed">
      <span class="cancleBed__content">
        结束
        <span class="cancleBed__content--important">{{cancelBedCode}}床</span>
        <span v-if="cancelPatient!==''">患者</span>
        <span class="cancleBed__content--important" v-if="cancelPatient!==''">{{cancelPatient}}</span>
        <span>{{unavailReason}}</span>
      </span>
      <span class="cancleBed__line"></span>
      <span class="cancleBed__content">是否确认?</span>
      <span slot="footer">
        <common-button width="70" @click="confirmFinishBorrowBed">是</common-button>
        <span style="width:80px;display:inline-block"></span>
        <common-button width="70" @click="closeDialog">否</common-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import CommonButton from "../../components/CommonButton";
import Select from "../../components/Select";
import DatePicker from "../../components/DatePicker";
import pinyinUtil from "../../comm/pinyinUtil";
import bedApi from "../../store/api/bed";
import datetTimeFormat from "../../comm/utils";

export default {
  name: "ComponentName",
  props: ["value", "borrowBed", "ifBorrowBed", "dialogSize", "dialogTitle"],
  data() {
    return {
      ifShow: false,
      ifSelectedBed: false,
      ifRequiredPat: false,
      errInfo: "",
      unavailReason: "",
      cancelBedCode: "",
      cancelPatient: "",
      dialogPatient: "",
      dialogPatients: [],
      dialogBed: "",
      dialogBeds: [],
      dialogReasons: [],
      dialogUserCode: "",
      dialogUserPass: "",
      dialogExcuteMethod: null,
      ifGetDialogReasons: false,
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      endPickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      bedForm: {
        reason: [],
        startDate: new Date(),
        startTime: new Date(),
        endDate: "",
        endTime: ""
      },
      bedRules: {
        reason: [
          {
            type: "array",
            required: true,
            message: "请选择不可用原因",
            trigger: "change"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        startTime: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["selectedInfo", "currentWard", "patBedMap", "beds"]),
    getBedUnavailReasonStr() {
      // this.bedForm.reason = [];
      return `Nur.CommonInterface.Bed:getBedUnavailReason:${datetTimeFormat.formatDate(
        this.bedForm.startDate
      )}:${datetTimeFormat.formatDate(this.bedForm.endDate)}:`;
    }
  },
  watch: {
    dialogReasons() {
      if (this.selectedInfo.episodeID !== "" && this.dialogReasons.length > 0) {
        this.defaultSelectReasion();
      }
    },
    value(value) {
      this.ifShow = value;
      if (value) {
        this.getServerDateTime();
        this.showData();
      } else {
        this.clearData();
        if (this.$refs && this.$refs.borrowBedForm) {
          this.$refs.borrowBedForm.clearValidate();
        }
      }
    },
    beds() {
      this.findEmptyBed();
      this.findInPatient();
    }
  },
  created() {
    this.getServerDateTime();
  },
  mounted() {
    this.ifShow = true;
    this.findEmptyBed();
    this.findInPatient();
    this.showData();
  },
  methods: {
    ...mapMutations(["requestQuery"]),
    getServerDateTime() {
      const that=this;
      datetTimeFormat.getCurrentDateTime("1").then(dateTime => {
        that.bedForm.startDate = dateTime.date;
        const timeStr = `${String(dateTime.date).replace(/-/g, "/")} ${dateTime.time}`;
        that.bedForm.startTime = new Date(timeStr);
      });
    },
    clearData() {
      this.dialogPatient = "";
      this.dialogBed = "";
      this.bedForm.reason = [];
      this.ifSelectedBed = false;
      this.bedForm.startDate = new Date();
      this.bedForm.endDate = "";
      this.bedForm.endTime = "";
      this.bedForm.unavailReason = "";
    },
    showData() {
      this.unavailReason = this.borrowBed.unavailReason;
      if (this.unavailReason === "") {
        this.dialogBed = this.borrowBed.ID;
        if (this.selectedInfo.episodeID !== "") {
          this.ifSelectedBed = true;
          this.dialogPatient = this.selectedInfo.episodeID;
          this.defaultSelectReasion();
        }
      } else {
        this.cancelBedCode = this.borrowBed.code;
        this.cancelPatient = this.borrowBed.unavailPatName;
      }
    },
    closeDialog() {
      this.ifShow = false;
      this.$emit("input", this.ifShow);
    },
    findEmptyBed() {
      this.dialogBeds = this.beds.filter(
        bed => bed.patient.episodeID === undefined && bed.unavailReason === ""
      );
    },
    findInPatient() {
      this.dialogPatients = this.beds.filter(
        bed => bed.unavailReason === "" && bed.patient.episodeID !== undefined
      );
    },
    filterPatient(query) {
      const queryStr = query.toUpperCase();
      this.findInPatient();
      this.dialogPatients = this.dialogPatients.filter(
        pat =>
          pat.patient.name.indexOf(queryStr) > -1 ||
          pinyinUtil
            .getFirstLetter(pat.patient.name)
            .toUpperCase()
            .indexOf(queryStr) > -1
      );
    },
    filterReason(query) {
      const queryStr = query.toUpperCase();
      this.dialogReasons = this.$refs.reasonSelect.optionsData.filter(
        reason =>
          reason.reason.indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(reason.reason).indexOf(queryStr) > -1
      );
    },
    clickUpdate() {
      // this.dialogUserCode, this.dialogUserPass
      this.$refs.borrowBedForm.validate(valid => {
        if (valid) {
          const episodeID = this.dialogPatient;
          const bedID = this.dialogBed;
          const reason = this.bedForm.reason[0];
          const startDate = datetTimeFormat.formatDate(this.bedForm.startDate);
          const startTime = datetTimeFormat.formatTime(this.bedForm.startTime);
          const endDate = datetTimeFormat.formatDate(this.bedForm.endDate);
          const endTime = datetTimeFormat.formatTime(this.bedForm.endTime);
          if (!reason || reason === "") {
            this.errInfo = "请选择不可用原因!";
            return;
          }
          if (this.ifRequiredPat && episodeID === "") {
            this.$message.error("请选择包床患者!");
            return;
          }
          bedApi
            .borrowBedServer(
              episodeID,
              bedID,
              reason,
              startDate,
              startTime,
              endDate,
              endTime
            )
            .then(ret => {
              if (ret.status.toString() === "0") {
                this.ifShow = false;
                this.requestQuery();
              } else {
                this.$message.error(ret.status);
              }
            });
        }
      });
    },
    confirmFinishBorrowBed() {
      const bedID = this.borrowBed.ID;
      bedApi.finishBorrowBedServer(bedID).then(ret => {
        if (ret.status.toString() === "0") {
          this.ifShow = false;
          this.requestQuery();
        } else {
          console.log(ret.status);
        }
      });
    },
    reasonSelectChange() {
      const reason = this.dialogReasons.find(
        obj => obj.ID === this.bedForm.reason[0]
      );
      if (reason && reason.reason.indexOf("包床") > -1) {
        this.ifRequiredPat = true;
      } else {
        this.ifRequiredPat = false;
      }
    },
    defaultSelectReasion() {
      if (this.selectedInfo.episodeID !== "" && this.dialogReasons.length > 0) {
        this.bedForm.reason=[];
        for (const elem of this.dialogReasons.values()) {
          if (elem.reason.includes("包床")) {
            this.bedForm.reason.push(elem.ID);
          }
        }
      }
    }
  },
  components: {
    CommonButton,
    YlSelect: Select,
    YlDatePicker: DatePicker
  }
};
</script>

<style>
@import "../../assets/main.css";
@b borrowBed {
  @e title {
    padding: 0 0 0 7px;
    font-size: var(--navFontSize);
    color: white;
  }
  @e form {
    padding: 0;
    & .el-input__inner {
      width: 150px;
    }
    & .el-date-editor {
      width: 150px;
    }
  }
  @e icon {
    color: white;
  }
  @e error {
    display: block;
    text-align: center;
    color: red;
    font-size: var(--navFontSize);
  }
}

@b cancleBed {
  @e content {
    display: block;
    text-align: center;
    color: black;
    font-size: var(--navFontSize);
    /*var(--mainFontSize);*/
    @m important {
      font-size: 18px;
      color: var(--mainColor);
    }
  }

  @e line {
    display: block;
    height: 0;
    border-bottom: 1px dashed #556983;
    margin: 38px 15px;
  }
  & .el-dialog__body {
    overflow: hidden;
  }
}
</style>
