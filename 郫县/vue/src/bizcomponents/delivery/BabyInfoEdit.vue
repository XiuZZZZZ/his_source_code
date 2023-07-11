<template>
  <div class="babyInfoEdit">
    <el-form
      status-icon
      ref="form"
      :rules="rules"
      :model="form"
      label-width="140px"
      class="babyInfoEdit__form"
    >
      <el-form-item label="婴儿序号" prop="orderNumber" key="babyInfoEditOrderNumber">
        <el-input class="babyInfoEdit__input" disabled v-model="form.orderNumber" align="right"></el-input>
      </el-form-item>
      <el-form-item label="分娩方式" prop="deliverMethod" key="babyInfoEditDeliverMethod">
        <yl-select
          v-model="form.deliverMethod"
          class="babyInfoEdit__select"
          @update:data="value=>deliverMethodTypes=value"
          filterable
          clearable
          multiple
          :multiple-limit="4"
          :runServerMethodStr="`${deliveryApi.className}:${deliveryApi.findDeliverMethod}`"
        >
          <el-option
            v-for="item in deliverMethodTypes"
            :key="item.desc"
            :label="item.desc"
            :value="item.ID"
          ></el-option>
        </yl-select>
      </el-form-item>
      <el-form-item label="结果" prop="outCome" key="babyInfoEditOutCome">
        <yl-select
          v-model="form.outCome"
          class="babyInfoEdit__select"
          @update:data="value=>outComTypes=value"
          filterable
          clearable
          :disabled="!!babyID"
          :runServerMethodStr="`${deliveryApi.className}:${deliveryApi.findOutCome}`"
        >
          <el-option
            v-for="item in outComTypes"
            :key="item.code"
            :label="item.desc"
            :value="item.code"
          ></el-option>
        </yl-select>
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="name"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        key="babyInfoName"
      >
        <el-input class="babyInfoEdit__input" v-model="form.name" align="right"></el-input>
      </el-form-item>
      <el-form-item
        label="姓名简拼"
        prop="name2"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        key="babyInfoEditOrderName2"
      >
        <el-input class="babyInfoEdit__input" v-model="form.name2" align="right"></el-input>
      </el-form-item>
      <el-form-item
        label="性别"
        prop="sex"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        key="babyInfoEditSex"
      >
        <yl-select
          v-model="form.sex"
          class="babyInfoEdit__select"
          @update:data="value=>sexTypes=value"
          filterable
          clearable
          :runServerMethodStr="`${patientApi.className}:${patientApi.findSex}`"
          ref="docSelect"
        >
          <el-option v-for="item in sexTypes" :key="item.desc" :label="item.desc" :value="item.ID"></el-option>
        </yl-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthDate" key="babyInfoEditBirthDate">
        <yl-date-picker
          v-model="form.birthDate"
          class="babyInfoEdit__datePicker"
          align="right"
          type="date"
          :editable="false"
          :picker-options="datePickerOptions"
        ></yl-date-picker>
      </el-form-item>
      <el-form-item label="出生时间" prop="birthTime" key="babyInfoEditBirthTime">
        <el-time-select
          v-model="form.birthTime"
          class="babyInfoEdit__timeSelect"
          :picker-options="timeOption"
        ></el-time-select>
      </el-form-item>
      <el-form-item
        label="体重g"
        prop="height"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        key="babyInfoHeight"
      >
        <el-input
          class="babyInfoEdit__input"
          v-model="form.height"
          align="right"
          placeholder="体重单位g"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="身长cm"
        prop="weight"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        key="babyInfoWeight"
      >
        <el-input
          class="babyInfoEdit__input"
          v-model="form.weight"
          align="right"
          placeholder="身长单位cm"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Apgar评分(1分钟)"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        prop="apgarOne"
        key="babyInfoEditApgarOne"
      >
        <el-popover placement="top" width="150">
          <el-form
            status-icon
            ref="formApgarOne"
            :model="form.apgarOne"
            :rules="apgarRule"
            label-width="70px"
            class="babyInfoEdit__apgarForm"
          >
            <el-form-item label="肌张力" prop="activity" key="apgarScoreOneActivity">
              <el-input class="babyInfoEdit__input" v-model="form.apgarOne.activity" align="right"></el-input>
            </el-form-item>
            <el-form-item label="呼吸" prop="respiration" key="apgarScoreOneRespiration">
              <el-input
                class="babyInfoEdit__input"
                v-model="form.apgarOne.respiration"
                align="right"
              ></el-input>
            </el-form-item>
            <el-form-item label="脉搏" prop="pulse" key="apgarScoreOnePulse">
              <el-input class="babyInfoEdit__input" v-model="form.apgarOne.pulse" align="right"></el-input>
            </el-form-item>
            <el-form-item label="反射" prop="grimace" key="apgarScoreOneGrimace">
              <el-input class="babyInfoEdit__input" v-model="form.apgarOne.grimace" align="right"></el-input>
            </el-form-item>
            <el-form-item label="肤色" prop="appearance" key="apgarScoreOneAppearance">
              <el-input
                class="babyInfoEdit__input"
                v-model="form.apgarOne.appearance"
                align="right"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-input
            class="babyInfoEdit__input"
            v-model="form.apgarOne.total"
            disabled
            slot="reference"
            align="right"
          ></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item
        label="Apgar评分(5分钟)"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        prop="apgarFive"
        key="babyInfoEditApgarFive"
      >
        <el-popover placement="top" width="150">
          <el-form
            status-icon
            ref="formApgarFive"
            :model="form.apgarFive"
            :rules="apgarRule"
            label-width="70px"
            class="babyInfoEdit__apgarForm"
          >
            <el-form-item label="肌张力" prop="activity" key="apgarScoreFiveActivity">
              <el-input class="babyInfoEdit__input" v-model="form.apgarFive.activity" align="right"></el-input>
            </el-form-item>
            <el-form-item label="呼吸" prop="respiration" key="apgarScoreFiveRespiration">
              <el-input
                class="babyInfoEdit__input"
                v-model="form.apgarFive.respiration"
                align="right"
              ></el-input>
            </el-form-item>
            <el-form-item label="脉搏" prop="pulse" key="apgarScoreFivePulse">
              <el-input class="babyInfoEdit__input" v-model="form.apgarFive.pulse" align="right"></el-input>
            </el-form-item>
            <el-form-item label="反射" prop="grimace" key="apgarScoreFiveGrimace">
              <el-input class="babyInfoEdit__input" v-model="form.apgarFive.grimace" align="right"></el-input>
            </el-form-item>
            <el-form-item label="肤色" prop="appearance" key="apgarScoreFiveAppearance">
              <el-input
                class="babyInfoEdit__input"
                v-model="form.apgarFive.appearance"
                align="right"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-input
            class="babyInfoEdit__input"
            v-model="form.apgarFive.total"
            slot="reference"
            disabled
            align="right"
          ></el-input>
        </el-popover>
      </el-form-item>
      <el-form-item
        label="Apgar评分"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        prop="apgarMiniuteOtherOne"
        key="apgarMiniuteOtherOne"
      >
        <el-col :span="7">
          <el-input
            class="babyInfoEdit__miniInput"
            v-model="form.apgarMiniuteOtherOne"
            align="right"
          ></el-input>
        </el-col>
        <el-col :span="4">分钟</el-col>
        <el-col :span="7">
          <el-form-item prop="apgarOtherOne" key="babyInfoEditApgarOtherOne">
            <el-popover placement="top" width="150">
              <el-form
                status-icon
                ref="formApgarOtherOne"
                :model="form.apgarOtherOne"
                :rules="apgarRule"
                label-width="70px"
                class="babyInfoEdit__apgarForm"
              >
                <el-form-item label="肌张力" prop="activity" key="apgarScoreOtherOneActivity">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherOne.activity"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="呼吸" prop="respiration" key="apgarScoreOtherOneRespiration">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherOne.respiration"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="脉搏" prop="pulse" key="apgarScoreOtherOnePulse">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherOne.pulse"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="反射" prop="grimace" key="apgarScoreOtherOneGrimace">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherOne.grimace"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="肤色" prop="appearance" key="apgarScoreOtherOneAppearance">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherOne.appearance"
                    align="right"
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-input
                class="babyInfoEdit__miniInput"
                v-model="form.apgarOtherOne.total"
                disabled
                slot="reference"
                align="right"
              ></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="Apgar评分"
        v-if="form.outCome!='D'&&form.outCome!='MC'&&form.outCome!=''"
        prop="apgarMiniuteOtherTwo"
        key="apgarMiniuteOtherTwo"
      >
        <el-col :span="7">
          <el-input
            class="babyInfoEdit__miniInput"
            v-model="form.apgarMiniuteOtherTwo"
            align="right"
          ></el-input>
        </el-col>
        <el-col :span="4">分钟</el-col>
        <el-col :span="7">
          <el-form-item prop="apgarOtherTwo" key="babyInfoEditApgarOtherTwo">
            <el-popover placement="top" width="150">
              <el-form
                status-icon
                ref="formApgarOtherTwo"
                :model="form.apgarOtherTwo"
                :rules="apgarRule"
                label-width="70px"
                class="babyInfoEdit__apgarForm"
              >
                <el-form-item label="肌张力" prop="activity" key="apgarScoreOtherTwoActivity">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherTwo.activity"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="呼吸" prop="respiration" key="apgarScoreOtherTwoRespiration">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherTwo.respiration"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="脉搏" prop="pulse" key="apgarScoreOtherTwoPulse">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherTwo.pulse"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="反射" prop="grimace" key="apgarScoreOtherTwoGrimace">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherTwo.grimace"
                    align="right"
                  ></el-input>
                </el-form-item>
                <el-form-item label="肤色" prop="appearance" key="apgarScoreOtherTwoAppearance">
                  <el-input
                    class="babyInfoEdit__input"
                    v-model="form.apgarOtherTwo.appearance"
                    align="right"
                  ></el-input>
                </el-form-item>
              </el-form>

              <el-input
                class="babyInfoEdit__miniInput"
                v-model="form.apgarOtherTwo.total"
                slot="reference"
                disabled
                align="right"
              ></el-input>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <common-button
          backgroundColor="rgb(64, 162, 222)"
          color="#fff"
          @click="onSubmitBtnClick('form')"
        >保存</common-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CommonButton from "../../components/CommonButton";
import Select from "../../components/Select";
import patientApi from "../../store/api/patient";
import deliveryApi from "../../store/api/delivery";
import utils from "../../comm/utils";
import DatePicker from "../../components/DatePicker";
import pinyinUtil from "../../comm/pinyinUtil";

export default {
  name: "babyInfoEdit",
  props: ["motherEpisodeID", "babyID"],
  data() {
    const validatorBirthDate = birthTime => (rule, value, callback) => {
      const error = [];
      if (!utils.formatDate(value)) {
        error.push("日期格式不对!");
      }
      if (this.form[birthTime] !== "") {
        this.$refs.form.validateField(birthTime);
      }
      callback(error);
    };
    const validatorBirthTime = (rule, value, callback) => {
      const error = [];
      if (this.form.birthDate && this.form.birthDate !== "") {
        const today = utils.formatDate(this.form.birthDate);
        const time = `${today.replace(/-/g, "/")} ${value}`;
        const dateTime = new Date(time);
        if (dateTime > new Date()) {
          error.push("出生时间大于当前时间!");
        }
        if (!utils.formatTime(value)) {
          error.push("时间格式不对!");
        }
      } else {
        callback();
      }
      callback(error);
    };
    const scoreRule = [
      {
        validator: (rule, value, callback) => {
          const error = [];
          if (isNaN(value)) {
            error.push("请输入数字!");
            callback(error);
          } else if (String(value).indexOf(".") > -1) {
            error.push("不能输入小数!");
            callback(error);
          } else if (value > 2 || value < 0) {
            error.push("请输入0到1之间的数字!");
            callback(error);
          }
          callback();
        },
        trigger: "change"
      }
    ];
    const apgarRule = {
      activity: scoreRule,
      respiration: scoreRule,
      pulse: scoreRule,
      grimace: scoreRule,
      appearance: scoreRule
    };
    const that = this;
    const createApgarScoreRule = function(key, formName) {
      return [
        {
          validator: (rule, value, callback) => {
            const error = [];
            that.$refs[formName].validate(valid => {
              if (valid) {
                that.form[key].total =
                  parseInt(that.form[key].activity, 10) +
                  parseInt(that.form[key].respiration, 10) +
                  parseInt(that.form[key].pulse, 10) +
                  parseInt(that.form[key].grimace, 10) +
                  parseInt(that.form[key].appearance, 10);
                callback();
              } else {
                error.push("分数输入错误!");
                callback(error);
              }
            });
          }
        }
      ];
    };
    const rules = {
      deliverMethod: [
        {
          type: "array",
          required: true,
          message: "请选择分娩方式!",
          trigger: "change"
        }
      ],
      outCome: [
        {
          type: "string",
          required: true,
          message: "请选择分娩结果!",
          trigger: "change"
        }
      ],
      name: [
        {
          type: "string",
          required: true,
          message: "请输入婴儿姓名!",
          trigger: "blur"
        }
      ],
      name2: [
        {
          type: "string",
          required: true,
          message: "请输入婴儿姓名简拼!",
          trigger: "blur"
        }
      ],
      sex: [
        {
          type: "number",
          required: true,
          message: "请选择婴儿性别!",
          trigger: "change"
        }
      ],
      birthDate: [
        {
          required: true,
          validator: validatorBirthDate("birthTime"),
          trigger: "change"
        }
      ],
      birthTime: [
        {
          required: true,
          validator: validatorBirthTime,
          trigger: "change"
        }
      ],
      apgarMiniuteOtherOne: [
        {
          validator: (rule, value, callback) => {
            const error = [];
            if (isNaN(value)) {
              error.push("请输入数字!");
              callback(error);
            }
            callback();
          },
          trigger: "change"
        }
      ],
      apgarMiniuteOtherTwo: [
        {
          validator: (rule, value, callback) => {
            const error = [];
            if (isNaN(value)) {
              error.push("请输入数字!");
              callback(error);
            }
            callback();
          },
          trigger: "change"
        }
      ],
      apgarOne: createApgarScoreRule("apgarOne", "formApgarOne"),
      apgarFive: createApgarScoreRule("apgarFive", "formApgarFive"),
      apgarOtherOne: createApgarScoreRule("apgarOtherOne", "formApgarOtherOne"),
      apgarOtherTwo: createApgarScoreRule("apgarOtherTwo", "formApgarOtherTwo")
    };

    const emptyApgar = {
      total: 0,
      activity: 0,
      respiration: 0,
      pulse: 0,
      grimace: 0,
      appearance: 0
    };
    return {
      deliveryApi,
      form: {
        orderNumber: "",
        name: "",
        name2: "",
        sex: "",
        birthDate: "",
        birthTime: "",
        outCome: "",
        deliverMethod: [],
        apgarOne: Object.assign({}, emptyApgar),
        apgarFive: Object.assign({}, emptyApgar),
        apgarOtherOne: Object.assign({}, emptyApgar),
        apgarOtherTwo: Object.assign({}, emptyApgar),
        apgarMiniuteOtherOne: "",
        apgarMiniuteOtherTwo: "",
        height: "",
        weight: ""
      },
      apgarRule,
      sexTypes: [],
      deliverMethodTypes: [],
      outComTypes: [],
      patientApi,
      rules,
      timeOption: {
        start: "00:00",
        step: "01:00",
        end: "23:00"
      },
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  components: {
    CommonButton,
    YlDatePicker: DatePicker,
    YlSelect: Select
  },
  created() {
    this.init();
  },
  watch: {
    babyID(value) {
      if (value) {
        this.init();
      } else {
        this.clear();
      }
    },
    "form.name": function() {
      this.form.name2 = pinyinUtil.getFirstLetter(this.form.name).toUpperCase();
    },
    "form.apgarOne": {
      handler(newValue, oldValue) {
        newValue.total =
          parseInt(newValue.activity, 10) +
          parseInt(newValue.respiration, 10) +
          parseInt(newValue.pulse, 10) +
          parseInt(newValue.grimace, 10) +
          parseInt(newValue.appearance, 10);
        console.log(oldValue);
      },
      deep: true
    },
    "form.apgarFive": {
      handler(newValue, oldValue) {
        newValue.total =
          parseInt(newValue.activity, 10) +
          parseInt(newValue.respiration, 10) +
          parseInt(newValue.pulse, 10) +
          parseInt(newValue.grimace, 10) +
          parseInt(newValue.appearance, 10);
        console.log(oldValue);
      },
      deep: true
    },
    "form.apgarOtherOne": {
      handler(newValue, oldValue) {
        newValue.total =
          parseInt(newValue.activity, 10) +
          parseInt(newValue.respiration, 10) +
          parseInt(newValue.pulse, 10) +
          parseInt(newValue.grimace, 10) +
          parseInt(newValue.appearance, 10);
        console.log(oldValue);
      },
      deep: true
    },
    "form.apgarOtherTwo": {
      handler(newValue, oldValue) {
        newValue.total =
          parseInt(newValue.activity, 10) +
          parseInt(newValue.respiration, 10) +
          parseInt(newValue.pulse, 10) +
          parseInt(newValue.grimace, 10) +
          parseInt(newValue.appearance, 10);
        console.log(oldValue);
      },
      deep: true
    }
  },
  methods: {
    init() {
      // this.clear();
      return deliveryApi
        .getBabyDeliveryInfo(this.motherEpisodeID, this.babyID)
        .then(babyInfo => {
          this.form = babyInfo;
        });
    },
    clear() {
      if (this.$refs && this.$refs.form && this.$refs.form.resetFields) {
        this.$refs.form.resetFields();
      }
      const emptyApgar = {
        total: 0,
        activity: 0,
        respiration: 0,
        pulse: 0,
        grimace: 0,
        appearance: 0
      };
      this.form.apgarOne = Object.assign({}, emptyApgar);
      this.form.apgarFive = Object.assign({}, emptyApgar);
      this.form.apgarOtherOne = Object.assign({}, emptyApgar);
      this.form.apgarOtherTwo = Object.assign({}, emptyApgar);
    },
    onSubmitBtnClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const loadingInstance = this.$loading({
            target: "body",
            text: "保存数据中..."
          });
          const {
            orderNumber,
            name,
            name2,
            sex,
            birthDate,
            birthTime,
            outCome,
            deliverMethod,
            apgarOne,
            apgarFive,
            apgarOtherOne,
            apgarOtherTwo,
            apgarMiniuteOtherOne,
            apgarMiniuteOtherTwo,
            height,
            weight
          } = this.form;
          deliveryApi
            .saveBabyDeliveryInfo(
              this.motherEpisodeID,
              this.babyID,
              orderNumber,
              name,
              name2,
              sex,
              birthDate,
              birthTime,
              outCome,
              deliverMethod.join("^"),
              JSON.stringify({
                apgarOne,
                apgarFive,
                apgarOtherOne,
                apgarOtherTwo,
                apgarMiniuteOtherOne,
                apgarMiniuteOtherTwo
              }),
              height,
              weight
            )
            .then(ret => {
              loadingInstance.close();
              const successMsg = this.babyID
                ? "新生儿信息修改成功!"
                : "分娩新生儿成功!";
              const failMsg = this.babyID
                ? `修改新生儿信息失败:${ret}`
                : `分娩新生儿失败:${ret}`;
              if (ret === 0) {
                this.$message.success(successMsg);
                this.$emit("saved");
              } else {
                this.$message({
                  message: failMsg,
                  duration: 0,
                  showClose: true,
                  type: "error"
                });
              }
            });
        }
      });
    },
    birthTimeSelectBlur(timeSelect) {
      const currTimeValue = timeSelect.$children[0].currentValue;
      this.form.birthTime = currTimeValue;
    }
  }
};
</script>
<style>
@import "../../assets/main.css";
@b babyInfoEdit {
  margin: 0 auto;
  @e select {
    width: 150px;
  }
  @e input {
    width: 150px;
  }
  @e miniInput {
    width: 55px;
  }
  @e datePicker {
    width: 150px !important;
  }
  @e timeSelect {
    width: 150px !important;
  }
  & .el-form-item {
    margin-bottom: 10px;
  }
  & .el-form-item__error {
    padding-top: 0;
  }
  @e apgarForm {
    & .el-form-item__error {
      padding-top: 0;
    }
    & .babyInfoEdit__input {
      width: 50px;
    }
  }
  @e form {
    max-height: 500px;
  }
}
</style>
