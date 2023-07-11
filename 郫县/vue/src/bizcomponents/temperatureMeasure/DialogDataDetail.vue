<template>
  <el-dialog
    :visible.sync="ifShow"
    @close="closeDialog"
    custom-class="DialogDataDetail"
    width="90%"
    title="数据明细"
    :modal-append-to-body="false"
  >
    <PatInfoBanner :patInfo="patient" class="DialogDataDetail__patInfo"></PatInfoBanner>
    <div class="DialogDataDetail__toolbar">
      <yl-date-picker class="DialogDataDetail__datePicker" v-model="startDate"></yl-date-picker>-&nbsp;&nbsp;
      <yl-date-picker class="DialogDataDetail__datePicker" v-model="endDate"></yl-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <CommonButton
        width="100"
        color="#ffffff"
        border="#509de1"
        background-color="#509de1"
        @click="onSearchBtnClick"
      >查询</CommonButton>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
      <CommonButton
        width="100"
        color="#ffffff"
        border="#509de1"
        background-color="#fe9a4a"
        @click="onSaveBtnClick"
      >保存</CommonButton>
    </div>
    <div class="DialogDataDetail__footer">
      <div class="DialogDataDetail__tableWrapper">
        <div class="DialogDataDetail__tableHeadWrapper" ref="headWrapper">
          <table class="DialogDataDetail__table" :style="getTableStyle">
            <colgroup>
              <template v-for="measureItem of measureItems">
                <col class="DialogDataDetail__colTitle" :key="measureItem.code">
              </template>
            </colgroup>
            <thead>
              <tr class="DialogDataDetail__tr">
                <template v-for="measureItem of measureItems">
                  <th class="DialogDataDetail__th" :key="measureItem.code">{{measureItem.desc}}</th>
                </template>
                <th
                  class="DialogDataDetail__th DialogDataDetail__getter"
                  style="width:17px"
                  v-if="scrollGetterShow"
                ></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="DialogDataDetail__tableBodyWrapper" @scroll="onBodyScroll" ref="bodyWrapper">
          <table class="DialogDataDetail__table" :style="getTableStyle">
            <colgroup>
              <template v-for="measureItem of measureItems">
                <col class="DialogDataDetail__colTitle" :key="measureItem.code">
              </template>
            </colgroup>
            <tbody>
              <tr
                class="DialogDataDetail__tr"
                :class="{'is-selected':row===selectedRow}"
                v-for="(data,row) of tempData"
                :key="data.date+data.time"
              >
                <template v-for="(measureItem,column) of measureItems">
                  <MeasureCell
                    class="DialogDataDetail__td"
                    v-if="!measureItem.select"
                    :item="measureItem"
                    :key="measureItem.code"
                    :value="tempData[row][measureItem.code]['value']"
                    @valueChange="valueChange"
                    @move="move"
                    @dblClick="cellDblClick"
                    @click="cellClick"
                    @mousedownRight="cellRightClick"
                    :editeable="measureItem.code!=='date'&&measureItem.code!=='time'"
                    :row="row"
                    :column="column"
                    ref="cell"
                  ></MeasureCell>
                  <MeasureSelectCell
                    class="DialogDataDetail__td"
                    v-if="measureItem.select"
                    :item="measureItem"
                    :key="measureItem.code"
                    :options="measureItem.options"
                    :value="tempData[row][measureItem.code]['value']"
                    @valueChange="valueChange"
                    @move="move"
                    @dblClick="cellDblClick"
                    @click="cellClick"
                    :row="row"
                    :column="column"
                    ref="cell"
                  ></MeasureSelectCell>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <el-popover
      ref="symbolPopover"
      placement="top-start"
      popper-class="DialogDataDetail__symbolPopover"
      trigger="hover"
    >
      <template v-if="(currentEditColumn&&measureItems[currentEditColumn].symbol)">
        <span
          v-for="i of measureItems[currentEditColumn].symbol"
          class="DialogDataDetail__symbol"
          :key="`detailItem${i}`"
          @click="symbolClick(i)"
        >{{i}}</span>
      </template>
    </el-popover>
  </el-dialog>
</template>
<script>
import datetTimeFormat from "../../comm/utils";
import DatePicker from "../../components/DatePicker";
import CommonButton from "../../components/CommonButton";
import PatInfoBanner from "../bedChart/PatInfoBanner";
import temperatureApi from "../../store/api/temperature";
import MeasureCell from "./MeasureCell";
import MeasureSelectCell from "./MeasureSelectCell";

export default {
  name: "DialogDataDetail",
  props: ["value", "patient", "measureItemsConfig", "splitChar"],
  data() {
    return {
      ifShow: false,
      startDate: null,
      endDate: null,
      tempData: {},
      errorShow: false,
      scrollGetterShow: false,
      selectedRow: null,
      currentEditRow: null,
      currentEditColumn: null,
      measureItems: []
    };
  },
  components: {
    YlDatePicker: DatePicker,
    CommonButton,
    PatInfoBanner,
    MeasureCell,
    MeasureSelectCell
  },
  mounted() {
    this.ifShow = true;
    const dateColumn = {
      code: "date",
      desc: "日期"
    };
    const timeColumn = {
      code: "time",
      desc: "时间"
    };
    this.measureItems = [dateColumn, timeColumn].concat(
      this.measureItemsConfig
    );
    this.init();
    this.initData();
  },
  computed: {
    getTableStyle() {
      const count = this.measureItems.length;
      return {
        width: `${count * 80}px`
      };
    }
  },
  watch: {
    value(value) {
      this.ifShow = value;
      if (value) {
        this.init();
        this.initData();
      } else {
        this.tempData = [];
      }
    },
    measureItemsConfig(value) {
      const dateColumn = {
        code: "date",
        desc: "日期"
      };
      const timeColumn = {
        code: "time",
        desc: "时间"
      };
      this.measureItems = [dateColumn, timeColumn].concat(value);
    }
  },
  methods: {
    init() {
      const today = new Date();
      this.startDate = new Date(today.setDate(new Date().getDate() - 2));
      this.endDate = new Date();
    },
    initData() {
      this.getPatientTempDataByDateArea(
        this.patient.episodeID,
        this.startDate,
        this.endDate
      );
    },
    getPatientTempDataByDateArea(episodeID, startDate, endDate) {
      const { getPatientTempDataByDateArea } = temperatureApi;
      getPatientTempDataByDateArea(
        episodeID,
        datetTimeFormat.formatDate(startDate),
        datetTimeFormat.formatDate(endDate)
      ).then(tempData => {
        tempData.forEach(data => {
          Object.keys(data).forEach(itemCode => {
            data[itemCode].originalValue = data[itemCode].value;
          });
        });
        this.tempData = tempData;
        this.sycScrollGetter();
      });
    },
    symbolClick(value) {
      const itemCode = this.measureItems[this.currentEditColumn].code;
      const editValue = `${
        this.tempData[this.currentEditRow][itemCode].value
      }${value}`;
      this.valueChange(
        editValue,
        false,
        this.currentEditRow,
        this.currentEditColumn
      );
    },
    closeDialog() {
      this.ifShow = false;
      this.$emit("input", this.ifShow);
    },
    onSearchBtnClick() {
      this.initData();
    },
    onSaveBtnClick() {
      let editItemValueString = "";
      const editItemData = {};
      const dateTimeSplitChar = this.splitChar.dateTimeSplitChar;
      const dateSplitChar = this.splitChar.dateSplitChar;
      const codeSplitChar = this.splitChar.codeSplitChar;
      const codeValueSplitChar = this.splitChar.codeValueSplitChar;
      this.tempData.forEach(singleTempData => {
        this.measureItems.forEach(measureItem => {
          const date = singleTempData.date.value;
          const time = singleTempData.time.value;
          const dateTime = `${date}${dateTimeSplitChar}${time}`;
          const itemCode = measureItem.code;
          if (!this.errorShow && singleTempData[itemCode].error) {
            this.errorShow = true;
          } else if (
            !this.errorShow &&
            singleTempData[itemCode].edit &&
            !singleTempData[itemCode].error
          ) {
            // 拼接编辑过的值
            const valueString = `${itemCode}${codeValueSplitChar}${
              singleTempData[itemCode].value
            }`;
            editItemData[dateTime] = editItemData[dateTime]
              ? `${editItemData[dateTime]}${codeSplitChar}${valueString}`
              : valueString;
          }
        });
      });
      Object.keys(editItemData).forEach(dateTime => {
        const date = dateTime.split(dateTimeSplitChar)[0];
        const time = dateTime.split(dateTimeSplitChar)[1];
        const valueString = `${date}${dateTimeSplitChar}${time}${dateTimeSplitChar}${
          editItemData[dateTime]
        }`;
        editItemValueString = editItemValueString
          ? `${editItemValueString}${dateSplitChar}${valueString}`
          : valueString;
      });
      if (!this.errorShow && editItemValueString !== "") {
        temperatureApi
          .saveObsData(this.patient.ID, editItemValueString)
          .then(ret => {
            if (ret === 0) {
              this.initData();
              this.$message.success("保存成功!");
            } else {
              this.$message.error("保存失败!");
            }
          });
      } else if (editItemValueString === "" && !this.errorShow) {
        this.$message.error("没有需要保存的值!");
      }
    },
    cellClick(row) {
      this.selectedRow = row;
    },
    cellDblClick(row) {
      this.selectedRow = row;
    },
    cellRightClick(row, column, event, cell) {
      this.currentEditColumn = column;
      this.currentEditRow = row;
      if (this.measureItems[column].symbol) {
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
    sycScrollGetter() {
      this.$nextTick(() => {
        if (this.$refs.bodyWrapper) {
          const scrollWidth = this.$refs.bodyWrapper.scrollWidth;
          const clientWidth = this.$refs.bodyWrapper.clientWidth;
          const scrollHeight = this.$refs.bodyWrapper.scrollHeight;
          const clientHeight = this.$refs.bodyWrapper.clientHeight;
          this.scrollGetterShow =
            scrollWidth > clientWidth || scrollHeight > clientHeight;
        }
      });
    },
    onBodyScroll() {
      const scrollLeft = this.$refs.bodyWrapper.scrollLeft;
      if (scrollLeft > 0) {
        this.scrollGetterShow = true;
      }
      this.$refs.headWrapper.scrollLeft = scrollLeft;
    },
    valueChange(value, error, row, column) {
      const { code } = this.measureItems[column];
      this.tempData[row][code].value = value;
      this.tempData[row][code].error = error;
      const { originalValue } = this.tempData[row][code];
      this.tempData[row][code].edit = String(originalValue) !== String(value);
    },
    move(row, column, event, currentCell) {
      currentCell.stopEditing();
      let nextColumn = column;
      let nextRow = row;
      if (nextColumn === this.measureItems.length) {
        nextColumn = 2;
        nextRow = row + 1;
      } else if (nextColumn < 2) {
        nextColumn = this.measureItems.length - 1;
        nextRow = row - 1;
      }
      if (nextRow === this.tempData.length) {
        nextRow = 0;
      } else if (nextRow < 0) {
        nextRow = this.tempData.length - 1;
      }
      const nextCell = this.$refs.cell.find(
        vueComponent =>
          vueComponent.row === nextRow && vueComponent.column === nextColumn
      );
      if (nextCell) {
        setTimeout(nextCell.startEditing(), 500);
      }
    }
  }
};
</script>
<style >
:root {
  --DialogDataDetail--colContentWidth: 90px;
  --DialogDataDetail--colTitleWidth: 90px;
  --DialogDataDetail--trHeight: 35px;
  --DialogDataDetail--inputSpacing: 4px;
}

@b DialogDataDetail {
  & .el-dialog__title {
    color: #fff;
    font-size: 16px;
    font-weight: normal;
  }
  & .el-dialog__body {
    padding-top: 0;
  }
  @e datePicker {
    margin-right: 10px;
  }
  @e toolbar {
    width: 100%;
    height: 40px;
    padding-top: 10px;

    /* margin-bottom: 10px;
    border-bottom: 1px solid #ccc; */
  }
  @e tableWrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }
  @e tableHeadWrapper {
    overflow: hidden;
  }
  @e tableBodyWrapper {
    overflow: auto;
    position: absolute;
    top: 35px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  @e table {
    margin-left: auto;
    margin-right: auto;
    table-layout: fixed;
    border: 1px solid #dee0df;
    color: #5e5e5e;
  }
  @e tr {
    height: var(--DialogDataDetail--trHeight);
    & .el-input__inner {
      height: calc(
        var(--DialogDataDetail--trHeight) -
          (var(--DialogDataDetail--inputSpacing) * 2)
      );
    }
    @when selected {
      background-color: #d9e7f1;
    }
  }
  @e th {
    /* background-color: #f4f6f5; */
    font-weight: normal;
    border: 1px solid #dee0df;
    font-weight: 700;
    text-overflow: clip;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    padding-left: 10px;
  }
  @e getter {
    visibility: hidden;
  }
  @e td {
    text-overflow: clip;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    padding-left: 10px;
    border: 1px solid #ccc;
    width: var(--DialogDataDetail--colContentWidth);
    & .el-input__inner {
      width: calc(var(--DialogDataDetail--colContentWidth) - 8);
    }
  }
  @e colTitle {
    width: var(--DialogDataDetail--colTitleWidth);
    align: center;
    valign: middle;
  }
  @e footer {
    height: 400px;
    padding: 10px;
    padding-left: 0;
    overflow: auto;
    padding-top: 0;
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
