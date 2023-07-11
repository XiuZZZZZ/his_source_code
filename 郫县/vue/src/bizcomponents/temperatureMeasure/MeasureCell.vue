<template>
  <el-tooltip
    class="yl-tooltip__red"
    v-if="item.validate"
    placement="top"
    effect="red"
    content="您输入的值存在异常,请您仔细检查"
    ref="tooltip"
    :disabled="!error"
  >
    <td
      class="measureCell"
      :class="{'is-abnormal':abnormal ,'is-error':error,'is-editable':!editeable}"
      @dblclick="dblClick"
      @click="click"
    >
      <template v-if="!ifFocus">{{praviteValue}}</template>
      <el-input
        class="measureCell__input"
        v-model="praviteValue"
        v-if="ifFocus"
        :class="{'is-focus':ifFocus,'is-abnormal':abnormal ,'is-error':error}"
        @focus="focus"
        @blur="blur"
        @keyup.native="keyup"
        ref="input"
      ></el-input>
    </td>
  </el-tooltip>
  <td
    class="measureCell"
    v-else
    :class="{'is-abnormal':abnormal ,'is-error':error,'is-editable':!editeable}"
    @dblclick="dblClick"
    @click="click"
    @mousedown.right.native.stop="mousedownRight"
  >
    <template v-if="!ifFocus">{{praviteValue}}</template>
    <el-input
      class="measureCell__input"
      v-model="praviteValue"
      v-if="ifFocus"
      :class="{'is-focus':ifFocus,'is-abnormal':abnormal ,'is-error':error}"
      @focus="focus"
      @blur="blur"
      @mousedown.right.native.stop="mousedownRight"
      @keyup.native="keyup"
      ref="input"
    ></el-input>
  </td>
</template>
<script>
export default {
  name: "MeasureCell",
  props: {
    item: Object,
    value: [String, Number],
    row: Number,
    column: Number,
    editeable: Boolean
  },
  data() {
    return {
      ifFocus: false,
      praviteValue: "",
      abnormal: false,
      error: false
    };
  },
  beforeMount() {
    if (this.item.validate) {
      const {
        normalValueRangFrom,
        normalValueRangTo,
        errorValueHightFrom,
        errorValueLowTo
      } = this.item;
      const validateValue = val => {
        if (
          (val >= errorValueHightFrom ||
            val <= errorValueLowTo ||
            isNaN(val)) &&
          val !== ""
        ) {
          this.error = true;
          this.abnormal = false;
        } else if (
          (val > normalValueRangTo || val < normalValueRangFrom) &&
          val !== ""
        ) {
          this.error = false;
          this.abnormal = true;
        } else {
          this.error = false;
          this.abnormal = false;
        }
        this.$emit("valueChange", val, this.error, this.row, this.column);
      };
      this.praviteValue = this.value;
      this.$watch("praviteValue", validateValue);
      if (this.praviteValue && this.praviteValue !== "") {
        validateValue(this.praviteValue);
      }
    } else {
      this.praviteValue = this.value;
      const valueChange = val => {
        this.$emit("valueChange", val, this.error, this.row, this.column);
      };
      this.$watch("praviteValue", valueChange);
    }
  },
  beforeUpdate() {
    // 解决tooltip bug
    if (this.$refs.tooltip) {
      this.$refs.tooltip.handlerAdded = false;
    }
  },
  watch: {
    value(val) {
      this.praviteValue = val;
    }
  },
  methods: {
    mousedownRight(event) {
      this.$emit("mousedownRight", this.row, this.column, event, this);
    },
    startEditing() {
      this.ifFocus = true;
      this.$nextTick(() => {
        this.$refs.input.$el.children[0].focus();
      });
    },
    stopEditing() {
      this.$refs.input.$el.children[0].blur();
    },
    keyup(event) {
      const key = String(event.key);
      if (key.indexOf("Up") > -1) {
        this.$emit("move", this.row - 1, this.column, event, this);
      } else if (key.indexOf("Down") > -1) {
        this.$emit("move", this.row + 1, this.column, event, this);
      } else if (key.indexOf("Left") > -1) {
        this.$emit("move", this.row, this.column - 1, event, this);
      } else if (key.indexOf("Right") > -1) {
        this.$emit("move", this.row, this.column + 1, event, this);
      } else if (key.indexOf("Enter") > -1) {
        this.$emit("move", this.row, this.column + 1, event, this);
      }
      if (this.item.validate) {
        const praviteValueStr = String(this.praviteValue);
        this.praviteValue = praviteValueStr.replace(/[^\d.]/g, "");
        const num = this.praviteValue.split(".").length - 1;
        if (num === 2) {
          this.praviteValue = praviteValueStr.replace(/[.]/, "");
        }
      }
    },
    dblClick() {},
    click(event) {
      if (this.editeable) {
        this.$emit("dblClick", this.row, this.column, event, this);
        this.startEditing();
      }
      this.$emit("click", this.row, this.column, event, this);
    },
    focus(event) {
      this.ifFocus = true;
      /* global window */
      if (window.ActiveXObject || "ActiveXObject" in window) {
        // 把光标移动input默认值的最后
        event.target.setSelectionRange(
          String(this.value).length,
          String(this.value).length
        );
      }
    },
    blur() {
      this.ifFocus = false;
      const cellBlur = () => {
        this.$emit("cellBlur", this);
      };
      setTimeout(cellBlur, 100);
    }
  }
};
</script>

<style>
@import "../../assets/main.css";
@b measureCell {
  @when abnormal {
    color: #f6a405;
  }
  @when error {
    color: #fe0000;
  }
  @when editable {
    background-color: #f5f7ff;
  }
  & .el-input__inner {
    border: none;
    text-align: center;
    border-radius: 0;
  }
  @e input {
    @when focus {
      & .el-input__inner {
        border: 1px solid var(--mainColor);
      }
    }
    @when abnormal {
      &.is-focus .el-input__inner {
        border: 1px solid #f6a405;
      }
      & .el-input__inner {
        color: #f6a405;
      }
    }
    @when error {
      &.is-focus .el-input__inner {
        border: 1px solid #fe0000;
      }
      & .el-input__inner {
        color: #fe0000;
      }
    }
  }
}

.el-tooltip__popper.is-red {
  background: #ff9683;
  border: 1px solid #ff5153;
  color: #fff;
}

.el-tooltip__popper.is-red[x-placement^="top"] .popper__arrow {
  border-top-color: #ff5153;
}

.el-tooltip__popper.is-red[x-placement^="top"] .popper__arrow::after {
  border-top-color: #ff9683;
}

.el-tooltip__popper.is-red[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #1f2d3d;
}

.el-tooltip__popper.is-red[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: #fff;
}

.el-tooltip__popper.is-red[x-placement^="left"] .popper__arrow {
  border-left-color: #1f2d3d;
}

.el-tooltip__popper.is-red[x-placement^="left"] .popper__arrow::after {
  border-left-color: #fff;
}

.el-tooltip__popper.is-red[x-placement^="right"] .popper__arrow {
  border-right-color: #1f2d3d;
}

.el-tooltip__popper.is-red[x-placement^="right"] .popper__arrow::after {
  border-right-color: #fff;
}
</style>
