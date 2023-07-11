<template>
  <div class="MeasureMutiply"
       @contextmenu="onContextMenu"
       @mousedown="onMouseDown">
    <div class="MeasureMutiply__top">
      <yl-date-picker class="MeasureMutiply__datePicker"
                      v-model="searchDate"
                      :picker-options="pickerDateRange">
      </yl-date-picker>
      <el-time-select v-model="searchTime"
                      :picker-options="{ start: startTimePoint,step: '04:00',end: endTimePoint}">
      </el-time-select>
      &nbsp;
      <CommonButton width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="onSearchBtnClick">查询</CommonButton>
      &nbsp;
      <el-tooltip class="yl-tooltip__red"
                  placement="top"
                  effect="red"
                  :disabled="!errorShow"
                  content="您输入的值存在异常,请检查红色字体的值!">
        <CommonButton width="100"
                      @click="onSaveBtnClick(true)"
                      @blur="saveBtnBlur"
                      color="#ffffff"
                      border="#509de1"
                      background-color="#509de1">保存</CommonButton>
      </el-tooltip>
      <el-checkbox v-model="needMeasureModel"
                   style="margin-left:20px"
                   label="需测信息"></el-checkbox>
      <el-tooltip class="item"
                  effect="light"
                  placement="right"
                  content="打印病区病人测量信息!">
        <CommonButton width="100"
                      v-if="true"
                      @click="onPrintBtnClick"
                      color="#ffffff"
                      border="#509de1"
                      background-color="#509de1">打印</CommonButton>
      </el-tooltip>
      <i class="fa fa-cog fa-2x MeasureMutiply__settingIcon"
         @click="showDialogMutiplySetting"></i>
    </div>
    <div class="MeasureMutiply__body">
      <el-checkbox :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 5px 0;"></div>
      <el-checkbox-group v-model="measureItemGroup"
                         @change="handleCheckItemChange"
                         fill="#21ba45">
        <el-checkbox v-for="item in tempConfig.measureItems"
                     :style="{width:'130px'}"
                     :label="item.desc"
                     :key="item.code">{{item.desc}}</el-checkbox>
      </el-checkbox-group>

    </div>
    <div class="MeasureMutiply__footer">
      <div id="MeasureMutiplyTable"
           class="MeasureMutiply__tableWrapper">
        <div class="MeasureMutiply__tableHeadWrapper"
             ref="headWrapper">
          <table class="MeasureMutiply__table"
                 :style="getTableStyle">
            <colgroup>
              <col class="MeasureMutiply__colTitle"></col>
              <template v-for="measureItemDesc of cols">
                <col class="MeasureMutiply__colTitle"
                     :key="measureItemMap[measureItemDesc].code"></col>
              </template>
            </colgroup>
            <thead>
              <tr class="MeasureMutiply__tr">
                <th class="MeasureMutiply__th">床号</th>
                <th class="MeasureMutiply__th">姓名</th>
                <th class="MeasureMutiply__th">年龄</th>
                <template v-for="measureItemDesc of cols">
                  <th class="MeasureMutiply__th"
                      :key="measureItemMap[measureItemDesc].code">
                      {{measureItemMap[measureItemDesc].desc}}
                      {{measureItemMap[measureItemDesc].age}}
                      </th>
                </template>
                <th class="MeasureMutiply__th MeasureMutiply__getter"
                    style="width:17px"
                    v-if="scrollGetterShow"></th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="MeasureMutiply__tableBodyWrapper"
             @scroll="onBodyScroll"
             ref="bodyWrapper">
          <table class="MeasureMutiply__table"
                 :style="getTableStyle">
            <colgroup>
              <col class="MeasureMutiply__colTitle"></col>
              <template v-for="measureItemDesc of cols">
                <col class="MeasureMutiply__colTitle"
                     :key="measureItemMap[measureItemDesc].code"></col>
              </template>
            </colgroup>
            <tbody>
              <tr class="MeasureMutiply__tr"
                  :class="{'is-selected':row===selectedRow}"
                  v-for="(patient,row) of patients"
                  v-if="(!needMeasureModel)||(needMeasureModel&&measureInfo&&measureInfo[patient.episodeID]&&measureInfo[patient.episodeID][searchTime])"
                  :key="patient.episodeID">
                <td class="MeasureMutiply__td"
                    style="position:relative">
                  <span class="MeasureMutiply__bedCode">{{patient.bedCode}}</span>
                </td>
                <td class="MeasureMutiply__td"
                    style="position:relative">
                  <span class="MeasureMutiply__patName">{{patient.name}}</span>
                </td>
                <td class="MeasureMutiply__td"
                    style="position:relative">
                  <span class="MeasureMutiply__age">{{patient.age}}</span>
                </td>
                <template v-for="(measureItemDesc,column) of cols">
                  <MeasureCell class="MeasureMutiply__td"
                               v-if="!measureItemMap[measureItemDesc].select"
                               :item="measureItemMap[measureItemDesc]"
                               :key="measureItemMap[measureItemDesc].code"
                               :value="dayData[patient.episodeID]?dayData[patient.episodeID][measureItemMap[measureItemDesc].code]['value']:''"
                               @valueChange="valueChange"
                               @move="move"
                               @dblClick="cellDblClick"
                               @click="cellClick"
                               @mousedownRight="cellRightClick"
                               @cellBlur="cellBlur"
                               :editeable="ifPatTimeOK[patient.episodeID]&&(!measureItemMap[measureItemDesc].blank||(measureItemMap[measureItemDesc].blank&&dayData[patient.episodeID][measureItemMap[measureItemDesc].code+'_Title']['value']!==''))"
                               :row="row"
                               :column="column"
                               ref="cell">
                  </MeasureCell>
                  <MeasureSelectCell class="MeasureMutiply__td"
                                     v-if="measureItemMap[measureItemDesc].select"
                                     :item="measureItemMap[measureItemDesc]"
                                     :key="measureItemMap[measureItemDesc].code"
                                     :options="measureItemMap[measureItemDesc].options"
                                     :value="dayData[patient.episodeID]?dayData[patient.episodeID][measureItemMap[measureItemDesc].code]['value']:''"
                                     @valueChange="valueChange"
                                     @move="move"
                                     @dblClick="cellDblClick"
                                     @click="cellClick"
                                     @cellBlur="cellBlur"
                                     :row="row"
                                     :column="column"
                                     :disabled="!ifPatTimeOK[patient.episodeID]"
                                     ref="cell">
                  </MeasureSelectCell>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <el-popover ref="symbolPopover"
                placement="top-start"
                popper-class="MeasureMutiply__symbolPopover"
                trigger="hover">
      <template v-if="(currentEditColumn&&measureItemMap[measureItemGroup[currentEditColumn]].symbol)">
        <span v-for="(i,index) of measureItemMap[measureItemGroup[currentEditColumn]].symbol"
              :key="index"
              class="MeasureMutiply__symbol"
              @click="symbolClick(i)">
          {{i}}
        </span>
      </template>
    </el-popover>
    <component v-model="ifShowDialogEventEdit"
               :patient="selectedRow!==null?patients[selectedRow]:''"
               :is="dialogEventEditComponentName"></component>
    <component v-model="ifShowDialogDataDetail"
               :patient="selectedRow!==null?patients[selectedRow]:''"
               :measureItemsConfig="tempConfig.measureItems"
               :splitChar="tempConfig.splitChar"
               :is="dialogDataDetailComponentName"></component>
    <el-dialog :visible.sync="ifShowMeasureSingle"
               custom-class="MeasureMutiply__dialog"
               width="70%"
               top="1vh"       
               title="生命体征"
               :modal-append-to-body="false">
      <MeasureSingle :patient="selectedRow!==null?patients[selectedRow]:''"
                     @close="closeMeasureSingleDialog"
                     :dialog="true"
                     :tempConfig="tempConfig.singleConfig"></MeasureSingle>
    </el-dialog>
    <yl-menu :show='menuShow'
             :x='menuX'
             :y="menuY"
             @blur="onMenuBlur">
      <yl-menu-item text="预览"
                    @click="onMenuClick">
      </yl-menu-item>
      <yl-menu-item text="单人录入"
                    @click="onMenuClick">
      </yl-menu-item>
      <yl-menu-item text="事件登记"
                    @click="onMenuClick">
      </yl-menu-item>
      <yl-menu-item text="数据明细"
                    @click="onMenuClick">
      </yl-menu-item>
      <yl-menu-item text="修改记录"
                    @click="onMenuClick">
      </yl-menu-item>
    </yl-menu>
    <component v-model="ifShowDialogMutiplySetting"
               :is="dialogMutiplySettingComponentName"
               :dialog="true"
               :tempConfig="tempConfig"
               @updateSelectMutiplySetting="updateSelectMutiplySetting"
               dialogTitle="多人体温录入设置">
    </component>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters, mapMutations } from "vuex";
import CommonButton from "../../components/CommonButton";
import Menu from "../../components/Menu";
import MenuItem from "../../components/MenuItem";
import temperatureApi from "../../store/api/temperature";
import temperatureMeasureApi from "../../store/api/temperatureMeasure";
import DatePicker from "../../components/DatePicker";
import PatInfoBanner from "../bedChart/PatInfoBanner";
import MeasureCell from "./MeasureCell";
import MeasureSelectCell from "./MeasureSelectCell";
import MeasureSingle from "./MeasureSingle";
import utils from "../../comm/utils";
import printXlsApi from "../../store/api/printXls";
import printConfApi from "../../store/api/print";
import session from "../../store/api/session";

export default {
  name: "MeasureMutiply",
  props: {
    patients: Array,
    tempConfig: Object
  },
  data() {
    return {
      searchDate: new Date(),
      searchTime: "06:00",
      measureItemGroup: [],
      measureItemMap: Object,
      dayData: {},
      errorShow: false,
      scrollGetterShow: false,
      selectedRow: null,
      currentEditRow: null,
      currentEditColumn: null,
      ifShowDialogEventEdit: false,
      dialogEventEditComponentName: "",
      ifShowDialogDataDetail: false,
      dialogDataDetailComponentName: "",
      ifShowMeasureSingle: false,
      isIndeterminate: true,
      checkAll: false,
      menuShow: false,
      menuX: 100,
      menuY: 100,
      needMeasureModel: false,
      measureInfo: null,
      loadingInstance: null,
      ifShowDialogMutiplySetting: false,
      dialogMutiplySettingComponentName: "",
      pickerDateRange: {
        disabledDate: date => {
          const curDateTime = new Date();
          return utils.compareDate(date, curDateTime);
        }
      },
      ifPatTimeOK: {}
    };
  },
  components: {
    PatInfoBanner,
    CommonButton,
    MeasureCell,
    YlMenu: Menu,
    YlMenuItem: MenuItem,
    MeasureSelectCell,
    YlDatePicker: DatePicker,
    MeasureSingle,
    DialogEventEdit(resolve) {
      require.ensure(
        [],
        require => {
          resolve(require("./DialogEventEdit"));
        },
        "DialogEventEdit"
      );
    },
    DialogDataDetail(resolve) {
      require.ensure(
        [],
        require => {
          resolve(require("./DialogDataDetail"));
        },
        "DialogDataDetail"
      );
    },
    DialogMutiplySetting(resolve) {
      require.ensure(
        [],
        require => {
          resolve(require("./DialogMutiplySetting"));
        },
        "DialogMutiplySetting"
      );
    }
  },
  mounted() {
    if (this.tempConfig.measureItems) {
      this.tempConfig.measureItems.forEach(item => {
        this.measureItemMap[item.desc] = item;
      });
    }

    /* if (this.tempConfig.measureItems) {
      const initItemShow = ['temperature','pulse','breath','sysPressure','diaPressure','defFreq','Item38_NewTitle'];
      this.tempConfig.measureItems.forEach(item => {          
        console.log(item);
        if(initItemShow.indexOf(item.code)>-1){
          this.measureItemMap[item.desc] = item;
          this.measureItemGroup.push(item.desc);
        }          
      });
    }*/
  },
  computed: {
    ...mapGetters(["requestQueryFlag", "mutiplySetting"]),
    getTableStyle() {
      const count = this.cols.length + 2;
      return {
        width: `${count * 125}px`
      };
    },
    cols() {
      const cols = [];
      this.measureItemGroup.forEach(itemDesc => {
        if (!this.needMeasureModel) {
          cols.push(itemDesc);
        } else if (
          this.measureInfo &&
          this.measureInfo[this.measureItemMap[itemDesc].code]
        ) {
          cols.push(itemDesc);
        }
      });
      return cols;
    },
    startTimePoint() {
      if (this.tempConfig.times) {
        return `0${this.tempConfig.times[0]}:00`;
      }
      return `02:00`;
    },
    endTimePoint() {
      if (this.tempConfig.times) {
        return `${this.tempConfig.times[5]}:00`;
      }
      return `22:00`;
    }
  },
  watch: {
    requestQueryFlag(value) {
      if (value) {
        this.loadingInstance = this.$loading({
          target: ".MeasureMutiply__footer",
          text: "加载中"
        });
        this.initData();
      } else {
        return this.loadingInstance ? this.loadingInstance.close() : null;
      }
      return true;
    },
    needMeasureModel() {
      this.requestQuery();
    },
    measureItemGroup() {
      this.sycScrollGetter();
    },
    patients(data) {
      if (data.length !== 0) {
        this.requestQuery();
      } else {
        this.finishQuery();
      }
      this.sycScrollGetter();
    },
    tempConfig(val) {
      if (val.measureItems) {
        val.measureItems.forEach(item => {
          this.measureItemMap[item.desc] = item;
          const showItem = this.mutiplySetting.columnSetting;
          if (showItem.indexOf(item.code) > -1) {
            this.measureItemGroup.push(item.desc);
          }
        });
      }
      if (val.times) {
        this.getCurrTimePoint();
      }
    },
    searchTime(val) {
      const time = utils.formatTime(val);
      if (time !== "") {
        this.requestQuery();
      }
    },
    searchDate(val) {
      const date = utils.formatDate(val);
      if (date !== "") {
        this.requestQuery();
      }
    },
    ifShowMeasureSingle(val) {
      if (!val) {
        this.requestQuery();
      }
    }
  },
  methods: {
    ...mapMutations(["requestQuery", "finishQuery"]),
    initData() {
      const promiseArray = [];
      promiseArray.push(
        this.getPatientsTempDataByTime(
          this.patients,
          utils.formatDate(this.searchDate),
          this.searchTime
        )
      );
      if (this.patients.length > 0) {
        promiseArray.push(
          this.ifTimeCanInput(
            this.patients,
            utils.formatDate(this.searchDate),
            this.searchTime,
            session.USER.WARDID
          )
        );
      }
      if (this.needMeasureModel) {
        promiseArray.push(this.initNeedMearsureInfo());
      }
      axios.all(promiseArray).then(() => this.finishQuery());
    },
    ifTimeCanInput(patients, date, time, wardID) {
      const { ifTimeCanInput } = temperatureApi;
      const episodeIDArray = [];
      patients.forEach(patient => {
        episodeIDArray.push(patient.episodeID);
      });
      return ifTimeCanInput(
        episodeIDArray.join("^"),
        utils.formatDate(date),
        utils.formatTime(time),
        wardID
      ).then(retData => {
        this.ifPatTimeOK = retData;
        return true;
      });
    },
    getPatientsTempDataByTime(patients, date, time) {
      const { getPatientsTempDataByTime } = temperatureApi;
      const episodeIDArray = [];
      patients.forEach(patient => {
        episodeIDArray.push(patient.episodeID);
      });
      return getPatientsTempDataByTime(
        episodeIDArray,
        utils.formatDate(date),
        utils.formatTime(time)
      ).then(dayData => {
        Object.keys(dayData).forEach(episodeID => {
          Object.keys(dayData[episodeID]).forEach(itemCode => {
            dayData[episodeID][itemCode].originalValue =
              dayData[episodeID][itemCode].value;
          });
        });
        this.dayData = dayData;
        return true;
      });
    },
    initNeedMearsureInfo() {
      const { getNeedMeasureInfo } = temperatureMeasureApi;
      const episodeIDArray = this.patients.map(patient => patient.episodeID);
      return getNeedMeasureInfo(
        episodeIDArray,
        utils.formatDate(this.searchDate),
        this.searchTime
      ).then(result => {
        this.measureInfo = typeof result === "object" ? result : null;
        return true;
      });
    },
    closeMeasureSingleDialog() {
      this.ifShowMeasureSingle = false;
    },
    /* ifBeforInDeptDateTime(patient, code) {
      const date = utils.formatDate(this.searchDate);
      const inDeptDate = utils.formatDate(patient.inDeptDateTime.split(" ")[0]);
      const inDeptDateTime = `${inDeptDate} ${
        patient.inDeptDateTime.split(" ")[1]
      }`;
      const inDeptDateObj = new Date(inDeptDateTime.replace(/-/g, "/"));
      const minusInDeptDateObj = new Date(
        inDeptDateObj.valueOf() - 2 * 60 * 60 * 1000
      );
      let cellDateTime = `${date.replace(/-/g, "/")} ${this.searchTime}`;
      cellDateTime = new Date(cellDateTime);
      return (
        // new Date(inDeptDateTime.replace(/-/g, "/"))
        cellDateTime > minusInDeptDateObj &&
        (!this.needMeasureModel ||
          (this.needMeasureModel &&
            this.measureInfo[patient.episodeID] &&
            this.measureInfo[patient.episodeID][this.searchTime] &&
            this.measureInfo[patient.episodeID][this.searchTime][code]))
      );
    }, */
    symbolClick(value) {
      const { episodeID } = this.patients[this.currentEditRow];
      const itemDesc = this.measureItemGroup[this.currentEditColumn];
      const itemCode = this.measureItemMap[itemDesc].code;
      const editValue = `${this.dayData[episodeID][itemCode].value}${value}`;
      this.valueChange(
        editValue,
        false,
        this.currentEditRow,
        this.currentEditColumn
      );
    },
    onContextMenu(event) {
      event.returnValue = false;
      event.preventDefault();
      return false;
    },
    onMouseDown(event) {
      if (event.button === 2 && this.selectedRow !== null) {
        this.menuShow = true;
        this.menuX = event.clientX;
        this.menuY = event.clientY;
      }
    },
    onMenuClick(text) {
      this.menuShow = false;
      if (text === "预览") {
        /* global window */
        const episodeID = this.patients[this.selectedRow].episodeID;
        window.TempShow(episodeID);
        return;
      }
      if (text === "事件登记") {
        this.dialogEventEditComponentName = "DialogEventEdit";
        this.ifShowDialogEventEdit = true;
        return;
      }
      if (text === "数据明细") {
        this.dialogDataDetailComponentName = "DialogDataDetail";
        this.ifShowDialogDataDetail = true;
        return;
      }
      if (text === "单人录入") {
        this.ifShowMeasureSingle = true;
      }
      if (text === "修改记录") {
        /* global window */
        const episodeID = this.patients[this.selectedRow].episodeID;
        const lnk = `DHCNurEmrComm.csp?a=a&EmrCode=DHCNURTEMMODIED&EpisodeID=${episodeID}`;
        window.open(
          lnk,
          "htm",
          "toolbar=no,location=no,directories=no,resizable=yes,width=900,height=600,left=50,top=90"
        );
      }
    },
    onMenuBlur() {
      this.menuShow = false;
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
      if (
        this.measureItemGroup[column] &&
        this.measureItemMap[this.measureItemGroup[column]].symbol
      ) {
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
    onSaveBtnClick(ifShowMessage) {
      const searchDate = utils.formatDate(this.searchDate);
      if (!searchDate) {
        this.$message.error("日期格式错误!");
        return;
      }
      const searchTime = utils.formatTime(this.searchTime);
      if (!searchTime) {
        this.$message.error("时间格式错误!");
        return;
      }
      let editItemValueString = "";
      const editItemData = {};
      const episodeIDSplitChar = this.tempConfig.splitChar.episodeIDSplitChar;
      const episodeIDValueSplitChar = this.tempConfig.splitChar
        .episodeIDValueSplitChar;
      const codeSplitChar = this.tempConfig.splitChar.codeSplitChar;
      const codeValueSplitChar = this.tempConfig.splitChar.codeValueSplitChar;
      Object.keys(this.dayData).forEach(episodeID => {
        this.measureItemGroup.forEach(desc => {
          const itemCode = this.measureItemMap[desc].code;
          if (!this.errorShow && this.dayData[episodeID][itemCode].error) {
            this.errorShow = true;
          } else if (
            !this.errorShow &&
            this.dayData[episodeID][itemCode].edit &&
            !this.dayData[episodeID][itemCode].error
          ) {
            // 拼接编辑过的值
            const valueString = `${itemCode}${codeValueSplitChar}${
              this.dayData[episodeID][itemCode].value
            }`;
            editItemData[episodeID] = editItemData[episodeID]
              ? `${editItemData[episodeID]}${codeSplitChar}${valueString}`
              : valueString;
          }
        });
      });
      Object.keys(editItemData).forEach(episodeID => {
        const valueString = `${episodeID}${episodeIDValueSplitChar}${
          editItemData[episodeID]
        }`;
        editItemValueString = editItemValueString
          ? `${editItemValueString}${episodeIDSplitChar}${valueString}`
          : valueString;
      });
      if (!this.errorShow && editItemValueString !== "") {
        temperatureApi
          .saveObsDataByTime(editItemValueString, searchDate, searchTime)
          .then(ret => {
            if (ret === 0) {
              this.requestQuery();
              if (ifShowMessage) {
                this.$message({
                  type: "success",
                  message: "保存成功!",
                  showClose: true
                });
              }
            } else {
              this.$message({
                type: "error",
                message: "保存失败!",
                showClose: true
              });
            }
          });
      } else if (editItemValueString === "" && !this.errorShow) {
        if (ifShowMessage) {
          this.$message({
            type: "error",
            message: "没有需要保存的值!",
            showClose: true
          });
        }
      }
    },
    saveBtnBlur() {
      this.errorShow = false;
    },
    onSearchBtnClick() {
      this.requestQuery();
    },
    timeSelectBlur(timeSelect) {
      this.searchTime = timeSelect.$children[0].currentValue;
    },
    onNeedMeasureBtnClick() {
      return "";
    },
    valueChange(value, error, row, column) {
      const { episodeID } = this.patients[row];
      const { code } = this.measureItemMap[this.cols[column]];
      this.dayData[episodeID][code].value = value;
      this.dayData[episodeID][code].error = error;
      const { originalValue } = this.dayData[episodeID][code];
      this.dayData[episodeID][code].edit =
        String(originalValue) !== String(value);
    },
    move(row, column, event, currentCell) {
      currentCell.stopEditing();
      let nextColumn = column;
      let nextRow = row;
      if (column === this.measureItemGroup.length) {
        nextColumn = 0;
        nextRow = row + 1;
      } else if (column < 0) {
        nextColumn = this.measureItemGroup.length - 1;
        nextRow = row - 1;
      }
      if (nextRow === this.patients.length) {
        nextRow = 0;
      } else if (nextRow < 0) {
        nextRow = this.patients.length - 1;
      }
      const nextCell = this.$refs.cell.find(
        vueComponent =>
          vueComponent.row === nextRow && vueComponent.column === nextColumn
      );
      if (nextCell) {
        setTimeout(nextCell.startEditing(), 500);
      }
    },
    handleCheckItemChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.tempConfig.measureItems.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.tempConfig.measureItems.length;
    },
    handleCheckAllChange(value) {
      this.measureItemGroup = value
        ? this.tempConfig.measureItems.map(item => item.desc)
        : [];
      this.isIndeterminate = false;
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    onPrintBtnClick() {
      const tHeader = ["床号", "姓名", "年龄"];
      this.cols.forEach(col => tHeader.push(col));
      if (this.patients.length > 0) {
        printConfApi.getXlsPath().then(templatePath => {
          if (String(templatePath).replace("/r/n", "")) {
            printXlsApi.printByExcel(
              String(templatePath).replace("/r/n", ""),
              tHeader,
              this.patients,
              utils.formatDate(this.searchDate),
              this.searchTime
            );
          } else {
            this.$message({
              type: "error",
              message: "无法获取打印模板!",
              showClose: true
            });
          }
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择患者！!",
          showClose: true
        });
      }

      /* require.ensure([], () => {
        const { export_json_to_excel } = require("@/comm/Export2Excel");
        const filterVal = ["bedCode", "name"];
        const data = this.formatJson(filterVal, this.patients);
        export_json_to_excel(tHeader, data, "列表excel");
      });*/
      /* global window */
      // window.print();
      // utils.printByElementID("MeasureMutiplyTable");
    },
    getCurrTimePoint() {
      const currTime = new Date();
      const currHours = currTime.getHours();
      if (this.tempConfig.times) {
        this.tempConfig.times.forEach(timePoint => {
          if (currHours >= timePoint - 2 && currHours < timePoint + 2) {
            this.searchTime =
              timePoint < 10 ? `0${timePoint}:00` : `${timePoint}:00`;
          }
        });
      }
    },
    showDialogMutiplySetting() {
      this.dialogMutiplySettingComponentName = "dialog-mutiply-setting";
      this.ifShowDialogMutiplySetting = true;
    },
    updateSelectMutiplySetting(columnSetting) {
      this.measureItemGroup = [];
      if (this.tempConfig.measureItems) {
        columnSetting.forEach(column => {
          const measureItem = this.tempConfig.measureItems.find(
            item => item.code === column
          );
          if (
            measureItem &&
            this.measureItemGroup.indexOf(measureItem.desc) < 0
          ) {
            this.measureItemGroup.push(measureItem.desc);
          }
        });
      }
    },
    cellBlur(measureCell) {
      const searchDate = utils.formatDate(this.searchDate);
      if (!searchDate) {
        this.$message.error("日期格式错误!");
        return;
      }
      const searchTime = utils.formatTime(this.searchTime);
      if (!searchTime) {
        this.$message.error("时间格式错误!");
        return;
      }
      let editItemValueString = "";
      const dateTimeSplitChar = this.tempConfig.splitChar.dateTimeSplitChar;
      const codeValueSplitChar = this.tempConfig.splitChar.codeValueSplitChar;
      const dateTimeString = `${searchDate}${dateTimeSplitChar}${searchTime}${dateTimeSplitChar}`;
      const codeValueString = `${measureCell.item.code}${codeValueSplitChar}${
        measureCell.value
      }`;
      editItemValueString = `${dateTimeString}${codeValueString}`;
      const { episodeID } = this.patients[measureCell.row];
      if (!this.errorShow && editItemValueString !== "") {
        temperatureApi.saveObsData(episodeID, editItemValueString);
      }
      // this.onSaveBtnClick(false);
    }
  }
};
</script>

<style>
@import "../../assets/common.css";
:root {
  --MeasureMutiply--colContentWidth: 125px;
  --MeasureMutiply--colTitleWidth: 125px;
  --MeasureMutiply--trHeight: 40px;
  --MeasureMutiply--inputSpacing: 4px;
}
@b MeasureMutiply {
  overflow: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: stretch;
  @e top {
    margin: 8px;
    margin-bottom: 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #ccc;
  }
  @e body {
    margin: 4px 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #ccc;
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
    top: 40px;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @e table {
    /* margin-left: auto;
    margin-right: auto; */
    table-layout: fixed;
    border: 1px solid #dee0df;
    color: #5e5e5e;
  }
  @e tr {
    height: var(--MeasureMutiply--trHeight);
    & .el-input__inner {
      height: calc(
        var(--MeasureMutiply--trHeight) -
          (var(--MeasureMutiply--inputSpacing) * 2)
      );
    }
    @when selected {
      background-color: #d9e7f1;
    }
  }
  @e th {
    background-color: #f4f6f5;
    font-weight: bold;
    border: 1px solid #dee0df;
    text-overflow: clip;
    white-space: nowrap;
    overflow: hidden;
    font-size: 15px;
    width: var(--MeasureMutiply--colContentWidth);
  }
  @e getter {
    visibility: hidden;
  }
  @e td {
    text-overflow: clip;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
    border: 1px solid #ccc;
    width: var(--MeasureMutiply--colContentWidth);
    & .el-input__inner {
      width: calc(var(--MeasureMutiply--colContentWidth) - 8);
    }
  }
  @e colTitle {
    width: var(--MeasureMutiply--colTitleWidth);
    align: center;
    valign: middle;
  }
  @e footer {
    flex: 1;
    padding: 10px;
    overflow: auto;
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
  @e dialog {
    & .el-dialog__title {
      color: #fff;
    }
  }
  & .el-dialog__body {
    padding-top: 0;
  }
  @e bedCode {
    vertical-align: bottom;
    text-align: right;
  }
  @e bedTag {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 25px;
    background-color: var(--mainColor);
    color: white;
    font-size: 12px;
    line-height: 12px;
    text-align: center;
  }
  @e patName {
    vertical-align: bottom;
    text-align: right;
  }
  @e settingIcon {
    position: relative;
    float: right;
    &:hover {
      cursor: pointer;
      animation: fa-spin 2s infinite linear;
    }
  }
  & .el-dialog {
    overflow-y: scroll;
  }
}
@media print {
  title {
    display: none;
  }
  .MeasureMutiply__top {
    display: none;
  }
  .MeasureMutiply__body {
    display: none;
  }
  .patientTree {
    display: none;
  }
  .TemperatureMeasureMutiply__patientTree {
    display: none;
  }
}
</style>
