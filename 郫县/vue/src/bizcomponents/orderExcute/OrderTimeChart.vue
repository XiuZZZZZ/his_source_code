<template>
  <div class="orderTimeChart__execTimeChart"
       :class="{ 'is-show':show}"
       v-if="order.execInfos&&order.execInfos.length>0&&show">
    <div class="orderTimeChart__timeChartRow">
      <el-button  type="text" size="small" @click.stop="attachOrderClick">绑定</el-button>
      <span class="orderTimeChart__timeChartDateSpan cursorPoint"
            v-for="(date,index) of order.sttDates"
            :key="index"
            @click.stop="onClickTimeChartDate(date)">{{date}}</span>
    </div>
    <div class="orderTimeChart__timeChartRow"
         v-for="(time,index) of order.sttTimes"
         :key="index">
      <span class="orderTimeChart__timeChartTimeSpan cursorPoint"
            @click.stop="onClickTimeChartTime(time)">
        {{time}}
      </span>
    </div>
    <template v-for="(execInfo,index) of order.execInfos">
      <el-tooltip class="item"
                  effect="light"
                  :disabled="execInfo.execCtcpDesc===''&&execInfo.printFlag===''"
                  placement="right"
                  :key="'excInfoTip'+index">
        <div slot="content">更新人：{{execInfo.execCtcpDesc}}<br/>更新时间：{{execInfo.execDateTime}}
          <br/>打印标志:{{execInfo.printFlag}}
        </div>
        <el-tooltip class="item"
                    effect="light"
                    :open-delay="3000"
                    :content="execInfo.ID"
                    :disabled="execInfo.ID===''"
                    placement="bottom"
                    :key="'excInfoIDTip'+index">
          <el-checkbox class="orderTimeChart__execCheckBox orderList__expansitonClickArea orderList__checkBox is-circle"
                       :value="execInfo.check"
                       @input="setExecCheckValue(index,execInfo)"
                       @change="onExecCheckChange"
                       :style="getExecCheckStyle(execInfo)"
                       :class="getExecCheckClass(execInfo)">
            <span v-if="execInfo.examInfo.partDesc"
                  class="orderTimeChart__examName">{{execInfo.examInfo.partDesc}}</span>
            <span v-if="execInfo.execAttachFlag"
                  class="orderTimeChart__attachFlag">已绑</span>
          </el-checkbox>
        </el-tooltip>
      </el-tooltip>
    </template>
    <el-dialog :visible.sync="ifShowOrderAttach"
               custom-class="orderExcute__dialog"
               title="绑定医嘱"                          
               :show-close="false"
               :modal-append-to-body="false">
      <OrderAttach ref="orderAttach"
                 :order="order"
                 :ifShow="ifShowOrderAttach"                 
                 :defaultAttachTypeRadio="defaultAttachTypeRadio"   
                 @close="ifShowOrderAttach=false;"
                 ></OrderAttach>
    </el-dialog>
  </div>

</template>
<script>
import OrderAttach from "./OrderAttach";
import ordereApi from "../../store/api/order";

export default {
  name: "OrderTimeChart",
  components: {
    OrderAttach
  },
  props: ["order", "show"],
  data() {
    return {
      ifShowOrderAttach: false,
      defaultAttachTypeRadio: "10"
    };
  },
  methods: {
    onClickTimeChartDate(date) {
      this.$emit("clickTimeChartDate", date);
    },
    onClickTimeChartTime(time) {
      this.$emit("clickTimeChartTime", time);
    },
    setExecCheckValue(index, execInfo) {
      this.$emit("setExecCheckValue", index);
      if (execInfo.examInfo && execInfo.examInfo.partTarFlag === "Y") {
        for (let i = 0; i < this.order.execInfos.length; i += 1) {
          if (i !== index) {
            this.$emit("setExecCheckValue", i);
          }
        }
      }
    },
    onExecCheckChange() {
      this.$emit("execCheckChange");
    },
    getExecCheckStyle(execInfo) {
      const dateIndex = this.order.sttDates.findIndex(
        sttDate => execInfo.sttDate === sttDate
      );
      const timeIndex = this.order.sttTimes.findIndex(
        sttTime => execInfo.sttTime === sttTime
      );
      const top = (timeIndex + 1) * 40 + 12;
      const left = (dateIndex + 1) * 80 - 20;
      return {
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`
      };
    },
    getExecCheckClass(execInfo) {
      return [`is-${execInfo.disposeStatCode}`];
    },
    attachOrderClick() {
      const execInfoObj = this.order.execInfos.find(execInfo => execInfo.check);
      const that = this;
      if (
        execInfoObj &&
        execInfoObj.check &&
        execInfoObj.disposeStatCode !== "ExecDiscon"
      ) {
        that.defaultAttachTypeRadio = "10";
        ordereApi
          .getAttachOrder(this.order.ID, this.defaultAttachTypeRadio)
          .then(ret => {
            if (ret.length > 0) {
              that.ifShowOrderAttach = true;
            } else {
              that.defaultAttachTypeRadio = "11";
              ordereApi
                .getAttachOrder(this.order.ID, this.defaultAttachTypeRadio)
                .then(retOhter => {
                  if (retOhter.length > 0) {
                    that.ifShowOrderAttach = true;
                  } else {
                    this.$message({
                      message: "未关联可以进行手动绑定的医嘱项!",
                      type: "warning",
                      showClose: true
                    });
                  }
                });
            }
          });
      } else {
        let messageInfo = "请选择医嘱!";
        if (execInfoObj && execInfoObj.disposeStatCode === "ExecDiscon") {
          messageInfo = "执行记录为停止执行状态,无法绑定医嘱!";
        }
        this.$message({
          type: "warn",
          message: messageInfo,
          showClose: true
        });
      }
    }
  }
};
</script>
<style >
@import "../../assets/main.css";
@b orderTimeChart {
  @e execTimeChart {
    position: relative;
    left: -45px;
    /*transition: transform .5s;*/
    height: 0;
    overflow: hidden;
    white-space: nowrap;
    @when show {
      padding: 0 0 var(--orderItemInterval) 0;
      height: auto;
      overflow: visible;
    }
  }
  @e timeChartRow {
    height: 40px;
  }
  @e timeChartDateSpan {
    display: inline-block;
    height: inherit;
    width: 80px;
    text-align: center;
    line-height: 40px;
    color: #a5a5a5;
    font-weight: lighter;
    font-size: var(--mainFontSize);
    &:first-child {
      margin-left: 30px;
    }
  }
  @e timeChartTimeSpan {
    float: left;
    height: inherit;
    width: 30px;
    color: #a5a5a5;
    font-weight: lighter;
    font-size: var(--mainFontSize);
    text-align: left;
    line-height: 40px;
    clear: left;
  }
  @e execCheckBox {
    position: relative;
    @when LongUnnew {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--LongUnnewColor) !important;
        background-color: var(--LongUnnewColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--LongUnnewColor);
      }
    }
    @when LongNew {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--LongNewColor) !important;
        background-color: var(--LongNewColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--LongNewColor);
      }
    }
    @when Temp {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--TempColor) !important;
        background-color: var(--TempColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--TempColor);
      }
    }
    @when Immediate {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--ImmediateColor) !important;
        background-color: var(--ImmediateColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--ImmediateColor);
      }
    }
    @when SkinTest {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--SkinTestColor) !important;
        background-color: var(--SkinTestColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--SkinTestColor);
      }
    }
    @when Discontinue {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--DiscontinueColor) !important;
        background-color: var(--DiscontinueColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--DiscontinueColor);
      }
    }
    @when ExecDiscon {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--ExecDisconColor) !important;
        background-color: var(--ExecDisconColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--ExecDisconColor);
      }
    }
    @when Exec {
      & .el-checkbox__inner {
        border: var(--execCheckBoxBorderWidth) solid var(--ExecColor) !important;
        background-color: var(--ExecColor);
      }
      & .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: var(--ExecColor);
      }
    }
    @when circle {
      & .el-checkbox__inner {
        border-radius: var(--checkBoxBorderRadius);
      }
    }
  }
  @e examName {
    font-weight: bold;
    color: #0b2dc4;
    margin-left: 8px;
    font-size: 14px;
  }
  @e attachFlag {
    font-weight: bold;
    color: #c40bab;
    margin-left: 1px;
    font-size: 12px;
  }
}
</style>
