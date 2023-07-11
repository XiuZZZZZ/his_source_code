<template>
  <el-form status-icon
           ref="form"
           :rules="rule"
           :model="sheetForm"
           label-width="140px"
           class="OrderSheetConfig">
    <template v-for="sheet in sheets">
      <el-form-item :label="sheet.name"
                    :prop="sheet.ID"
                    :key="sheet.ID">
        <el-input class="OrderSheetConfig__input"
                  v-model="sheetForm[sheet.ID]"
                  align="right">
        </el-input>
      </el-form-item>
    </template>
    <el-form-item>
      <common-button backgroundColor="rgb(64, 162, 222)"
                     color="#fff"
                     class="OrderSheetConfig__btn"
                     @click="onSubmitBtnClick('form')">保存</common-button>
    </el-form-item>
  </el-form>
  </el-form>
</template>
<script>
import CommonButton from "../../components/CommonButton";

export default {
  name: 'OrderSheetConfig',
  props: ['sheets'],
  components: {
    CommonButton,
  },
  data() {
    const noRule = [
      {
        validator: (rule, value, callback) => {
          const error = [];
          if (isNaN(value)) {
            error.push("请输入数字!");
            callback(error);
          } else if (String(value).indexOf('.') > -1) {
            error.push("不能输入小数!");
            callback(error);
          }
          callback();
        },
        trigger: "change"
      }
    ];
    const sheetForm = {};
    const rule = {};
    let sheetConfigData = {};
    if (localStorage.sheetConfig) {
      sheetConfigData = JSON.parse(localStorage.sheetConfig);
    }
    this.sheets.forEach(sheet => {
      let no = "";
      if (sheetConfigData[sheet.ID]) {
        no = sheetConfigData[sheet.ID];
      }
      this.$set(sheetForm, sheet.ID, no)
      this.$set(rule, sheet.ID, noRule)
    })
    return {
      rule,
      sheetForm,
    };
  },
  methods: {
    onSubmitBtnClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          /* global localStorage*/
          localStorage.sheetConfig = JSON.stringify(this.sheetForm);
          this.$emit("saveSuccess");
        }
      })
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b OrderSheetConfig {
  margin: 0 auto;

  @e input {
    width: 60px;
  }
  @e btn {
    position: relative;
    left: -40px;
  }
}
</style>
