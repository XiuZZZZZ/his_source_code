<template>
  <td class="measureSelectCell" @dblclick="dblClick" @click="click">
    <template v-if="!ifFocus||disabled">
      <el-input v-model="praviteValue" :disabled="disabled"></el-input>
    </template>
    <el-select
      class="measureSelectCell__select"
      v-if="ifFocus&&!disabled"
      clearable
      @change="change"
      @visible-change="visibleChange"
      @keyup.native="keyup"
      :filterable="filterable"
      :filter-method="filterOptions"
      v-model="praviteValue"
      ref="select"
    >
      <el-option v-for="option in options" :key="option" :label="option" :value="option"></el-option>
    </el-select>
  </td>
</template>
<script>
import pinyinUtil from "../../comm/pinyinUtil";

export default {
  name: "MeasureSelectCell",
  props: {
    item: Object,
    value: [String, Number],
    row: Number,
    column: Number,
    filterable: Boolean,
    disabled: Boolean
  },
  data() {
    return {
      options: [],
      ifFocus: false,
      praviteValue: ""
    };
  },
  beforeMount() {
    this.praviteValue = this.value;
    this.options = this.item.options;
  },
  watch: {
    praviteValue(val) {
      this.$emit("valueChange", val, false, this.row, this.column);
    },
    value(val) {
      this.praviteValue = val;
    }
  },
  methods: {
    startEditing() {
      this.ifFocus = true;
      this.$nextTick(() => {
        if (this.$refs.select) {
          this.$refs.select.toggleMenu();
        }
        const that = this;
        setTimeout(() => {
          if (that.$refs) {
            that.$refs.select.$refs.reference.$el.children[1].focus();
          }
        }, 100);
      });
    },
    stopEditing() {},
    dblClick() {},
    click() {
      this.$emit("dblClick", this.row);
      if (!this.ifFocus) {
        this.startEditing();
      } else {
        this.ifFocus = false;
      }
      this.$emit("click", this.row);
    },
    visibleChange(value) {
      if (!value) {
        this.ifFocus = false;
      }
    },
    change() {
      this.ifFocus = false;
      const that = this;
      setTimeout(() => {
        if (that) {
          that.$emit("enterKeyup", this.row, this.column, "", this);
          that.$emit("cellBlur", this);
        }
      }, 100);
    },
    keyup(event) {
      switch (event.key) {
        case "ArrowUp":
          this.$emit("move", this.row - 1, this.column, event, this);
          this.ifFocus = false;
          break;
        case "ArrowDown":
          this.$emit("move", this.row + 1, this.column, event, this);
          this.ifFocus = false;
          break;
        case "ArrowLeft":
          this.$emit("move", this.row, this.column - 1, event, this);
          this.ifFocus = false;
          break;
        case "ArrowRight":
          this.$emit("move", this.row + 1, this.column + 1, event, this);
          this.ifFocus = false;
          break;
        case "Enter":
          this.$emit("move", this.row, this.column + 1, event, this);
          this.ifFocus = false;
          break;
        default:
          break;
      }
    },
    filterOptions(query) {
      const queryStr = query.toUpperCase();
      console.log(this.options);
      this.options = this.item.options.filter(
        opt =>
          opt.indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(opt).indexOf(queryStr) > -1
      );
    }
  }
};
</script>

<style>
@import "../../assets/main.css";
@b measureSelectCell {
  & .el-input__inner {
    border: none;
    text-align: center;
    border-radius: 0;
  }
}
</style>
