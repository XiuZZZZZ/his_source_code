<template>
  <el-dialog
    class="dialogUpdatePatInfo"
    :visible.sync="ifShow"
    :width="getWidth"
    :show-close="edit"
    :fullscreen="!edit"
    @close="closeDialog"
  >
    <template slot="title">
      <i class="dialogUpdatePatInfo__icon fa fa-user-md"></i>
      <span class="dialogUpdatePatInfo__title">{{dialogParam.title}}</span>
    </template>
    <template>
      <div>
        <pat-info-banner :patInfo="updatePatInfoForm"></pat-info-banner>
      </div>
      <div>
        <el-form
          class="dialogUpdatePatInfo__form"
          label-width="95px"
          :model="updatePatInfoForm"
          :rules="updatePatInfoRules"
          ref="updatePatInfoForm"
        >
          <el-row class="row-bg" type="flex" justify="center">
            <el-col>
              <el-form-item label="民族">
                <el-input v-model="updatePatInfoForm.nation" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="病案号">
                <el-input v-model="updatePatInfoForm.medicareNo" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="登记号">
                <el-input v-model="updatePatInfoForm.regNo" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" type="flex" justify="center">
            <el-col>
              <el-form-item label="身份证">
                <el-input v-model="updatePatInfoForm.personID" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="医保号">
                <el-input
                  v-model="updatePatInfoForm.insuranceCard"
                  :readonly="true"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" type="flex" justify="center">
            <el-col>
              <el-form-item label="联系人">
                <el-input v-model="updatePatInfoForm.patLinkman" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="联系电话">
                <el-input v-model="updatePatInfoForm.telphone" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" type="flex">
            <el-col>
              <el-form-item label="家庭住址">
                <el-input v-model="updatePatInfoForm.homeAddres" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" type="flex" justify="center">
            <el-col>
              <el-form-item label="入院时间">
                <el-input
                  v-model="updatePatInfoForm.inHospDateTime"
                  :readonly="true"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" type="flex" justify="center">
            <el-col>
              <el-form-item label="诊断">
                <el-input v-model="updatePatInfoForm.diagnosis" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="row-bg" type="flex" justify="center">
            <el-col>
              <el-form-item label="押金余额">
                <el-input v-model="updatePatInfoForm.balance" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="总花费">
                <el-input v-model="updatePatInfoForm.totalCost" :readonly="true" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="edit">
            <el-row class="row-bg" type="flex" justify="center">
              <el-col>
                <el-form-item
                  label="主管医生"
                  :required="true"
                  prop="mainDoctorID"
                  key="dialogUpdatePatInfoMainDoctorID"
                >
                  <yl-select
                    size="mini"
                    class="dialogUpdatePatInfo__select"
                    v-model="updatePatInfoForm.mainDoctorID"
                    @update:data="value=>dialogMainDocs=value"
                    filterable
                    :filter-method="filterDoctor"
                    clearable
                    multiple
                    :multiple-limit="1"
                    :runServerMethodStr="getDoctorMethodStr"
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
              <el-col>
                <el-form-item label="主管护士">
                  <yl-select
                    size="mini"
                    class="dialogUpdatePatInfo__select"
                    v-model="updatePatInfoForm.mainNurseID"
                    @update:data="value=>dialogMainNurses=value"
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
          </template>
        </el-form>
      </div>
      <template v-if="edit">
        <span
          class="dialogUpdatePatInfo__error"
          v-if="dialogParam.errorMsg!==''"
        >{{dialogParam.errorMsg}}</span>
        <span class="dialogUpdatePatInfo__line"></span>
        <span class="dialogUpdatePatInfo__footcontent">是否确认?</span>
        <span slot="footer">
          <common-button width="70" @click="submitUpdateInfo">是</common-button>
          <span style="width:80px;display:inline-block"></span>
          <common-button width="70" @click="closeDialog">否</common-button>
        </span>
      </template>
    </template>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Select from "../../components/Select";
import CommonButton from "../../components/CommonButton";
import pinyinUtil from "../../comm/pinyinUtil";
import patApi from "../../store/api/patient";
import PatInfoBanner from "./PatInfoBanner";

export default {
  name: "DialogUpdatePatInfo",
  props: ["value", "dialogParam", "edit"],
  data() {
    return {
      ifShow: false,
      dialogExcuteMethod: null,
      dialogMainNurses: [],
      dialogMainDocs: [],
      updatePatInfoForm: {},
      updatePatInfoRules: {
        mainDoctorID: [
          {
            required: true,
            message: "请选择主管医生",
            trigger: "change",
            type: "array"
          }
        ]
      }
    };
  },
  mounted() {
    this.ifShow = true;
    this.initData();
  },
  watch: {
    value(value) {
      if (value) {
        this.initData();
      }
      this.ifShow = value;
    }
  },
  computed: {
    ...mapGetters(["currentWard"]),
    getWidth() {
      return this.edit ? "900px" : "";
    },
    getNurseMethodStr() {
      return `Nur.CommonInterface.Ward:getMainNurses:${this.currentWard.locID}:`;
    },
    getDoctorMethodStr() {
      const admLocID = this.updatePatInfoForm.currLocID;
      return `Nur.CommonInterface.Ward:getMainDoctors:${admLocID}:`;
    }
  },
  methods: {
    ...mapMutations(["requestQuery"]),
    initData() {
      this.updatePatInfoForm = JSON.parse(
        JSON.stringify(this.dialogParam.patInfo)
      );
      if (this.$refs && this.$refs.updatePatInfoForm) {
        this.$refs.updatePatInfoForm.clearValidate();
      }
    },
    closeDialog() {
      this.ifShow = false;
      this.$emit("input", false);
    },
    filterDoctor(query) {
      const queryStr = query.toUpperCase();
      this.dialogMainDocs = this.$refs.docSelect.optionsData.filter(
        doc =>
          doc.name.indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(doc.name).indexOf(queryStr) > -1
      );
    },
    filterNurse(query) {
      const queryStr = query.toUpperCase();
      this.dialogMainNurses = this.$refs.nurseSelect.optionsData.filter(
        nurse =>
          nurse.name.indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(nurse.name).indexOf(queryStr) > -1
      );
    },
    submitUpdateInfo() {
      this.$refs.updatePatInfoForm.validate(valid => {
        if (valid) {
          const episodeID = this.dialogParam.patInfo.episodeID;
          const { mainDoctorID, mainNurseID } = this.updatePatInfoForm;
          patApi
            .updateMainDocNur(episodeID, mainDoctorID, mainNurseID)
            .then(ret => {
              if (ret.status.toString() === "0") {
                this.ifShow = false;
                this.requestQuery();
                this.$emit("input", false);
              } else {
                this.$message({
                  message: ret.status.toString(),
                  duration: 0,
                  showClose: true,
                  type: "error"
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
        return true;
      });
    }
  },
  components: {
    CommonButton,
    PatInfoBanner,
    YlSelect: Select
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b dialogUpdatePatInfo {
  & .patInfoBanner__patInfo {
    float: none;
    padding: 5px 0px;
    width: 99%;
  }
  & .el-dialog__body {
    padding: 3px;
    margin: 0px 15px 0px 15px;
    height: 100%;
  }
  & .el-row--flex {
    height: 40px;
  }
  & .el-input__inner {
    line-height: 35px;
    height: 30px;
    /* border-radius: 0; */
  }
  & .el-input.is-disabled .el-input__inner {
    color: #000;
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
    margin: 0 0 20px 0;
    @m important {
      font-size: 18px;
      color: var(--mainColor);
    }
  }
  @e form {
    font-size: 10px;
    margin: 5px auto;
    padding-right: 25px;
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
  @e select {
    width: 254px;
  }
}
</style>
