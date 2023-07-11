<template>
  <div class="OrderSign">
    <el-form status-icon ref="form" size="small" :rules="rules" :model="form" label-width="120px" class="OrderSign-form">
      <el-form-item label="日期" prop="date">
        <yl-date-picker class="OrderSign__datePicker" v-model="form.date" align="right" type="date">
        </yl-date-picker>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-time-select :picker-options="{ start: '01:00',step: '01:00',end: '23:00'}" v-model="form.time" @blur="timeSelectBlur">
        </el-time-select>
      </el-form-item>
      <el-form-item label="备注" v-if="triggerButton.jsFunction!=='skinTestAllergy'&&triggerButton.jsFunction!=='skinTestNormal'">
        <el-input v-model="form.notes" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="批号" v-if="triggerButton.jsFunction==='skinTestAllergy'||triggerButton.jsFunction==='skinTestNormal'">
        <el-input v-model="form.number" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="userCode" v-if="triggerButton.ifSign||triggerButton.ifDBSign">
        <el-input v-model="form.userCode" placeholder="请输入工号" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="triggerButton.ifSign||triggerButton.ifDBSign">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="userCodeSecond" v-if="triggerButton.ifDBSign">
        <el-input v-model="form.userCodeSecond" placeholder="请输入工号" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passwordSecond" v-if="triggerButton.ifDBSign">
        <el-input v-model="form.passwordSecond" type="password" placeholder="请输入密码" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item>
        <common-button @click="onSubmitBtnClick('form')">确认</common-button>
        <common-button @click="onCloseBtnClick">取消</common-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import session from '../../store/api/session';
import CommonButton from '../../components/CommonButton';
import DatePicker from '../../components/DatePicker';
import datetTimeFormat from '../../comm/utils';
import userInfo from '../../store/api/userInfo';

export default {
  name: 'OrderSign',
  props: {
    triggerButton: {
      required: true,
      type: Object,
    },
    func: Function,
  },
  data() {
    const form = {};
    const userID = {};
    const validatorUserCodeFactory = passwordName => (
      rule,
      value,
      callback,
    ) => {
      if (this.form[passwordName] !== '') {
        this.$refs.form.validateField(passwordName);
      }
      callback();
    };

    const validatorPasswordFactory = (codeName, userIDName) => (
      rule,
      value,
      callback,
    ) => {
      userInfo.passwordConfirm(this.form[codeName], value).then(result => {
        if (String(result.result) !== '0') {
          callback([result.result]);
        } else {
          this.userID[userIDName] = result.userID;
          callback();
        }
      });
    };
    return {
      userID,
      form,
      rules: {
        date(rule, value, callback) {
          const error = [];
          const date = datetTimeFormat.formatDate(value);
          if (!date) {
            error.push('请选择正确的日期!');
          }
          callback(error);
        },
        time(rule, value, callback) {
          const error = [];
          const time = datetTimeFormat.formatTime(value);
          if (!time) {
            error.push('请选择正确的时间!');
          }
          callback(error);
        },
        userCode: [
          { type: 'string', required: true, message: '请输入工号', trigger: 'blur' },
          {
            validator: validatorUserCodeFactory('password'),
            trigger: 'change',
          },
        ],
        userCodeSecond: [
          { type: 'string', required: true, message: '请输入工号', trigger: 'blur' },
          {
            validator: validatorUserCodeFactory('passwordSecond'),
            trigger: 'change',
          },
        ],
        password: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' },
          {
            validator: validatorPasswordFactory('userCode', 'userID'),
            trigger: 'blur',
          },
        ],
        passwordSecond: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' },
          {
            validator: validatorPasswordFactory(
              'userCodeSecond',
              'userIDSecond',
            ),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  components: {
    CommonButton,
    YlDatePicker: DatePicker,
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // const that = this;
      datetTimeFormat.getCurrentDateTime().then(dateTime => {
        this.form = {
          date: dateTime.date,
          time: dateTime.time,
          notes: '',
          number: '',
          userCode: '',
          password: '',
          userCodeSecond: '',
          passwordSecond: '',
        };
        this.userID = {
          userID: '',
          userIDSecond: '',
        };
        if (this.$refs && this.$refs.form && this.$refs.form.resetFields) {
          this.$refs.form.resetFields();
        }
      });
    },
    timeSelectBlur(timeSelect) {
      this.form.time = timeSelect.$children[0].currentValue;
    },
    onCloseBtnClick() {
      this.$emit('close');
    },
    onSubmitBtnClick(formName) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (that.func && typeof that.func === 'function') {
            const loadingInstance = this.$loading({
              fullscreen: true,
              text: '后台处理中...',
            });
            setTimeout(() => {
              const info = {
                userID1: that.userID.userID || session.USER.USERID,
                userID2: that.userID.userIDSecond,
                date: datetTimeFormat.formatDate(that.form.date),
                time: datetTimeFormat.formatTime(that.form.time),
                notes: that.form.notes,
                number: that.form.number,
              };
              that.func(info, loadingInstance);
              that.$emit('close');
            }, 100);
          }
        } else {
          return false;
        }
        return true;
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../../assets/main.css';
@b OrderSign {
}
</style>
