<template>
  <span class="pressureInput__input">
    <el-input
      v-model="pressureValue.sysPressure"
      ref="sysPressure"
      maxlength="3"
      @keyup.native="number($event,'sysPressure')"
    ></el-input>/
    <el-input
      v-model="pressureValue.diaPressure"
      ref="diaPressure"
      maxlength="3"
      @keyup.native="number($event,'diaPressure')"
    ></el-input>mmHg
  </span>
</template>

<script>
export default {
  name: "PressureInput",
  props: ["value", "width"],
  data() {
    return {
      pressureValue: {
        sysPressure: "",
        diaPressure: ""
      }
    };
  },
  mounted() {},
  watch: {
    value(val){
      if(!val.diaPressure){
        this.pressureValue.diaPressure="";
      }
      if(!val.sysPressure){
        this.pressureValue.sysPressure="";
      }
    },
    "pressureValue.sysPressure": function(val) {
      if (val > 99) {
        this.$refs.diaPressure.focus();
      }
      if (val !== "" && this.pressureValue.diaPressure !== "") {
        this.$emit("input", this.pressureValue);
      }
    },
    "pressureValue.diaPressure": function(val) {
      if (val !== "") {
        this.$emit("input", this.pressureValue);
      }
    }
  },
  computed: {},
  methods: {
    number(event, code) {
      this.pressureValue[code] = this.pressureValue[code].replace(
        /[^\\.\d]/g,
        ""
      );
      this.pressureValue[code] = this.pressureValue[code].replace(".", "");
      if (event.key === "Enter" && code === "sysPressure") {
        this.$refs.diaPressure.focus();
      }
      if (
        event.key === "Backspace" &&
        code === "diaPressure" &&
        this.pressureValue[code] === ""
      ) {
        this.$refs.sysPressure.focus();
      }
    },
    focus() {
      this.$refs.sysPressure.focus();
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@b pressureInput {
  @e input {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    & .el-input--small {
      display: inline-block;
      width: 30%;
    }
    & .el-input--small .el-input__inner {
      height: 32px;
      line-height: 32px;
      border: none;
      padding: 0 0 0 5px;
    }
  }
}
</style>