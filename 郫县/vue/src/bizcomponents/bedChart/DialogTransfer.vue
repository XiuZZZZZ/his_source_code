<template>
  <el-dialog
    class="dialogTransfer"
    :visible.sync="ifShow"
    width="1290px"
    top="5%"
    @close="closeDialog"
  >
    <template slot="title">
      <i class="dialogTransfer__icon fa fa-exchange"></i>
      <span class="dialogTransfer__title">{{ dialogTitle }}</span>
    </template>
    <template>
      <div class="dialogTransfer__patInfo">
        <pat-info-banner :patInfo="patInfo"></pat-info-banner>
      </div>
      <div class="dialogTransfer__transferRecord">
        <div class="dialogTransfer__transferRecord--title">
          <span class="dialogTransfer__transferOperate--titleWord"
            >转科记录</span
          >
        </div>
        <div class="dialogTransfer__transferRecord--step">
          <steps-transfer :episodeID="this.episodeID"></steps-transfer>
        </div>
      </div>
      <div class="dialogTransfer__transferOperate">
        <div class="dialogTransfer__transferOperate--title">
          <span class="dialogTransfer__transferOperate--titleWord"
            >变更记录明细</span
          >
        </div>
        <div class="dialogTransfer__transferOperate--content">
          <span class="dialogTransfer__transferDeptTitle">科室和医生变更</span>
          <div
            class="dialogTransfer__transferDept"
            :class="{ 'is-selected': isSelectTransDept }"
            @mouseenter="selectTransDept"
          >
            <span>
              <el-form
                label-position="right"
                label-width="135px"
                :model="transDeptForm"
                :rules="transDeptRules"
                ref="transDeptForm"
              >
                <el-row class="row-bg" type="flex" justify="center">
                  <el-col>
                    <el-form-item label="转科日期" key="transDeptDate">
                      <yl-date-picker
                        v-model="transDeptForm.transDeptDate"
                        class="dialogTransfer__datePicker"
                        align="right"
                        type="date"
                        :readonly="true"
                        :editable="false"
                        :picker-options="datePickerOptions"
                      >
                      </yl-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="时间" key="transDeptTime">
                      <el-time-select
                        v-model="transDeptForm.transDeptTime"
                        class="dialogTransfer__timeSelect"
                        @input="onTransDeptTimeChange"
                        @blur="transDeptTimeSelectBlur"
                        :picker-options="timeOption"
                      >
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-bg" type="flex" justify="center">
                  <el-col>
                    <el-form-item
                      label="科室"
                      :required="true"
                      prop="loc"
                      key="dialogTransferFormLoc"
                    >
                      <yl-select
                        v-model="transDeptForm.loc"
                        size="small"
                        @update:data="(value) => (dialogLocs = value)"
                        filterable
                        :filter-method="filterLoc"
                        clearable
                        @change="transDeptChange"
                        :runServerMethodStr="getLocMethodStr"
                        ref="locSelect"
                      >
                        <el-option
                          v-for="item in dialogLocs"
                          :key="item.ID"
                          :label="item.desc"
                          :value="item.ID"
                        ></el-option>
                      </yl-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="用户">
                      <el-input
                        placeholder="请输入用户名"
                        v-model="transDeptForm.userCode"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-bg" type="flex" justify="center">
                  <el-col>
                    <el-form-item
                      label="病区"
                      :required="true"
                      prop="locLinkWard"
                      key="dialogTransferFormLocLinkWard"
                    >
                      <yl-select
                        v-model="transDeptForm.locLinkWard"
                        size="small"
                        :disabled="transDeptForm.loc === ''"
                        @update:data="
                          (value) => {
                            dialogTransLocLinkWards = value;
                          }
                        "
                        filterable
                        :filter-method="filterWard"
                        clearable
                        :runServerMethodStr="getTransLocLinkWardMethodStr"
                        @change="locLinkWardChange"
                        ref="locLinkWardSelect"
                      >
                        <el-option
                          v-for="item in dialogTransLocLinkWards"
                          :key="item.wardID"
                          :label="item.wardDesc"
                          :value="item.wardID"
                        ></el-option>
                      </yl-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="密码">
                      <el-input
                        placeholder="请输入密码"
                        type="password"
                        v-model="transDeptForm.userPass"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-bg" type="flex" justify="center">
                  <el-col>
                    <el-form-item label="主管医生" v-if="false">
                      <yl-select
                        size="small"
                        v-model="transDeptForm.mainDoc"
                        @update:data="(value) => (dialogMainDocs = value)"
                        filterable
                        :filter-method="filterDoctor"
                        clearable
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
                  <el-col :span="2" v-if="false">
                    <common-button
                      width="90"
                      @click="submitDeptForm('transDeptForm')"
                      >转科
                    </common-button>
                  </el-col>
                  <el-col :span="7">
                    <common-button
                      width="90"
                      v-if="ifTransApplyButton"
                      @click="submitDeptApplyForm('transDeptForm')"
                      >转科申请
                    </common-button>
                  </el-col>
                </el-row>
              </el-form>
            </span>
          </div>
          <span class="dialogTransfer__transferWardTitle">病区和床位变更</span>
          <div
            class="dialogTransfer__transferWard"
            :class="{ 'is-selected': isSelectTransWard }"
            @mouseenter="selectTransWard"
          >
            <span>
              <el-form
                label-position="right"
                label-width="135px"
                :model="transWardForm"
                :rules="transWardRules"
                ref="transWardForm"
              >
                <el-row class="row-bg" type="flex" justify="center">
                  <el-col>
                    <el-form-item
                      label="病区"
                      :required="true"
                      prop="transWard"
                      key="dialogTransWard"
                    >
                      <!-- <yl-select v-model="transWardForm.transWard" filterable :filter-method="filterLocLinkWard" @change="transWardChange" size="small" clearable>
                        <el-option v-for="item in dialogLocLinkWards" :key="item.wardID" :label="item.wardDesc" :value="item.wardID"></el-option>
                      </yl-select> -->
                      <yl-select
                        v-model="transWardForm.transWard"
                        size="small"
                        @update:data="
                          (value) => {
                            dialogLocLinkWards = value;
                          }
                        "
                        filterable
                        :filter-method="filterLocLinkWard"
                        clearable
                        :runServerMethodStr="getTransWardLinkWardMethodStr"
                        ref="transWardLinkWardSelect"
                      >
                        <el-option
                          v-for="item in dialogLocLinkWards"
                          :key="item.wardID"
                          :label="item.wardDesc"
                          :value="item.wardID"
                        ></el-option>
                      </yl-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="用户">
                      <el-input
                        placeholder="请输入用户名"
                        v-model="transWardForm.userCode"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-bg" type="flex" justify="center">
                  <el-col>
                    <el-form-item label="床位代码">
                      <yl-select
                        v-model="transWardForm.bed"
                        size="small"
                        :disabled="transWardForm.transWard === ''"
                        @update:data="(value) => (dialogBeds = value)"
                        filterable
                        clearable
                        :runServerMethodStr="getEmptyBedsMethodStr"
                        ref="bedSelect"
                      >
                        <el-option
                          v-for="item in dialogBeds"
                          :key="item.ID"
                          :label="item.code"
                          :value="item.ID"
                        ></el-option>
                      </yl-select>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="密码">
                      <el-input
                        placeholder="请输入密码"
                        type="password"
                        v-model="transWardForm.userPass"
                        size="small"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="row-bg" type="flex" justify="center">
                  <el-col>
                    <el-form-item label="临时科室" v-if="false">
                      <yl-select
                        v-model="transWardForm.tempLoc"
                        size="small"
                        @update:data="(value) => (dialogTempLocs = value)"
                        filterable
                        :filter-method="filterTempLoc"
                        clearable
                        :runServerMethodStr="getLocMethodStr"
                        ref="tempLocSelect"
                      >
                        <el-option
                          v-for="item in dialogTempLocs"
                          :key="item.ID"
                          :label="item.desc"
                          :value="item.ID"
                        ></el-option>
                      </yl-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <common-button
                      width="90"
                      @click="submitWardForm('transWardForm')"
                      >转病区</common-button
                    >
                  </el-col>
                </el-row>
              </el-form>
            </span>
          </div>
        </div>
      </div>
      <div style="clear: both; height: 0"></div>
    </template>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import PatInfoBanner from "./PatInfoBanner";
import StepsTransfer from "./StepsTransfer";
import CommonButton from "../../components/CommonButton";
import Select from "../../components/Select";
import pinyinUtil from "../../comm/pinyinUtil";
import session from "../../store/api/session";
import patApi from "../../store/api/patient";
// import locApi from "../../store/api/loc";
import userApi from "../../store/api/userInfo";
import DatePicker from "../../components/DatePicker";
import utils from "../../comm/utils";

export default {
  name: "ComponentName",
  props: ["value", "dialogTitle"],
  data() {
    return {
      ifShow: false,
      episodeID: "",
      currWard: session.USER.WARDID,
      patInfo: {},
      dialogBed: "",
      dialogBeds: [],
      dialogMainDocs: [],
      dialogLocs: [],
      dialogTransLocLinkWards: [],
      dialogLocLinkWards: [],
      dialogTempLocs: [],
      isSelectTransDept: true,
      isSelectTransWard: false,
      ifTransApplyButton: true,
      transDeptForm: {
        loc: "",
        locLinkWard: "",
        mainDoc: "",
        userCode: "",
        userPass: "",
        transDeptDate: "",
        transDeptTime: "",
      },
      transDeptRules: {
        loc: [
          {
            required: true,
            message: "请选择科室",
            trigger: "change",
            type: "number",
          },
        ],
        locLinkWard: [
          {
            required: true,
            message: "请选择病区",
            trigger: "change",
            type: "number",
          },
        ],
      },
      transWardForm: {
        transWard: "",
        bed: "",
        tempLoc: "",
        userCode: "",
        userPass: "",
      },
      transWardRules: {
        transWard: [
          {
            required: true,
            message: "请选择病区",
            trigger: "change",
            type: "number",
          },
        ],
      },
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
  computed: {
    ...mapGetters([
      "selectedInfo",
      "currentWard",
      "patBedMap",
      "beds",
      "locLinkWards",
    ]),
    getLocMethodStr() {
      return `Nur.CommonInterface.Loc:getLocsExceptAdmLoc:E:${this.episodeID}:`;
    },
    getDoctorMethodStr() {
      const locID = this.transDeptForm.loc;
      if (!locID) return "";
      return `Nur.CommonInterface.Ward:getMainDoctors:${locID}:`;
    },
    getTransLocLinkWardMethodStr() {
      const locID = this.transDeptForm.loc;
      return `Nur.CommonInterface.Loc:getTransLocLinkWards:${locID}:`;
    },
    getEmptyBedsMethodStr() {
      const wardID = this.transWardForm.transWard;
      return `Nur.CommonInterface.Ward:getEmptyBeds:${wardID}:`;
    },
    getTransWardLinkWardMethodStr() {
      const episodeID = this.episodeID;
      /*     this.selectedInfo.episodeID === ""
          ? this.selectedInfo.waitingEpisodeID
          : this.selectedInfo.episodeID; */
      return `Nur.CommonInterface.Loc:getTransLocLinkWardsByAdm:${episodeID}:${this.currWard}:Y:`;
    },
  },
  watch: {
    value(value) {
      this.ifShow = value;
      if (value) {
        this.showData();
      } else {
        this.clearData();
      }
    },
  },
  mounted() {
    // const that = this;
    this.ifShow = true;
    // const currWard = this.currWard;
    // const episodeID =
    //   this.selectedInfo.episodeID === ""
    //     ? this.selectedInfo.waitingEpisodeID
    //     : this.selectedInfo.episodeID;
    // locApi.getLocLinkWardsExcept(episodeID).then(ret => {
    //   that.dialogLocLinkWards = ret.filter(
    //     ward => String(ward.wardID) !== String(currWard)
    //   );
    // });
    this.showData();
  },
  methods: {
    ...mapMutations(["requestQuery"]),
    clearData() {
      this.$refs.transDeptForm.resetFields();
      this.$refs.transWardForm.resetFields();
      this.patInfo = {};
      this.transDeptForm.userPass = "";
      this.transWardForm.userPass = "";
      this.transWardForm.bed = "";
      this.transWardForm.tempLoc = "";
      this.isSelectTransDept = true;
      this.isSelectTransWard = false;
      this.ifTransApplyButton = true;
    },
    showData() {
      this.episodeID =
        this.selectedInfo.episodeID === ""
          ? this.selectedInfo.waitingEpisodeID
          : this.selectedInfo.episodeID;
      this.patInfo = this.patBedMap[this.episodeID];
      this.transDeptForm.userCode = session.USER.USERCODE;
      this.transWardForm.userCode = session.USER.USERCODE;
      patApi.getTransLocDateTime(this.episodeID).then((ret) => {
        const retData = ret.replace(/\r\n/g, "");
        this.transDeptForm.transDeptDate = retData.split("^")[0];
        this.transDeptForm.transDeptTime = retData.split("^")[1];
      });

      const { loc, locLinkWard } = this.transDeptForm;

      patApi.ifHasTransOrder(this.episodeID, loc, locLinkWard).then((ret) => {
        if (String(ret) !== "0") {
          this.ifTransApplyButton = false;
          this.$message({
            showClose: true,
            message: ret,
            type: "error",
          });
        } else {
          this.ifHasNeedCareOrder(this.episodeID);
        }
      });
    },
    ifHasNeedCareOrder(episodeID) {
      const { loc } = this.transDeptForm;
      patApi.transLocAbnormalOrder(episodeID, loc).then((data) => {
        if (data.length > 0) {
          this.ifTransApplyButton = false;
          if (String(data[0].ifCanOper) === "1") {
            this.$alert(
              `${data[0].abnormalDesc},需处理后才能进行转科操作!`,
              "转科流程控制",
              {
                confirmButtonText: "打开需关注医嘱",
                callback: () => {
                  /* global websys_createWindow:true */
                  const linkUrl = `nur.hisui.orderNeedCare.csp?EpisodeID=${episodeID}&TypeCode=T`;
                  websys_createWindow(
                    linkUrl,
                    "转科需关注医嘱",
                    "width=98%,height=80%"
                  );
                  this.closeDialog();
                },
              }
            );
          }
          if (String(data[0].ifCanOper) === "0") {
            this.$confirm(
              `${data[0].abnormalDesc},是否现在进行处理?`,
              "转科提示",
              {
                confirmButtonText: "立即处理",
                cancelButtonText: "暂不处理",
                type: "warning",
              }
            )
              .then(() => {
                /* global websys_createWindow:true */
                const linkUrl = `nur.hisui.orderNeedCare.csp?EpisodeID=${episodeID}&TypeCode=T`;
                websys_createWindow(
                  linkUrl,
                  "转科需关注医嘱",
                  "width=98%,height=80%"
                );
                this.closeDialog();
              })
              .catch(() => {
                this.ifTransApplyButton = true;
              });
          }
        }
      });
    },
    selectTransDept() {
      this.isSelectTransDept = true;
      this.isSelectTransWard = false;
    },
    selectTransWard() {
      this.isSelectTransWard = true;
      this.isSelectTransDept = false;
    },
    closeDialog() {
      this.ifShow = false;
      this.episodeID = "";
      this.$emit("input", this.ifShow);
    },
    filterDoctor(query) {
      const queryStr = query.toUpperCase();
      this.dialogMainDocs = this.$refs.docSelect.optionsData.filter(
        (doc) =>
          String(doc.name).indexOf(queryStr) > -1 ||
          String(doc.jobNo).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(doc.name).indexOf(queryStr) > -1
      );
    },
    filterLoc(query) {
      const queryStr = query.toUpperCase();
      this.dialogLocs = this.$refs.locSelect.optionsData.filter(
        (loc) =>
          String(loc.desc).indexOf(queryStr) > -1 ||
          String(loc.code).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(loc.desc).indexOf(queryStr) > -1
      );
    },
    filterWard(query) {
      const queryStr = query.toUpperCase();
      this.dialogTransLocLinkWards = this.$refs.locLinkWardSelect.optionsData.filter(
        (ward) =>
          String(ward.wardDesc).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(ward.wardDesc).indexOf(queryStr) > -1
      );
    },
    filterTempLoc(query) {
      const queryStr = query.toUpperCase();
      this.dialogTempLocs = this.$refs.tempLocSelect.optionsData.filter(
        (loc) =>
          String(loc.desc).indexOf(queryStr) > -1 ||
          String(loc.code).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(loc.desc).indexOf(queryStr) > -1
      );
    },
    filterLocLinkWard(query) {
      const queryStr = query.toUpperCase();
      this.dialogLocLinkWards = this.$refs.transWardLinkWardSelect.optionsData.filter(
        (ward) =>
          ward.wardDesc.indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(ward.wardDesc).indexOf(queryStr) > -1
      );
    },
    transferDeptAction(action) {
      if (action === "confirm") {
        const episodeID = this.episodeID;
        const {
          loc,
          locLinkWard,
          mainDoc,
          transDeptDate,
          transDeptTime,
        } = this.transDeptForm;
        patApi
          .transLoc(
            episodeID,
            loc,
            locLinkWard,
            mainDoc,
            transDeptDate,
            transDeptTime
          )
          .then((ret) => {
            if (ret.status.toString() === "0") {
              this.ifShow = false;
              this.requestQuery();
            } else {
              console.log(ret.status);
            }
          });
      }
    },
    transDeptChange() {
      this.transDeptForm.locLinkWard = "";
      this.transDeptForm.mainDoc = "";
    },
    transWardChange() {
      this.transWardForm.bed = "";
    },
    showAbnormalMessage() {
      const episodeID = this.episodeID;
      patApi.transLocAbnormalOrder(episodeID).then((data) => {
        const h = this.$createElement;
        const abnormalOrders = [];
        let comment = {};
        for (let oi = 0; oi < data.length; oi += 1) {
          abnormalOrders[oi] = h("li", { style: "color: red" }, [
            h(
              "a",
              { style: "color: red", attrs: { href: "#test" } },
              `${data[oi].abnormalDesc}`
            ),
          ]);
        }
        let endComment = {};
        let ifShowConfirmButton = true;
        if (data.length > 0) {
          if (data[0].ifCanOper === "Y") {
            endComment = h("span", null, "确定继续操作?");
            ifShowConfirmButton = true;
          } else {
            endComment = h("span", null, "有未处理的医嘱,不允许转科!");
            ifShowConfirmButton = false;
          }
          comment = h("p", null, [
            // h("span", null, "该病人还有"),
            h("span", null, [abnormalOrders]),
            endComment,
          ]);
        } else {
          comment = h("span", null, "确认进行转科?");
        }
        this.$msgbox({
          title: "转科需关注医嘱",
          message: comment,
          type: "warning",
          showCancelButton: true,
          showConfirmButton: ifShowConfirmButton,
          callback: (action) => {
            this.transferDeptAction(action);
          },
        });
      });
    },
    submitDeptForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi
            .userPassMatch(
              this.transDeptForm.userCode,
              this.transDeptForm.userPass
            )
            .then((userValidRet) => {
              if (String(userValidRet.result) === "0") {
                const episodeID =
                  this.selectedInfo.episodeID === ""
                    ? this.selectedInfo.waitingEpisodeID
                    : this.selectedInfo.episodeID;
                patApi.ifHasTransOrder(episodeID).then((ret) => {
                  if (String(ret) === "0") {
                    this.showAbnormalMessage();
                  } else {
                    this.$message({
                      showClose: true,
                      message: ret,
                      type: "error",
                    });
                  }
                });
              } else {
                this.$message.error(userValidRet.result);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
        return true;
      });
    },
    transferDeptActionApply(action) {
      if (action === "confirm") {
        const episodeID = this.episodeID;
        const {
          loc,
          locLinkWard,
          transDeptDate,
          transDeptTime,
        } = this.transDeptForm;
        patApi
          .transLocApply(
            episodeID,
            loc,
            locLinkWard,
            transDeptDate,
            transDeptTime
          )
          .then((ret) => {
            if (ret.status.toString() === "0") {
              this.ifShow = false;
              this.requestQuery();
            } else {
              console.log(ret.status);
            }
          });
      }
    },
    showAbnormalMessageApply() {
      const episodeID = this.episodeID;
      patApi.transLocAbnormalOrder(episodeID).then((data) => {
        const h = this.$createElement;
        const abnormalOrders = [];
        let comment = {};
        for (let oi = 0; oi < data.length; oi += 1) {
          abnormalOrders[oi] = h("li", { style: "color: red" }, [
            h(
              "a",
              { style: "color: red", attrs: { href: "#test" } },
              `${data[oi].abnormalDesc}`
            ),
          ]);
        }
        let endComment = {};
        let ifShowConfirmButton = true;
        if (data.length > 0) {
          if (data[0].ifCanOper === "Y") {
            endComment = h("span", null, "确定继续操作?");
            ifShowConfirmButton = true;
          } else {
            endComment = h("span", null, "有未处理的医嘱,不允许转科!");
            ifShowConfirmButton = false;
          }
          comment = h("p", null, [
            // h("span", null, "该病人还有"),
            h("span", null, [abnormalOrders]),
            endComment,
          ]);
        } else {
          comment = h("span", null, "确认进行转科?");
        }
        this.$msgbox({
          title: "转科需关注医嘱",
          message: comment,
          type: "warning",
          showCancelButton: true,
          showConfirmButton: ifShowConfirmButton,
          callback: (action) => {
            this.transferDeptActionApply(action);
          },
        });
      });
    },
    submitDeptApplyForm(formName) {
      // const episodeID = this.episodeID;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userApi
            .userPassMatch(
              this.transDeptForm.userCode,
              this.transDeptForm.userPass
            )
            .then((userValidRet) => {
              if (String(userValidRet.result) === "0") {
                this.transferDeptActionApply("confirm");
              } else {
                this.$message.error(userValidRet.result);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
        return true;
      });
    },
    submitWardForm(transWardForm) {
      if (this.dialogBeds.length < 1) {
        this.$message({
          showClose: true,
          message: "所选择的转入病区无床位!",
          type: "warning",
        });
        return;
      }
      this.$refs[transWardForm].validate((valid) => {
        if (valid) {
          userApi
            .userPassMatch(
              this.transWardForm.userCode,
              this.transWardForm.userPass
            )
            .then((userValidRet) => {
              if (String(userValidRet.result) === "0") {
                const episodeID = this.episodeID;
                const { transWard, bed, tempLoc } = this.transWardForm;
                patApi
                  .transWard(episodeID, transWard, bed, tempLoc)
                  .then((ret) => {
                    if (ret.status.toString() === "0") {
                      this.ifShow = false;
                      this.requestQuery();
                    } else {
                      this.$message.error(ret.status.toString());
                    }
                  });
              } else {
                this.$message.error(userValidRet.result);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
        return true;
      });
    },
    // transferDeptBtn() {
    //   this.showAbnormalMessage();
    // },
    transferWardBtn() {
      const episodeID = this.episodeID;
      const wardID = this.dialogLocLinkWard;
      const bedID = this.dialogBed;
      const tempLoc = this.dialogTempLoc;
      patApi.transWard(episodeID, wardID, bedID, tempLoc).then((ret) => {
        if (ret.status.toString() === "0") {
          this.ifShow = false;
          this.requestQuery();
        } else {
          console.log(ret.status);
        }
      });
    },
    locLinkWardChange() {
      const episodeID = this.episodeID;
      const { loc, locLinkWard } = this.transDeptForm;
      patApi.ifHasTransOrder(episodeID, loc, locLinkWard).then((ret) => {
        if (String(ret) !== "0") {
          this.$message({
            showClose: true,
            message: ret,
            type: "error",
          });
          this.ifTransApplyButton = false;
        } else {
          this.ifTransApplyButton = true;
        }
      });
    },
    transDeptTimeSelectBlur(timeSelect) {
      const currTimeValue = timeSelect.$children[0].currentValue;
      if (utils.formatTime(currTimeValue) !== "") {
        this.transDeptForm.transDeptTime = currTimeValue;
      }
    },
    onTransDeptTimeChange(time) {
      this.transDeptForm.transDeptTime = time;
    },
  },
  components: {
    CommonButton,
    PatInfoBanner,
    StepsTransfer,
    YlSelect: Select,
    YlDatePicker: DatePicker,
  },
};
</script>

<style>
@import "../../assets/main.css";

@b dialogTransfer {
  & .el-dialog__body {
    padding: 3px;
    margin: 0px 15px 0px 15px;
    line-height: normal;
    overflow: hidden;
  }
  & .el-notification {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, 50%);
  }
  @e title {
    padding: 0 0 0 7px;
    font-size: var(--navFontSize);
    color: white;
  }
  @e sep {
    margin: 0 0.35em 0 0;
    font-weight: bolder;
    border-left: 4px solid #4f6787;
  }
  @e icon {
    color: white;
  }
  @e transferRecord {
    float: left;
    margin: 5px 5px 10px 0px;
    border-right: 1px #ccc solid;
    width: 400px;
    min-height: 466px;
    min-width: 260px;
    @m title {
      padding: 5px 0px 10px 0px;
      margin: 0px 5px 0px 0px;
      border-bottom: 1px #ccc solid;
      position: relative;
      color: #4f6787;
      font-size: 16px;
    }
    @m step {
      min-height: 440px;
      overflow-y: auto;
      max-height: 440px;
    }
  }

  @e transferOperate {
    float: right;
    margin: 5px 0px 0px 0px;
    width: 830px;
    @m title {
      padding: 5px 0px 10px 0px;
      margin: 0px 0px 0px 5px;
      border-bottom: 1px #ccc solid;
      width: 99%;
      color: #4f6787;
      font-size: 16px;
    }
    @m titleWord {
      border-left: 4px solid #4f6787;
      padding: 0px 0px 0px 5px;
      line-height: 16px;
      display: inline-block;
    }
  }
  @e transferDeptTitle {
    width: 110px;
    display: block;
    position: relative;
    top: 23px;
    left: 30px;
    text-align: center;
    background: white;
    border-radius: 8px;
    border-bottom: 1px solid var(--mainColor);
    opacity: 1;
  }
  @e transferDept {
    padding: 5px 30px;
    margin: 15px 10px 0px 5px;
    border: 1px solid var(--mainColor);
    opacity: 0.1;
    @when selected {
      opacity: 1;
    }
  }

  @e transferWardTitle {
    width: 110px;
    display: block;
    position: relative;
    top: 23px;
    left: 30px;
    text-align: center;
    background: white;
    border-radius: 8px;
    border-bottom: 1px solid var(--mainColor);
  }

  @e transferWard {
    padding: 5px 30px;
    margin: 15px 10px 10px 5px;
    border: 1px solid var(--mainColor);
    opacity: 0.1;
    @when selected {
      opacity: 1;
    }
  }
  @e datePicker {
    width: 200px !important;
  }
  @e timeSelect {
    width: 240px !important;
  }
}
::-ms-clear,
::-ms-reveal {
  display: none;
}
</style>

