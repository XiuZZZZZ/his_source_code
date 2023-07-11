<template>
  <div class="babyInfoUpdate">
    <el-form status-icon
             ref="form"
             :rules="rules"
             :model="form"
             label-width="140px"
             class="babyInfoUpdate__form">
      <el-form-item label="婴儿序号"
                    prop="orderNumber"
                    key="babyInfoUpdateOrderNumber">
        <el-input class="babyInfoUpdate__input"
                  disabled
                  v-model="form.orderNumber"
                  align="right">
        </el-input>
      </el-form-item>
      <el-form-item label="姓名"
                    prop="name"
                    key="babyInfoName">
        <el-input class="babyInfoUpdate__input"
                  v-model="form.name"
                  align="right">
        </el-input>
      </el-form-item>
      <el-form-item label="姓名简拼"
                    prop="name2"
                    key="babyInfoUpdateOrderName2">
        <el-input class="babyInfoUpdate__input"
                  v-model="form.name2"
                  align="right">
        </el-input>
      </el-form-item>
      <el-form-item label="性别"
                    prop="sex"
                    key="babyInfoUpdateSex">
        <yl-select v-model="form.sex"
                   class="babyInfoUpdate__select"
                   @update:data="value=>sexTypes=value"
                   filterable
                   clearable
                   :runServerMethodStr="`${patientApi.className}:${patientApi.findSex}`"
                   ref="docSelect">
          <el-option v-for="item in sexTypes"
                     :key="item.desc"
                     :label="item.desc"
                     :value="item.ID"></el-option>
        </yl-select>
      </el-form-item>
      <el-form-item label="出生日期"
                    :required="true"
                    prop="birthDate"
                    key="babyInfoUpdateBirthDate">
        <yl-date-picker v-model="form.birthDate"
                        class="babyInfoUpdate__datePicker"
                        align="right"
                        type="date"
                        :picker-options="datePickerOptions">
        </yl-date-picker>
      </el-form-item>
      <el-form-item label="出生时间"
                    :required="true"
                    prop="birthTime"
                    key="babyInfoUpdateBirthTime">
        <el-time-select v-model="form.birthTime"
                        class="babyInfoUpdate__timeSelect"
                        :picker-options="timeOption">
        </el-time-select>
      </el-form-item>
       <el-form-item label="体重g"
                    prop="height"
                    key="babyInfoHeight">
        <el-input class="babyInfoEdit__input"
                  v-model="form.height"
                  align="right"
                  placeholder="体重单位g">
        </el-input>
      </el-form-item>
      <el-form-item label="身长cm"
                    prop="weight"
                    key="babyInfoWeight">
        <el-input class="babyInfoEdit__input"
                  v-model="form.weight"
                  align="right"
                  placeholder="体重单位g">
        </el-input>
      </el-form-item>
      <el-form-item>
        <common-button @click="onSubmitBtnClick('form')">保存</common-button>
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
  name: "babyInfoUpdate",
  props: ["motherEpisodeID", "babyID", "babyInfo", "ifShow"],
  data() {
    const rules = {
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
          validator(rule, value, callback) {
            const error = [];
            if (!utils.formatDate(value)) {
              error.push("日期格式不对!");
            }
            callback(error);
          },
          trigger: "change"
        }
      ],
      birthTime: [
        {
          validator(rule, value, callback) {
            const error = [];
            if (!utils.formatTime(value)) {
              error.push("时间格式不对!");
            }
            callback(error);
          },
          trigger: "change"
        }
      ]
    };
    return {
      form: {
        NO: "",
        birthDate: "",
        birthTime: "",
        name: "",
        name2: "",
        orderNumber: "",
        sex: "",
        height: "",
        weight: ""
      },
      sexTypes: [],
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
    ifShow(val) {
      if (val) {
        this.init();
      }
    },
    "form.name": function() {
      this.form.name2 = pinyinUtil.getFirstLetter(this.form.name).toUpperCase();
    }
  },
  methods: {
    init() {
      if (this.$refs && this.$refs.form && this.$refs.form.resetFields) {
        this.$refs.form.resetFields();
      }
      // this.form = this.babyInfo;
      deliveryApi
        .getBabyDeliveryInfo(this.motherEpisodeID, this.babyID)
        .then(babyInfo => {
          this.form = babyInfo;
        });
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
            birthTime,
            height,
            weight
          } = this.form;
          let { birthDate } = this.form;
          birthDate = utils.formatDate(birthDate);
          deliveryApi
            .changeBabyDeliveryInfo(
              this.motherEpisodeID,
              this.babyID,
              orderNumber,
              name,
              name2,
              sex,
              birthDate,
              birthTime,
              height,
              weight
            )
            .then(ret => {
              loadingInstance.close();
              if (ret === 0) {
                this.$message.success("修改成功!");
                this.$emit("saved");
              } else {
                this.$message({
                  message: `修改失败:${ret}`,
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
@b babyInfoUpdate {
  margin: 0 auto;
  @e select {
    width: 150px;
  }
  @e input {
    width: 150px;
  }
  @e datePicker {
    width: 150px !important;
  }
  @e timeSelect {
    width: 150px !important;
  }
}
</style>
