<template>
  <div class="OrderSign">
    <el-form
      status-icon
      ref="form"
      size="small"
      :rules="rules"
      :model="form"
      label-width="120px"
      class="OrderSign-form"
    >
      <el-row :gutter="20">
        <el-col
          :span="12"
          v-if="ifPPDOrder && triggerButton.jsFunction === 'setSkinTest'"
          class="OrderSign__ppdResult"
        >
          <el-form-item label="皮肤硬结">
            <el-input
              v-model="form.induration.width"
              style="width: 90px"
              key="formIndurationWidth"
            ></el-input>
            <span>mm&nbsp;</span>
            <el-input
              v-model="form.induration.height"
              style="width: 90px"
              key="formIndurationHeight"
            ></el-input>
            <span>mm</span>
          </el-form-item>
          <el-form-item label="局部水泡">
            <el-input
              v-model="form.blister.width"
              style="width: 90px"
              key="formBlisterWidth"
            ></el-input>
            <span>mm&nbsp;</span>
            <el-input
              v-model="form.blister.height"
              style="width: 90px"
              key="formBlisterHeight"
            ></el-input>
            <span>mm</span>
          </el-form-item>
          <el-form-item label>
            <el-radio-group v-model="form.blisterState">
              <el-radio label="单个" style="width: 85px"></el-radio>
              <el-radio label="散在" style="width: 85px"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="红肿">
            <el-input
              v-model="form.redSwollen.width"
              style="width: 90px"
              key="formredSwollenWidth"
            ></el-input>
            <span>mm&nbsp;</span>
            <el-input
              v-model="form.redSwollen.height"
              style="width: 90px"
              key="formredSwollenHeight"
            ></el-input>
            <span>mm</span>
          </el-form-item>
          <el-form-item label>
            <el-checkbox-group v-model="form.deadLymphatic">
              <el-checkbox
                label="坏死"
                name="deadLymphatic"
                style="width: 105px"
              ></el-checkbox>
              <el-checkbox
                label="淋巴管炎"
                name="deadLymphatic"
                style="width: 85px"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="PPD实验结果">
            <el-input
              v-model="form.PPDResult"
              style="width: 220px"
              key="formPPDResult"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="OrderSign__sign">
          <el-form-item
            label="皮试结果"
            v-if="ifSkinTest()"
            prop="skinTestResult"
            key="formSkinTestResult"
          >
            <el-radio-group
              :disabled="ifPPDOrder"
              v-model="form.skinTestResult"
              style="width: 220px"
            >
              <el-radio border label="阴性" style="width: 105px"></el-radio>
              <el-radio border label="阳性" style="width: 105px"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="类型"
            prop="seeType"
            v-if="triggerButton.desc === '处理医嘱'"
            key="formSeeType"
          >
            <el-select v-model="form.seeType" style="width: 220px">
              <el-option
                v-for="item in seeTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="date" key="formDate">
            <yl-date-picker
              class="OrderSign__datePicker"
              v-model="form.date"
              align="right"
              type="date"
              :picker-options="pickerEndDateRange"
            ></yl-date-picker>
          </el-form-item>
          <el-form-item label="时间" prop="time" key="formTime">
            <el-time-select
              :picker-options="{ start: '01:00', step: '01:00', end: '23:00' }"
              v-model="form.time"
              ref="timeSelect"
            ></el-time-select>
            <!--el-time-select class="orderExcute__timeSelect"
                        v-model="form.time"
                        :value="form.time"
                        @input="onTimeChange"
                        @blur="timeSelectBlur"
                        :picker-options="{ start: '01:00',step: '01:00',end: '23:00'}">
            </el-time-select-->
          </el-form-item>
          <el-form-item
            label="备注"
            prop="notes"
            v-if="triggerButton.desc !== '皮试结果'"
            key="formNotes"
          >
            <!--v-if="(!triggerButton.ifDBSign)&&triggerButton.desc&&String(triggerButton.desc).indexOf('皮试')<0"> < !ifSkinTest()v-if="triggerButton.desc!=='皮试结果'"> -->
            <el-input
              v-model="form.notes"
              :maxlength="50"
              style="width: 220px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="批号"
            prop="number"
            v-if="triggerButton.desc === '皮试结果'"
            key="formNumber"
          >
            <el-input
              v-model="form.number"
              style="width: 220px"
              @keyup.enter.native="keyup('number')"
            ></el-input>
          </el-form-item>
          <template v-if="false">
            <el-form-item label="证书">
              <el-select
                v-model="form.Certificate"
                style="width: 220px"
                key="formCertificate"
              >
                <el-option
                  v-for="item in getCertificate"
                  :key="item.userID"
                  :value="item.userID"
                  :label="item.userName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证书口令" prop="passwordCert">
              <el-input
                v-model="form.passwordCert"
                type="password"
                style="width: 220px"
                key="formPasswordCert"
              ></el-input>
            </el-form-item>
          </template>
          <el-form-item
            label="工号"
            prop="userCode"
            v-if="triggerButton.ifSign || triggerButton.ifDBSign"
          >
            <el-input
              v-model="form.userCode"
              placeholder="请输入工号"
              style="width: 220px"
              @keyup.enter.native="keyup('userCode')"
              ref="formUserCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            v-if="triggerButton.ifSign || triggerButton.ifDBSign"
            key="formPassword"
          >
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              style="width: 220px"
              @keyup.enter.native="keyup('password')"
              ref="formPassword"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="工号"
            prop="userCodeSecond"
            v-if="triggerButton.ifDBSign"
            key="formUserCodeSecond"
          >
            <el-input
              v-model="form.userCodeSecond"
              placeholder="请输入工号"
              style="width: 220px"
              @keyup.enter.native="keyup('userCodeSecond')"
              ref="formUserCodeSecond"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="passwordSecond"
            v-if="triggerButton.ifDBSign"
            key="formPasswordSecond"
          >
            <el-input
              v-model="form.passwordSecond"
              type="password"
              placeholder="请输入密码"
              style="width: 220px"
              @keyup.enter.native="keyup('passwordSecond')"
              ref="formPasswordSecond"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24" :offset="orderSignOffset()">
          <el-form-item>
            <common-button @click="onSubmitBtnClick('form')"
              >确认</common-button
            >
            <common-button @click="onCloseBtnClick">取消</common-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import session from "../../store/api/session";
import CommonButton from "../../components/CommonButton";
import DatePicker from "../../components/DatePicker";
import datetTimeFormat from "../../comm/utils";
import userInfo from "../../store/api/userInfo";
import orderHandleApi from "../../store/api/orderHandle";
import { postServerMethod } from "../../store/api/runServerMethod";

export default {
  name: "OrderSign",
  props: {
    triggerButton: {
      required: true,
      type: Object,
    },
    func: Function,
    orders: Array,
    ifPPDOrder: Boolean,
    ifShow: Boolean,
  },
  data() {
    const form = {
      induration: {
        width: "",
        height: "",
      },
      blister: {
        width: "",
        height: "",
      },
      redSwollen: {
        width: "",
        height: "",
      },
      date: new Date(),
      time: "",
    };
    const userID = {};
    const validatorUserCodeFactory = (passwordName) => (
      rule,
      value,
      callback
    ) => {
      if (this.form[passwordName] !== "") {
        this.$refs.form.validateField(passwordName);
      }
      callback();
    };
    const validateUserCodeSecond = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名!"));
      }
      if (value === this.form.userCode) {
        callback(new Error("输入的用户与之前用户相同!"));
      }
      callback();
    };

    const validatorPasswordFactory = (codeName, userIDName) => (
      rule,
      value,
      callback
    ) => {
      userInfo.passwordConfirm(this.form[codeName], value).then((result) => {
        if (String(result.result) !== "0") {
          callback([result.result]);
        } else {
          this.userID[userIDName] = result.userID;
          callback();
        }
      });
    };
    const validatorPasswordCert = (rule, value, callback) => {
      const certificate = this.form.Certificate;
      if (value === "") {
        callback(new Error("请输入证书口令!"));
      } else {
        const callCheckUser = (object) => {
          if (object.checkUser && typeof object.checkUser === "function") {
            const ifCheckUser = object.checkUser(certificate, value);
            if (ifCheckUser === "0") {
              if (
                object.caInitData &&
                typeof object.caInitData === "function"
              ) {
                object.caInitData(postServerMethod).then((CAInit) => {
                  object
                    .matchLoginUserCert(
                      CAInit,
                      postServerMethod,
                      certificate,
                      session
                    )
                    .then((retMatch) => {
                      if (retMatch !== "") {
                        callback(new Error(retMatch));
                      }
                      callback();
                    });
                });
              } else {
                callback(new Error(ifCheckUser));
              }
            }
          } else {
            this.$message.error("NurseCA.js缺少checkUser函数");
          }
        };
        datetTimeFormat.createJS("NurseCA", callCheckUser);
      }
    };
    const validatorTime = (rule, value, callback) => {
      const error = [];
      const timeValue = this.getFormatData(value);
      const time = datetTimeFormat.formatTime(timeValue);
      if (!time) {
        error.push("请选择正确的时间!");
      } else {
        this.onTimeChange(time);
      }
      callback(error);
    };
    return {
      seeTypeOptions: [
        { value: "A", label: "接受" },
        { value: "R", label: "拒绝" },
        { value: "F", label: "完成" },
      ],
      getCertificate: [],
      userID,
      form,
      rules: {
        date(rule, value, callback) {
          const error = [];
          const date = datetTimeFormat.formatDate(value);
          if (!date) {
            error.push("请选择正确的日期!");
          }
          callback(error);
        },
        time: [
          {
            type: "string",
            required: true,
            message: "请输入正确的时间",
            validator: validatorTime,
          },
        ],
        userCode: [
          {
            type: "string",
            required: true,
            message: "请输入工号",
            trigger: "blur",
          },
          {
            validator: validatorUserCodeFactory("password"),
            trigger: "change",
          },
        ],
        userCodeSecond: [
          {
            type: "string",
            required: true,
            trigger: "blur",
            validator: validateUserCodeSecond,
          },
          {
            validator: validatorUserCodeFactory("passwordSecond"),
            trigger: "change",
          },
        ],
        password: [
          {
            type: "string",
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator: validatorPasswordFactory("userCode", "userID"),
            trigger: "blur",
          },
        ],
        passwordSecond: [
          {
            type: "string",
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator: validatorPasswordFactory(
              "userCodeSecond",
              "userIDSecond"
            ),
            trigger: "blur",
          },
        ],
        skinTestResult: [
          {
            required: true,
            message: "请选择皮试结果",
            trigger: "blur",
          },
        ],
        seeType: [
          {
            required: true,
            message: "请选择处理类型",
            trigger: "blur",
          },
        ],
        passwordCert: [
          {
            required: true,
            trigger: "blur",
            validator: validatorPasswordCert,
          },
        ],
      },
      pickerEndDateRange: {
        disabledDate: (date) => {
          const startDate = datetTimeFormat.formatDate(new Date());
          return datetTimeFormat.compareDate(date, startDate);
        },
      },
    };
  },
  components: {
    CommonButton,
    YlDatePicker: DatePicker,
  },
  watch: {
    "form.induration.width": function () {
      this.caculate();
    },
    "form.induration.height": function () {
      this.caculate();
    },
    "form.blister.width": function () {
      this.caculate();
    },
    "form.blister.height": function () {
      this.caculate();
    },
    "form.redSwollen.width": function () {
      this.caculate();
    },
    "form.redSwollen.height": function () {
      this.caculate();
    },
    "form.deadLymphatic": function () {
      this.caculate();
    },
    ifShow(val) {
      if (val && this.triggerButton.desc === "皮试结果") {
        this.getSkinTestResult();
      }
      this.init();
      /* if (val) {
        this.getNuserCAList();
      } */
    },
  },
  created() {
    this.init();
  },
  mounted() {
    if (this.triggerButton.desc === "皮试结果") {
      this.getSkinTestResult();
    }
    // this.getNuserCAList();
  },
  methods: {
    getFormatData(valueTime) {
      if (
        valueTime != null &&
        typeof valueTime === "string" &&
        valueTime.indexOf(":") === -1 &&
        valueTime.length === 4
      ) {
        const minutes = valueTime.substring(0, 2);
        const sconds = valueTime.substring(2, 4);
        return `${minutes}:${sconds}`;
      }
      return valueTime;
    },
    init() {
      const that = this;
      datetTimeFormat.getCurrentDateTime().then((dateTime) => {
        that.form = {
          seeType: "A",
          date: dateTime.date,
          time: dateTime.time,
          notes: "",
          number: "",
          userCode: "",
          password: "",
          userCodeSecond: "",
          passwordSecond: "",
          Certificate: "", // 102000004733814/6002201412016948
          passwordCert: "",
          induration: {
            width: "",
            height: "",
          },
          blister: {
            width: "",
            height: "",
          },
          redSwollen: {
            width: "",
            height: "",
          },
          blisterState: "",
          deadLymphatic: [],
          PPDResult: "",
          skinTestResult: "",
        };
        this.userID = {
          userID: "",
          userIDSecond: "",
        };
        if (this.$refs && this.$refs.form && this.$refs.form.resetFields) {
          this.$refs.form.resetFields();
        }
      });
    },
    ifSkinTest() {
      const btnDesc = this.triggerButton.desc;
      if (btnDesc.indexOf("皮试") > -1) {
        return true;
      }
      return false;
    },
    getSkinTestResult() {
      if (this.ifSkinTest()) {
        const execID = this.orders[0].execInfos[0].ID;
        orderHandleApi
          .runServerMethodFactory("getSkinTestResult", execID)
          .then((testResult) => {
            this.form.skinTestResult = testResult.skinTest;
            this.form.number = testResult.skinTestBatch;
            // this.form.userCode = testResult.testUserCode;
            // this.form.userCodeSecond = testResult.auditUserCode;
            if (this.ifPPDOrder) {
              this.form.PPDResult = testResult.PPDResult.PPDResult;
              this.form.induration.width = testResult.PPDResult.TestSkinSityOne;
              this.form.induration.height =
                testResult.PPDResult.TestSkinSityTwo;
              this.form.blister.width = testResult.PPDResult.TestSkinVclOne;
              this.form.blister.height = testResult.PPDResult.TestSkinVclTwo;
              this.form.redSwollen.width = testResult.PPDResult.TestSkinSwoOne;
              this.form.redSwollen.height = testResult.PPDResult.TestSkinSwoTwo;
              if (String(testResult.PPDResult.TestSkinSing) === "1") {
                this.form.blisterState = "单个";
              }
              if (String(testResult.PPDResult.TestSkinSpora) === "1") {
                this.form.blisterState = "散在";
              }
              if (String(testResult.PPDResult.TestSkinNecrosis) === "1") {
                this.form.deadLymphatic.push("坏死");
              }
              if (String(testResult.PPDResult.TestSkinInflam) === "1") {
                this.form.deadLymphatic.push("淋巴管炎");
              }
            }
            console.log(testResult);
          });
      }
    },
    orderSignOffset() {
      // const btnDesc = this.triggerButton.desc;
      if (this.ifPPDOrder) {
        // btnDesc.indexOf('皮试') > -1
        return 6;
      }
      return 0;
    },
    caculate() {
      debugger;
      const deadLymphaticLength = this.form.deadLymphatic.length;
      const redSwollenHeight = this.form.redSwollen.height;
      const redSwollenWidth = this.form.redSwollen.width;
      const blisterHeight = this.form.blister.height;
      const blisterWidth = this.form.blister.width;
      const indurationHeight = this.form.induration.height;
      const indurationWidth = this.form.induration.width;
      if (
        deadLymphaticLength > 0 ||
        redSwollenHeight > 0 ||
        redSwollenWidth > 0 ||
        blisterHeight > 0 ||
        blisterWidth > 0
      ) {
        this.form.PPDResult = "++++";
        this.form.skinTestResult = "阳性";
      } else if (
        (indurationHeight < 5 && indurationHeight > 0) ||
        (indurationWidth < 5 && indurationWidth > 0)
      ) {
        this.form.PPDResult = "-";
        this.form.skinTestResult = "阴性";
      } else if (
        (indurationHeight >= 5 && indurationHeight <= 9) ||
        (indurationWidth >= 5 && indurationWidth <= 9)
      ) {
        this.form.PPDResult = "+";
        this.form.skinTestResult = "阳性";
      } else if (
        (indurationHeight > 9 && indurationHeight <= 19) ||
        (indurationWidth > 9 && indurationWidth <= 19)
      ) {
        this.form.PPDResult = "++";
        this.form.skinTestResult = "阳性";
      } else if (indurationHeight > 19 || indurationWidth > 19) {
        this.form.PPDResult = "+++";
        this.form.skinTestResult = "阳性";
      } else if (
        indurationHeight === "0" &&
        indurationWidth === "0" &&
        blisterHeight === "0" &&
        blisterWidth === "0"
      ) {
        this.form.PPDResult = "-";
        this.form.skinTestResult = "阴性";
      } else {
        this.form.PPDResult = "";
        this.form.skinTestResult = "";
        this.form.blisterState = "";
      }
      //覆盖条件，如果红肿0-4mm，则阴性。
      if (
        redSwollenWidth !== "" &&
        redSwollenHeight !== "" &&
        redSwollenWidth >= 0 &&
        redSwollenHeight <= 4
      ) {
        this.form.skinTestResult = "阴性";
        this.form.PPDResult = "";
      }
    },
    onTimeChange(time) {
      this.time = time;
      this.form.time = time;
    },
    timeSelectBlur(timeSelect) {
      this.form.time = timeSelect.$children[0].currentValue;
    },
    onCloseBtnClick() {
      this.$emit("close");
    },
    onSubmitBtnClick(formName) {
      const that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.func && typeof that.func === "function") {
            /* const loadingInstance = this.$loading({
              fullscreen: true,
              text: '后台处理中...',
            });*/
            // setTimeout(() => {
            const info = {
              userID1: that.userID.userID || session.USER.USERID,
              userID2: that.userID.userIDSecond,
              date: datetTimeFormat.formatDate(that.form.date),
              time: datetTimeFormat.formatTime(that.form.time),
              notes: that.form.notes,
              number: that.form.number,
              skinTestResult: that.form.skinTestResult,
              ifPPDOrder: that.ifPPDOrder,
              PPD: {
                PPDResult: that.form.PPDResult,
                indurationWidth: that.form.induration.width,
                indurationHeight: that.form.induration.height,
                blisterWidth: that.form.blister.width,
                blisterHeight: that.form.blister.height,
                redSwollenWidth: that.form.redSwollen.width,
                redSwollenHeight: that.form.redSwollen.height,
                blisterState: that.form.blisterState,
                deadLymphatic: that.form.deadLymphatic,
              },
              type: that.form.seeType,
            };
            that.func(info);
            that.$emit("close");
            // }, 100);
          }
        } else {
          return false;
        }
        return true;
      });
    },
    getNuserCAList() {
      const that = this;
      const callBack = (object) => {
        let func;
        if (object.nurUserList) {
          func = object.nurUserList;
        } else {
          this.$message.error("NurseCA.js缺少nurUserList函数");
          return;
        }
        if (func && typeof func === "function") {
          that.getCertificate = func();
          if (that.getCertificate.length > 0) {
            that.form.Certificate = that.getCertificate[0].userID;
          }
        }
      };
      datetTimeFormat.createJS("NurseCA", callBack);
    },
    keyup(val) {
      switch (val) {
        case "number":
          this.$refs.formUserCode.focus();
          break;
        case "userCode":
          this.$refs.formPassword.focus();
          break;
        case "password":
          this.$refs.formUserCodeSecond.focus();
          break;
        case "userCodeSecond":
          this.$refs.formPasswordSecond.focus();
          break;
        case "passwordSecond":
          break;
        default:
          this.$refs.formNumber.focus();
          break;
      }
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b OrderSign {
  & .el-form-item__error {
    width: 200px;
  }
}
</style>
