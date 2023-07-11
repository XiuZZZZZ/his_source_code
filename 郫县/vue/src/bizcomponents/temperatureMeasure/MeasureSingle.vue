<template>
  <div class="MeasureSingle">
    <div class="MeasureSingle__top">
      <PatInfoBanner class="MeasureSingle__patInfo" 
                    :patInfo="patient"
                    :ifShowDays="true">
      </PatInfoBanner>
    </div>
    <div class="MeasureSingle__tools"
         align="right">
      <CommonButton width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="preShow">预览</CommonButton> &nbsp;
      <CommonButton width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="makeTempPic">生成图片</CommonButton> &nbsp;
      <yl-date-picker class="MeasureSingle__datePicker"
                      v-model="startDate"
                      :editable="false"
                      :clearable="false"
                      :picker-options="pickerBeginDateBefore"> </yl-date-picker> &nbsp;&nbsp;&nbsp;
      <CommonButton width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="preDate">上一日</CommonButton> &nbsp;
      <CommonButton width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="nextDate">下一日</CommonButton>
    </div>
    <div class="MeasureSingle__body">
      <table class="MeasureSingle__table"
             @contextmenu="onContextMenu">
        <colgroup> <col class="MeasureSingle__colTitle"></col>
          <col class="MeasureSingle__colContent"
               v-for="time of tempConfig.times"
               :key="time"></col>
        </colgroup>
        <thead>
          <tr class="MeasureSingle__tr">
            <th class="MeasureSingle__th"><span style="color:red">{{patient.weekDays}}</span></th>
            <th class="MeasureSingle__th"
                colspan="3">上午</th>
            <th class="MeasureSingle__th"
                colspan="3">下午</th>
          </tr>
          <tr class="MeasureSingle__tr">
            <th class="MeasureSingle__th">时间</th>
            <th class="MeasureSingle__th"
                v-for="time of tempConfig.times"
                :key="time">{{parseInt(time,10)}}</th>
          </tr>
        </thead>
        <tbody>
          <tr class="MeasureSingle__tr"
              v-for="(item,row) of tempConfig.measureItems"
              :key="item.code">
            <td class="MeasureSingle__td"
                v-if="!item.blank">{{item.desc}}</td>
            <MeasureSelectCell class="MeasureSingle__td"
                               v-if="item.blank"
                               :item="item"
                               :row="row"
                               :column="-1"
                               :value="dayData[item.blankTitleCode]?dayData[item.blankTitleCode][item.blankTitleInputTime]['value']:''"
                               @valueChange="valueChange"></MeasureSelectCell>
            <template v-for="(time,column) of item.times">
              <MeasureCell class="MeasureSingle__td"
                           v-if="!item.select"
                           :item="item"
                           :key="time"
                           :row="row"
                           :column="column"
                           :editeable="ifBeforInDeptDateTime(time,item)&&(!item.blank||(item.blank&&dayData[item.blankTitleCode][item.blankTitleInputTime]['value']!==''))"
                           @move="move"
                           @mousedownRight="cellRightClick"
                           @valueChange="valueChange"
                           @cellBlur="cellBlur"
                           :value="dayData[item.code]?dayData[item.code][time]['value']:''"
                           :colspan="getColSpan(item)"
                           ref="cell"> </MeasureCell>
              <MeasureSelectCell class="MeasureSingle__td"
                                 v-if="item.select"
                                 :item="item"
                                 :key="time"
                                 :row="row"
                                 :column="column"
                                 :disabled="!ifBeforInDeptDateTime(time,item)"
                                 :value="dayData[item.code]?dayData[item.code][time]['value']:''"
                                 @move="move"
                                 @valueChange="valueChange"
                                 :options="item.options"
                                 :colspan="getColSpan(item)"
                                 ref="cell"> </MeasureSelectCell>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="MeasureSingle__footer">
      <el-tooltip class="yl-tooltip__red"
                  placement="top"
                  effect="red"
                  content="您输入的值存在异常,请检查红色字体的值!"
                  :disabled="!errorShow">
        <CommonButton width="100"
                      @click="save(true)"
                      @blur="saveBtnBlur"
                      color="#ffffff"
                      border="#509de1"
                      background-color="#509de1">保存</CommonButton>
      </el-tooltip> &nbsp;
      <CommonButton width="100"
                    @click="close"
                    color="#ffffff"
                    border="#509de1"
                    v-if="ifShowCloseBtn()"
                    background-color="#509de1">关闭</CommonButton>
    </div>
    <el-popover ref="symbolPopover"
                placement="top-start"
                popper-class="MeasureSingle__symbolPopover"
                trigger="hover"
                content="测试">
      <template v-if="(currentEditRow&&tempConfig.measureItems[currentEditRow].symbol)">
        <span v-for="(i,index) of tempConfig.measureItems[currentEditRow].symbol"
              :key="index"
              class="MeasureSingle__symbol"
              @click="symbolClick(i)">
          {{i}}
        </span>
      </template>
    </el-popover>
  </div>
</template>
<script>
import datetTimeFormat from "../../comm/utils";
import temperatureApi from "../../store/api/temperature";
import CommonButton from "../../components/CommonButton";
import DatePicker from "../../components/DatePicker";
import PatInfoBanner from "../bedChart/PatInfoBanner";
import MeasureCell from "./MeasureCell";
import MeasureSelectCell from "./MeasureSelectCell";
import session from "../../store/api/session";

export default {
  name: "MeasureSingle",
  props: {
    patient: Object,
    tempConfig: Object,
    dialog: Boolean
  },
  data() {
    return {
      startDate: new Date(),
      headNurseFlag:0,
      dayData: {},
      errorShow: false,
      currentEditRow: null,
      currentEditColumn: null,
      pickerBeginDateBefore: {
        disabledDate: date => {
          const inEventRYDateTime = datetTimeFormat
            .formatDate(this.patient.inEventRYDateTime.split(" ")[0])
            .replace(/-/g, "/");
          const currDate = new Date();
          const inHospDateTime = datetTimeFormat
            .formatDate(this.patient.inHospDateTime.split(" ")[0])
            .replace(/-/g, "/");
          if(this.headNurseFlag === 1){
            return (
              datetTimeFormat.compareDate(inHospDateTime, date) ||
              datetTimeFormat.compareDate(date, currDate)
            );
          }
          return (
            datetTimeFormat.compareDate(inEventRYDateTime, date) ||
            datetTimeFormat.compareDate(date, currDate)
          );
        }
      }
    };
  },

  beforeMount() {
    console.log(this.patient);
    this.getTempData();
  },
  watch: {
    patient() {
      this.getTempData();
    },
    startDate() {
      this.getTempData();
    }
  },
  methods: {
    ifBeforInDeptDateTime(time, item) {
      const cellDateTime = new Date(this.startDate);
      cellDateTime.setHours(time);
      cellDateTime.setMinutes(0);
      cellDateTime.setMilliseconds(0);
      let inEventRYDateTime = "";
      let inHospDateTime = "";
      if (typeof this.patient.regDateTime === "string") {
        const inDeptDate = datetTimeFormat.formatDate(
          this.patient.inEventRYDateTime.split(" ")[0]
        );
        inEventRYDateTime = `${inDeptDate} ${
          this.patient.inEventRYDateTime.split(" ")[1]
        }`;
        inEventRYDateTime = inEventRYDateTime.replace(/-/g, "/");
      }
      const inDeptDate = new Date(inEventRYDateTime);
      if (
        datetTimeFormat.formatDate(this.startDate) ===
        datetTimeFormat.formatDate(inDeptDate)
      ) {
        if (item.times.length < 6) {
          return true;
        }
      }
      inHospDateTime = this.patient.inHospDateTime.replace(/-/g, "/");
      if (this.headNurseFlag === 1){
        const inDeptDate2 = new Date(inHospDateTime);
        if (cellDateTime >= inDeptDate2) {
          return true;
        }
      }
      if (cellDateTime >= inDeptDate) {
        return true;
      }
      return false;
    },
    getTempData() {
      if (this.patient.episodeID) {
        const { getTempDataByDay } = temperatureApi;
        const { ifHeadNurse } = temperatureApi;

        ifHeadNurse().then(flag =>{
          this.headNurseFlag = flag
        })

        getTempDataByDay(
          this.patient.episodeID,
          datetTimeFormat.formatDate(this.startDate)
        ).then(dayData => {
          Object.keys(dayData).forEach(itemCode => {
            Object.keys(dayData[itemCode]).forEach(time => {
              dayData[itemCode][time].originalValue =
                dayData[itemCode][time].value;
            });
          });
          this.dayData = dayData;
        });
      }
    },
    save(ifShowMessage) {
      this.errorShow = false;
      const startDate = datetTimeFormat.formatDate(this.startDate);
      if (!startDate) {
        this.$message.error("日期格式错误!");
        return;
      }
      let editItemValueString = "";
      const editItemData = {};
      const timeSplitChar = this.tempConfig.splitChar.timeSplitChar;
      const timeValueSplitChar = this.tempConfig.splitChar.timeValueSplitChar;
      const codeSplitChar = this.tempConfig.splitChar.codeSplitChar;
      const codeValueSplitChar = this.tempConfig.splitChar.codeValueSplitChar;
      Object.keys(this.dayData).forEach(itemCode => {
        Object.keys(this.dayData[itemCode]).forEach(time => {
          if (!this.errorShow && this.dayData[itemCode][time].error) {
            this.errorShow = true;
          } else if (
            this.dayData[itemCode][time].edit &&
            !this.dayData[itemCode][time].error
          ) {
            // 拼接编辑过的值
            const valueString = `${time}${timeValueSplitChar}${
              this.dayData[itemCode][time].value
            }`;
            editItemData[itemCode] = editItemData[itemCode]
              ? `${editItemData[itemCode]}${timeSplitChar}${valueString}`
              : valueString;
          }
        });
      });
      Object.keys(editItemData).forEach(itemCode => {
        const valueString = `${itemCode}${codeValueSplitChar}${
          editItemData[itemCode]
        }`;
        editItemValueString = editItemValueString
          ? `${editItemValueString}${codeSplitChar}${valueString}`
          : valueString;
      });
      if (
        !this.errorShow &&
        editItemValueString !== "" &&
        this.patient &&
        this.patient.episodeID !== ""
      ) {
        temperatureApi
          .saveObsDataByDay(
            this.patient.episodeID,
            editItemValueString,
            startDate
          )
          .then(ret => {
            if (ret === 0) {
              this.getTempData();
              if (ifShowMessage) {
                this.$message.success("保存成功!");
              }
            } else {
              this.$message.error("保存失败!");
            }
          });
      } else if (editItemValueString === "" && !this.errorShow) {
        if (ifShowMessage) {
          this.$message.error("没有需要保存的值!");
        }
      }
    },
    onContextMenu(event) {
      event.returnValue = false;
      event.preventDefault();
      return false;
    },
    symbolClick(value) {
      const itemCode = this.tempConfig.measureItems[this.currentEditRow].code;
      const time = this.tempConfig.measureItems[this.currentEditRow].times[
        this.currentEditColumn
      ];
      const editValue = `${this.dayData[itemCode][time].value}${value}`;
      this.valueChange(
        editValue,
        false,
        this.currentEditRow,
        this.currentEditColumn
      );
    },
    cellRightClick(row, column, event, cell) {
      this.currentEditColumn = column;
      this.currentEditRow = row;
      if (this.tempConfig.measureItems[row].symbol) {
        const symbolPopover = this.$refs.symbolPopover;
        const popper = symbolPopover.popper || symbolPopover.$refs.popper;
        symbolPopover.$refs.reference = cell.$el;
        symbolPopover.referenceElm = null;
        cell.$el.addEventListener(
          "mouseleave",
          symbolPopover.handleMouseLeave,
          false
        );
        popper.addEventListener(
          "mouseleave",
          symbolPopover.handleMouseLeave,
          false
        );
        this.$refs.symbolPopover.doToggle();
      }
    },
    saveBtnBlur() {
      this.errorShow = false;
    },
    close() {
      this.$emit("close");
      /* global window */
      if (!this.dialog) {
        if (window.opener) {
          window.close();
        }
      }
    },
    ifShowCloseBtn() {
      return window.opener
        ? true
        : this.$root.$el.className === "TemperatureMeasureMutiply";
    },
    getColSpan(item) {
      return parseInt(6 / item.times.length, 10);
    },
    preShow() {
      /* global window */
      const episodeID = this.patient.episodeID;
      window.TempShow(episodeID);
    },
    preDate() {
      const newDate = new Date(this.startDate);
      newDate.setDate(newDate.getDate() - 1);
      this.startDate = newDate;
    },
    nextDate() {
      const newDate = new Date(this.startDate);
      newDate.setDate(newDate.getDate() + 1);
      const curDate = new Date();
      if (newDate <= curDate) {
        this.startDate = newDate;
      } else {
        this.$message.error("不能提前录入明天的体温!");
      }
    },
    valueChange(value, error, row, column) {
      let itemCode;
      let time;
      if (column > -1) {
        itemCode = this.tempConfig.measureItems[row].code;
        time = this.tempConfig.measureItems[row].times[column];
      } else {
        itemCode = this.tempConfig.measureItems[row].blankTitleCode;
        time = this.tempConfig.measureItems[row].blankTitleInputTime;
      }
      this.dayData[itemCode][time].value = value;
      this.dayData[itemCode][time].error = error;
      const { originalValue } = this.dayData[itemCode][time];
      this.dayData[itemCode][time].edit =
        String(originalValue) !== String(value);
    },
    move(row, column, event, currentCell) {
      currentCell.stopEditing();
      let nextColumn = column;
      let nextRow = row;
      if (event.key === "Enter") {
        nextRow = row + 1;
        nextColumn = column - 1;
      }
      if (row === this.tempConfig.measureItems.length) {
        nextRow = 0;
      } else if (row < 0) {
        nextRow = this.tempConfig.measureItems.length - 1;
      }
      if (column >= this.tempConfig.measureItems[nextRow].times.length) {
        nextColumn = 0;
        if (String(event.key).indexOf("Right") > -1 || event.key === "Enter") {
          nextRow = row + 1;
          if (nextRow === this.tempConfig.measureItems.length) {
            nextRow = 0;
          } else if (nextRow < 0) {
            nextRow = this.tempConfig.measureItems.length - 1;
          }
        }
      } else if (column < 0) {
        if (String(event.key).indexOf("Left") > -1) {
          nextRow = row - 1;
          if (nextRow === this.tempConfig.measureItems.length) {
            nextRow = 0;
          } else if (nextRow < 0) {
            nextRow = this.tempConfig.measureItems.length - 1;
          }
        }
        nextColumn = this.tempConfig.measureItems[nextRow].times.length - 1;
      }
      const nextCell = this.$refs.cell.find(
        vueComponent =>
          vueComponent.row === nextRow && vueComponent.column === nextColumn
      );
      if (nextCell && nextCell.editeable) {
        setTimeout(nextCell.startEditing(), 500);
      } else {
        setTimeout(currentCell.startEditing(), 500);
      }
    },
    cellBlur() {
      this.save(false);
    },
    makeTempPic() {
      const episodeID = this.patient.episodeID;
      const webIP = session.USER.WEBIP;
      datetTimeFormat.makeTempPic(episodeID, "0", webIP);
    }
  },
  components: {
    PatInfoBanner,
    CommonButton,
    MeasureCell,
    MeasureSelectCell,
    YlDatePicker: DatePicker
  }
};
</script>

<style>
:root {
  --MeasureSingle--colContentWidth: 130px;
  --MeasureSingle--colTitleWidth: 165px;
  --MeasureSingle--trHeight: 40px;
  --MeasureSingle--inputSpacing: 4px;
}

@import "../../assets/main.css";
@b MeasureSingle {
  text-align: center;
  @e patInfo {
    /* background-color: #f5f5f5; */
  }
  @e top {
    flex: 0 0 auto;
  }
  @e body {
    flex: 0 1 auto;
    overflow: auto;
  }
  @e tools {
    margin: 10px 200px 0 0;
  }
  @e footer {
    flex: 0 0 auto;
    display: inline-block;
    text-align: center;
    margin: 15px 0;
  }
  @e table {
    margin: 10px auto;
    border: 1px solid #ccc;
  }
  @e tr {
    border: 1px solid #ccc;
    height: var(--MeasureSingle--trHeight);
    & .el-input__inner {
      height: calc(
        var(--MeasureSingle--trHeight) -
          (var(--MeasureSingle--inputSpacing) * 2)
      );
    }
  }
  @e th {
    background-color: #f5f5f5;
    font-weight: normal;
    border: 1px solid #ccc;
  }
  @e td {
    text-align: center;
    border: 1px solid #ccc;
    &[colspan="3"] .el-input__inner {
      width: calc(
        (var(--MeasureSingle--colContentWidth) * 3) -
          (var(--MeasureSingle--inputSpacing) * 2)
      );
    }
    &[colspan="1"] .el-input__inner {
      width: calc(
        (var(--MeasureSingle--colContentWidth) * 1) -
          (var(--MeasureSingle--inputSpacing) * 2)
      );
    }
    &[colspan="6"] .el-input__inner {
      width: calc(
        (var(--MeasureSingle--colContentWidth) * 6) -
          (var(--MeasureSingle--inputSpacing) * 2)
      );
    }
  }
  @e colTitle {
    width: var(--MeasureSingle--colTitleWidth);
    align: center;
    valign: middle;
  }
  @e colContent {
    width: var(--MeasureSingle--colContentWidth);
    align: center;
    valign: middle;
  }
  @e symbol {
    line-height: 40px;
    display: inline-block;
    text-align: center;
    width: 40px;
    font-size: 18px;
    &:hover {
      background-color: #21ba45;
      color: #fff;
    }
  }
  @e symbolPopover {
    min-width: 50px !important;
    padding: 0 !important;
  }
}
</style>
