<template>
  <el-date-picker v-model="dateValue" type="date" :editable="editable" :clearable="clearable" :placeholder="placeholder" :format="dateFormat" :picker-options="pickerOptions">
  </el-date-picker>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import utils from "../comm/utils";

export default {
  name: "DatePicker",
  mixins: [Vue.component("ElDatePicker")],
  props: [
    "type",
    "placeholder",
    "pickerOptions",
    "value",
    "editable",
    "clearable"
  ],
  data() {
    return {
      dateValue: null, // new Date(),
      formatString: []
    };
  },
  mounted() {
    this.dateValue = this.value;
  },
  watch: {
    value(val) {
      this.dateValue = utils.formatDate(val); // val;
    },
    dateValue() {
      this.$emit("input", utils.formatDate(this.dateValue)); // this.dateValue);
    }
  },
  computed: {
    ...mapGetters(["systemConfig"]),
    dateFormat() {
      const dateFormat = this.systemConfig.dateFormat.DATEFORMAT || "3";
      return this.dateFormatStr(dateFormat);
    }
  },
  methods: {
    dateFormatStr(dateFormat) {
      let dateFormatStr = "";
      switch (dateFormat) {
        case 3:
          dateFormatStr = "yyyy-MM-dd";
          break;
        case 4:
          dateFormatStr = "dd/MM/yyyy";
          break;
        default:
          dateFormatStr = "yyyy-MM-dd";
          break;
      }
      return dateFormatStr;
    }
  }
};
</script>
