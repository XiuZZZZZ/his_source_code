<template>
  <div class="orderExcute">
    <ul class="orderExcute__searchUl">
      <li class="orderExcute__searchLi">
        <span class="orderExcute__datePickerLabel">开始时间</span>
        <span class="orderExcute__datePickerLabel">结束时间</span>
      </li>
      <li class="orderExcute__searchLi">
        <yl-date-picker
          class="orderExcute__datePicker"
          align="right"
          type="date"
          :value="searchInfo.startDate"
          @input="onStartDateChange"
          :picker-options="pickerStartDateRange"
        ></yl-date-picker>
        <yl-date-picker
          class="orderExcute__datePicker"
          align="right"
          type="date"
          :value="searchInfo.endDate"
          @input="onEndDateChange"
          :picker-options="pickerEndDateRange"
        ></yl-date-picker>
      </li>
      <li class="orderExcute__searchLi">
        <el-time-select
          class="orderExcute__timeSelect"
          v-model="searchInfo.startTime"
          :picker-options="timeOption"
        ></el-time-select>
        <el-time-select
          class="orderExcute__timeSelect"
          v-model="searchInfo.endTime"
          :picker-options="timeOption"
        ></el-time-select>
        <!--  <el-time-select class="orderExcute__timeSelect"
                        :value="searchInfo.startTime"
                        @input="onStartTimeChange"
                        @blur="startTimeSelectBlur"
                        :picker-options="timeOption">
        </el-time-select>
        <el-time-select class="orderExcute__timeSelect"
                        :value="searchInfo.endTime"
                        @input="onEndTimeChange"
                        @blur="endTimeSelectBlur"
                        :picker-options="timeOption">
        </el-time-select>-->
      </li>
      <li class="orderExcute__searchLi">
        <div class="orderExcute__switch">
          <el-switch
            :value="searchInfo.doctorOrderFlag"
            @input="onDoctorOrderFlagChange"
            active-text="医生医嘱"
            inactive-text="护士医嘱"
          ></el-switch>
        </div>
        <div class="orderExcute__switch">
          <el-switch
            :value="searchInfo.createOrderFlag"
            @input="onCreateOrderFlagChange"
            active-text="开医嘱时间"
            inactive-text="要求执行时间"
          ></el-switch>
        </div>
      </li>
      <li class="orderExcute__searchLi">
        <div class="orderExcute__checkBox">
          <el-checkbox
            :value="searchInfo.longOrderFlag"
            @input="onLongOrderFlagChange"
            >长期</el-checkbox
          >
        </div>
        <div class="orderExcute__checkBox">
          <el-checkbox
            :value="searchInfo.tempOrderFlag"
            @input="onTempOrderFlagChange"
            >临时</el-checkbox
          >
        </div>
      </li>
      <li class="orderExcute__searchLi">
        <div class="orderExcute__checkBox">
          <el-checkbox
            :value="searchInfo.longOrderNotNewFlag"
            @input="onLongOrderNotNewFlagChange"
            >非长期</el-checkbox
          >
        </div>
      </li>
      <li class="orderExcute__searchLi" style="align: left">
        <div class="orderExcute__checkBox">
          <el-checkbox
            :value="searchInfo.excutedOrderFlag"
            @input="onExcutedOrderFlagChange"
            >已执行</el-checkbox
          >
        </div>
        <div class="orderExcute__checkBox">
          <el-checkbox
            :value="searchInfo.printedOrderFlag"
            @input="onPrintedOrderFlagChange"
            >已打印</el-checkbox
          >
        </div>
      </li>
      <li class="orderExcute__searchLi">
        <common-button
          class="orderExcute__searchBtn"
          @click="onSearchBtnClick"
          width="80"
          color="#ffffff"
          border="#509de1"
          background-color="#509de1"
          >查询</common-button
        >
      </li>
      <li class="orderExcute__readCardLi" v-if="session.USER.CTLOCID == '187'">
        <!-- <li class="orderExcute__readCardLi" v-if="session.USER.CTLOCID=='366'"> -->
        <el-input
          id="CardNo"
          @keyup.enter="onReadCardBtnClick"
          v-model="input1"
          placeholder="卡号"
          style="width: 200px"
        ></el-input>
      </li>
      <!--<li class="orderExcute__searchLi">    
        <div class="orderExcute__disposeStat">
         <el-tag type="info" size="mini" class="orderExcute__disposeStat--Temp" >需执行</el-tag>
         <el-tag type="info" size="mini" class="orderExcute__disposeStat--NeedToStop" >停止需处理</el-tag>
         <el-tag type="info" size="mini" class="orderExcute__disposeStat--AlreadyStop" >停止已处理</el-tag>
         <el-tag type="info" size="mini" class="orderExcute__disposeStat--LongUnnew" >非新长嘱</el-tag>
        </div>
        <div class="orderExcute__disposeStat">
          <el-tag type="info" size="mini" class="orderExcute__disposeStat--SkinTest" >皮试</el-tag>
          <el-tag type="info" size="mini" class="orderExcute__disposeStat--LongNew" >新开长嘱</el-tag>
          <el-tag type="info" size="mini" class="orderExcute__disposeStat--Discontinue" >需停止执行</el-tag>
          <el-tag type="info" size="mini" class="orderExcute__disposeStat--Exec" >已执行</el-tag>
        </div>
      </li>-->
      <!--<li class="orderExcute__searchLi">
        <common-button class="orderExcute__searchBtn"
                       @click="onPrintHistoryBtnClick"
                       width="80">打印日志</common-button>
      </li>-->
    </ul>
    <ul class="orderExcute__disposeStat">
      <li>
        <el-tag type="info" size="mini" class="orderExcute__disposeStat--Temp"
          >需执行</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--NeedToStop"
          >停止需处理</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--AlreadyStop"
          >停止已处理</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--LongUnnew"
          >非新长嘱</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--SkinTest"
          >皮试</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--LongNew"
          >新开长嘱</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--Discontinue"
          >需停止执行</el-tag
        >
        <el-tag type="info" size="mini" class="orderExcute__disposeStat--Exec"
          >已执行</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--SkinTestAbnorm"
          >皮试阳性</el-tag
        >
        <el-tag
          type="info"
          size="mini"
          class="orderExcute__disposeStat--SkinTestNorm"
          >皮试阴性</el-tag
        >
        <!-- <common-button class="orderExcute__sheetConfigBtn"
                       @click="onSheetConfigBtnClick"
                       width="80"
                       color="#ffffff"
                       border="#509de1"
        background-color="#509de1">单据设置</common-button>-->
      </li>
    </ul>

    <span class="orderExcute__splitLine"></span>
    <Tab
      class="orderExcute__tabs"
      :data="sheetsCode"
      backgroundColor="#f7f7f7"
      lineBorder="1px solid #cccccc"
      border="1px solid #cccccc"
      :defaultSelectedTabIndex="defaulSheetIndex"
      @selectTab="selectSheet"
    >
      <div class="orderExcute__tabContent" slot="contentSlot">
        <div class="orderExcute__btns">
          <!--
          <el-radio-group :value="searchInfo.orderType"
                          @input="onOrderTypeRadioChange"
                          v-if="searchInfo.sheetCode==='DefaultSee'">
            <el-radio label="A">全部</el-radio>
            <el-radio label="L">长期</el-radio>
            <el-radio label="T">临时</el-radio>
          </el-radio-group>
          -->
          <!-- v-if="((searchInfo.orderType!=='A')&&(searchInfo.sheetCode==='DefaultSee'))||(searchInfo.sheetCode!=='DefaultSee')" -->
          <el-checkbox
            v-model="ifPrintTitle"
            v-if="false"
            label="是否打印标题"
          ></el-checkbox>
          <!-- v-if="((searchInfo.orderType!=='A')&&(searchInfo.sheetCode==='DefaultSee'))||(searchInfo.sheetCode!=='DefaultSee')" -->
          <template v-for="(button, index) of buttons">
            <!-- span class="orderExcute__btn"
                  :key="index"
            @click="onBtnClick(button)">{{button.name}}</span-->
            <el-button
              :type="btnType[index % 4]"
              size="mini"
              :key="index"
              @click="onBtnClick(button)"
              >{{ button.name }}</el-button
            >
            <span
              class="orderExcute__unPrintNum"
              v-show="button.printFlag && button.unPrintOrderNum"
              :class="{ 'is-checked': !!button.unPrintOrderNumCheck }"
              @click.stop="clickUnPrintOrderNum(button)"
              :key="`unPrintNum${index}`"
              >{{ unPrintOrderNum(button) }}</span
            >
          </template>

          <!-- <CommonButton class="orderExcute__dispostateSearch"
                                      border="1px solid #cccccc"
                                      color="#378ec4"
                                      iconColor="#378ec4"
                                      backgroundColor="#ffffff"
                                      iconBackgroundColor="#ffffff"
                                      :hover="false"
                                      iconBorderRight="1px solid #cccccc"
                                      :iconClass="searchButtonIconClass">
                          快捷查询
                          <BedSearch slot="hoverContent"></BedSearch>
          </CommonButton>-->
          <el-select
            size="mini"
            class="orderExcute__filterOrderColoumn"
            v-model="filterOrderColoumn"
            filterable
            clearable
            placeholder="默认用药途径"
          >
            <el-option
              v-for="item in filerColumnsSort"
              :key="item.key"
              :label="item.title"
              :value="item.key"
            ></el-option>
          </el-select>
          <el-checkbox v-model="fuzzyFlag">模糊搜索</el-checkbox>
          <el-input
            class="orderExcute__searchOrderInput"
            placeholder="请输入医嘱信息"
            v-model="filterOrderText"
            @keyup.native.enter="filterContent()"
          ></el-input>
          <el-input
            class="orderExcute__printCountInput"
            placeholder="续打请输入开始行数"
            v-model="printCount"
          ></el-input>
          <el-select
            size="mini"
            class="orderExcute__select"
            v-model="filterOrderState"
            v-if="false"
            filterable
            clearable
          >
            <el-option
              v-for="item in disposeStats"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </div>
        <order-list
          class="orderExcute__orderList"
          @setPlacerNo="setPlacerNo"
          @search="search"
          :data="orderList.data"
          :columns="orderList.columns"
        ></order-list>
      </div>
    </Tab>
    <el-dialog
      :visible.sync="ifShowExcuteSign"
      custom-class="orderExcute__dialog"
      :width="orderSignWidth"
      :title="triggerButton.desc"
      :modal-append-to-body="false"
    >
      <OrderSign
        ref="orderSign"
        :triggerButton="triggerButton"
        @close="ifShowExcuteSign = false"
        :ifShow="ifShowExcuteSign"
        :orders="orderList.data.orders"
        :ifPPDOrder="ifPPDOrderRet"
        :func="func"
      ></OrderSign>
    </el-dialog>
    <el-dialog
      :visible.sync="ifShowOrderSetPlacerNotes"
      custom-class="orderExcute__dialog"
      width="45%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="检验备注"
      :modal-append-to-body="false"
    >
      <OrderSetPlacerNotes
        ref="orderSetPlacerNotes"
        :orders="ordersOfOrderSetPlacerNotes"
        :func="funcOfOrderSetPlacerNotes"
        @close="ifShowOrderSetPlacerNotes = false"
      ></OrderSetPlacerNotes>
    </el-dialog>
    <el-dialog
      :visible.sync="ifShowOrderSheetConfig"
      custom-class="orderExcute__dialog"
      width="300px"
      title="单据设置"
      :modal-append-to-body="false"
    >
      <OrderSheetConfig
        ref="orderSheetConfig"
        @saveSuccess="sheetConfigSaveSuccess"
        :sheets="sheetsCode"
      ></OrderSheetConfig>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import CommonButton from "../../components/CommonButton";
import DatePicker from "../../components/DatePicker";
import Tab from "../../components/Tab";
import Select from "../../components/Select";
import OrderList from "./OrderList";
import OrderSearch from "./OrderSearch";
import OrderSetPlacerNotes from "./OrderSetPlacerNotes";
import OrderSign from "./OrderSign";
import utils from "../../comm/utils";
import session from "../../store/api/session";
import orderHandleApi from "../../store/api/orderHandle";
import pinyinUtil from "../../comm/pinyinUtil";
import OrderSheetConfig from "./OrderSheetConfig";

export default {
  name: "OrderExcute",
  components: {
    CommonButton,
    Tab,
    OrderList,
    OrderSearch,
    OrderSign,
    YlDatePicker: DatePicker,
    YlSelect: Select,
    OrderSetPlacerNotes,
    OrderSheetConfig,
  },
  props: ["data"],
  data() {
    return {
      timeOption: {
        start: "00:00",
        step: "01:00",
        end: "23:00",
      },
      input1: "",
      input2: "",
      searchButtonIconClass: "fa fa-angle-down",
      ifShowExcuteSign: false,
      ifShowOrderSetPlacerNotes: false,
      triggerButton: {},
      func: null,
      utils,
      ifPrintTitle: true,
      session,
      patients: [],
      orderIDMapPatient: {},
      ordersOfOrderSetPlacerNotes: null,
      funcOfOrderSetPlacerNotes: null,
      runServerMethod: orderHandleApi.runServerMethodFactory,
      filterOrderText: "",
      filterOrderState: "",
      printCount: "",
      disposeStats: [],
      // 保存查询时界面里的查询条件，用于控制打印的判断
      orderSignWidth: "450px",
      ifPPDOrderRet: false,
      searchCondition: null,
      disposeStateSets: [
        { code: "LongUnnew", desc: "非新长嘱" },
        { code: "LongNew", desc: "新开长嘱" },
        { code: "Temp", desc: "需执行" },
        { code: "Immediate", desc: "需处理即刻" },
        { code: "TempTest", desc: "检验需处理" },
        { code: "SkinTest", desc: "皮试医嘱" },
        { code: "Discontinue", desc: "需停止执行" },
        { code: "ExecDiscon", desc: "已停止执行" },
        { code: "Exec", desc: "已执行" },
        { code: "NeedToDeal", desc: "需处理" },
        { code: "NeedToStop", desc: "停止需处理" },
        { code: "AlreadyDeal", desc: "已处理" },
        { code: "AlreadyStop", desc: "停止已处理" },
        { code: "RefuseDispDrug", desc: "药房拒发药" },
        { code: "SpecmentReject", desc: "检验拒收" },
      ],
      filterOrderColoumn: "phcinDesc",
      fuzzyFlag: true,
      pickerStartDateRange: {
        disabledDate: (date) => {
          const endDate = this.searchInfo.endDate;
          return utils.compareDate(date, endDate);
        },
      },
      pickerEndDateRange: {
        disabledDate: (date) => {
          const startDate = this.searchInfo.startDate;
          return utils.compareDate(startDate, date);
        },
      },
      ifShowOrderSheetConfig: false,
      btnType: ["primary", "success", "warning", "danger"],
    };
  },
  created() {
    this.initOrderExcuteState();
  },
  mounted() {
    this.$eventBus.$on("patientTree-patients-change", () => {
      /* this.patients = [];
      patients.forEach(node => {
        if (node.children && node.children.length > 0) {
          node.children.forEach(patient => {
            this.patients.push(patient);
            this.orderIDMapPatient[patient.orderID] = patient;
          });
        }
      });*/
      this.requestQuery();
    });
  },
  watch: {
    // "orderList.data.orders": function () {
    //   if (this.orderList.data.orders) {
    //     this.disposeStats = [];
    //     this.orderList.data.orders.forEach(order => {
    //       const disposeStatObj = this.disposeStateSets.find(stat => {
    //         if (order.disposeStatCode) {
    //           return stat.code === order.disposeStatCode;
    //         }
    //         if (order.execInfos) {
    //           const execInfo = order.execInfos.find(
    //             exec => stat.code === exec.disposeStatCode
    //           );
    //           if (execInfo) {
    //             return true;
    //           }
    //           return false;
    //         }
    //         return false;
    //       });
    //       console.log(disposeStatObj);
    //       if (
    //         !this.disposeStats.find(dispose => {
    //           if (dispose) {
    //             return dispose.code === disposeStatObj.code;
    //           }
    //           return false;
    //         })
    //       ) {
    //         this.disposeStats.push(disposeStatObj);
    //       }
    //     });
    //   }
    // },
    filterOrderColoumn(value) {
      if (value === "") {
        this.filterOrderText = value;
        this.filterContent();
      }
    },
    ifShowExcuteSign(value) {
      if (!value) {
        this.$refs.orderSign.init();
        this.ifPPDOrderRet = false;
      }
    },
    ifPPDOrderRet(value) {
      if (value) {
        this.orderSignWidth = "800px";
      } else {
        this.orderSignWidth = "400px";
      }
    },
    ifShowOrderSetPlacerNotes(value) {
      if (!value) {
        this.$refs.orderSetPlacerNotes.init();
      }
    },
    filterOrderState(value) {
      if (this.orderList.data.orders) {
        this.orderList.data.orders.forEach((order) => {
          if (order.disposeStatCode) {
            order.show = order.disposeStatCode === value || value === "";
          }
          if (order.execInfos) {
            order.execInfos.forEach((exec) => {
              order.show = exec.disposeStatCode === value || value === "";
            });
          }
        });
      }
    },
    sheetsCode(value, oldValue) {
      if (value.length > 0 && oldValue.length === 0) {
        this.sheetConfigSaveSuccess();
      }
    },
  },
  computed: {
    ...mapGetters([
      "orderList",
      "defaulSheetIndex",
      "sheetsCode",
      "searchInfo",
      "buttons",
      "selectedPatients",
    ]),
    getSheetDispMethodStr() {
      // const sheetCode =  this.searchInfo.sheetCode !== '' ? this.searchInfo.sheetCode :'DefaultSee';
      // const hospitalID =  this.searchInfo.hospitalID !== '' ? this.searchInfo.hospitalID :'0';
      return this.disposeStatTests; // `Nur.CommonInterface.OrderSheet:getSheetDispStateInfo:${sheetCode}:${hospitalID}:`;
    },
    // 返回排序过的数据
    filerColumnsSort() {
      const sortKey = [
        "phcinDesc",
        "arcimDesc",
        "ctcpDesc",
        "orcatDesc",
        "ordStatDesc",
        "reclocDesc",
        "DspStat",
      ];
      const filerColumnsSort = [];
      sortKey.forEach((key) => {
        const infoFinded = this.orderList.columns.find(
          (conlumn) => conlumn.key === key
        );
        if (infoFinded) {
          filerColumnsSort.push(Object.assign({}, infoFinded));
        }
      });
      const sortKeyString = `^${sortKey.join("^")}^`;
      this.orderList.columns.forEach((conlumn) => {
        if (sortKeyString.indexOf(conlumn.key) === -1) {
          filerColumnsSort.push(Object.assign({}, conlumn));
        }
      });
      return filerColumnsSort;
    },
  },
  methods: {
    ...mapActions([
      "initOrderExcuteState",
      "initColumnsAndButtons",
      "initSearchDateTime",
    ]),
    ...mapMutations([
      "requestQuery",
      "updateSearchInfo",
      "updateSelectedPatients",
    ]),
    search() {
      this.searchCondition = JSON.parse(JSON.stringify(this.searchInfo));
    },
    unPrintOrderNum(button) {
      const { printFlag } = button;
      let num = 0;
      if (this.orderList.data.orders) {
        this.orderList.data.orders.forEach((order) => {
          if (order.execInfos) {
            order.execInfos.forEach((execInfo) => {
              num = execInfo.printFlag.indexOf(printFlag) < 0 ? num + 1 : num;
            });
          }
        });
      }
      this.$set(button, "unPrintOrderNum", num);
      return num;
    },
    clickUnPrintOrderNum(button) {
      const { printFlag } = button;
      const currentCheck = !!button.unPrintOrderNumCheck;
      this.buttons.forEach((currentButton) => {
        if (currentButton.printFlag) {
          if (currentButton.printFlag !== printFlag) {
            this.$set(currentButton, "unPrintOrderNumCheck", false);
          } else {
            this.$set(currentButton, "unPrintOrderNumCheck", currentCheck);
          }
        }
      });
      if (this.orderList.data.orders) {
        let orderCheckNum = 0;
        this.orderList.data.orders.forEach((order) => {
          let execCheckNum = 0;
          if (order.execInfos) {
            order.execInfos.forEach((execInfo) => {
              if (execInfo.printFlag.indexOf(printFlag) < 0) {
                execInfo.check = !currentCheck;
                execCheckNum = execInfo.check ? execCheckNum + 1 : execCheckNum;
              } else {
                execInfo.check = false;
              }
            });
          }
          const difference = order.execInfos.length - execCheckNum;
          if (difference === 0) {
            order.check = true;
            orderCheckNum += 1;
            order.show = true;
          } else if (difference === order.execInfos.length) {
            order.check = false;
            order.show = currentCheck === true;
          } else {
            order.check = false;
            order.indeterminate = true;
            order.show = true;
          }
        });
        const difference = this.orderList.data.orders.length - orderCheckNum;
        if (difference === 0) {
          this.orderList.data.check = true;
        } else if (difference === this.orderList.data.orders.length) {
          this.orderList.data.check = false;
          this.orderList.data.indeterminate = false;
        } else {
          this.orderList.data.check = false;
          this.orderList.data.indeterminate = true;
        }
      }
      button.unPrintOrderNumCheck = !currentCheck;
    },
    filterContent() {
      const value = this.filterOrderText;
      const filterKey = this.filterOrderColoumn;
      const fuzzyFlag = this.fuzzyFlag;
      if (this.orderList.data.orders) {
        const uppCaseValue = value.toUpperCase();
        const filterKeys = [];
        filterKeys.push(filterKey);
        this.orderList.data.orders.forEach((order) => {
          order.show =
            value === "" ||
            !!filterKeys.find((key) => {
              if (order[key]) {
                const content = String(order[key]);
                if (!fuzzyFlag) {
                  if (content === value) {
                    return true;
                  }
                } else if (
                  content.indexOf(value) > -1 ||
                  content.indexOf(uppCaseValue) > -1 ||
                  content.toUpperCase().indexOf(uppCaseValue) > -1 ||
                  pinyinUtil.getFirstLetter(content).indexOf(uppCaseValue) > -1
                ) {
                  return true;
                }
              }
              return false;
            });
          if (order.childs.length !== 0) {
            order.childs.forEach((child) => {
              order.show =
                value === "" ||
                order.show === true ||
                !!filterKeys.find((key) => {
                  if (child[key]) {
                    const content = String(child[key]);
                    if (!fuzzyFlag) {
                      if (content === value) {
                        return true;
                      }
                    } else if (
                      content.indexOf(value) > -1 ||
                      content.indexOf(uppCaseValue) > -1 ||
                      content.toUpperCase().indexOf(uppCaseValue) > -1 ||
                      pinyinUtil.getFirstLetter(content).indexOf(uppCaseValue) >
                        -1
                    ) {
                      return true;
                    }
                  }
                  return false;
                });
            });
          }
        });
      }
    },
    onSheetConfigBtnClick() {
      this.ifShowOrderSheetConfig = true;
    },
    sheetConfigSaveSuccess() {
      /* global localStorage*/
      if (localStorage.sheetConfig) {
        const sheetConfigData = JSON.parse(localStorage.sheetConfig);
        this.sheetsCode.sort((sheetOne, sheetSecond) => {
          const sheetOneNo = sheetConfigData[sheetOne.ID]
            ? parseInt(sheetConfigData[sheetOne.ID], 10)
            : 0;
          const sheetSecondNo = sheetConfigData[sheetSecond.ID]
            ? parseInt(sheetConfigData[sheetSecond.ID], 10)
            : 0;
          return sheetOneNo - sheetSecondNo;
        });
      }
      this.ifShowOrderSheetConfig = false;
    },
    onBtnClick(button) {
      /* const loadingInstance = this.$loading({
        fullscreen: true,
        text: "后台处理中..."
      });*/
      // const loadingInstance = null;
      // setTimeout(() => {
      try {
        const callBack = (object) => {
          let func;
          if (object.handle) {
            func = object.handle(button, this);
          } else {
            this.$message.error("OrderExute.js缺少handle函数");
            return;
          }
          if (typeof func === "string") {
            // loadingInstance.close();
            // this.$message.error(func);
            this.$message({
              showClose: true,
              message: func,
              type: "error",
            });
            return;
          } else if (typeof func === "undefined") {
            // loadingInstance.close();
            this.$message.error("没有维护对应的函数");
            return;
          }
          // 不弹窗
          if (!button.ifShowWindow) {
            if (func && typeof func === "function") {
              const info = {
                userID1: session.USER.USERID,
                locID: session.USER.CTLOCID,
                userName: session.USER.USERNAME,
                queryTypeCode: this.searchInfo.sheetCode,
                searchInfo: this.searchInfo,
              };
              func(
                this.requestQuery,
                orderHandleApi.runServerMethodFactory,
                info
                // loadingInstance
              );
            }
          } else {
            // 弹窗
            /* if (loadingInstance) {
                loadingInstanceloadingInstance.close();
              }*/
            this.func = (info) => {
              info.userID1 = session.USER.USERID;
              info.locID = session.USER.CTLOCID;
              info.queryTypeCode = this.searchInfo.sheetCode;
              info.searchInfo = this.searchInfo;
              func(
                this.requestQuery,
                orderHandleApi.postServerMethodFactory,
                info
              );
            };
            if (button.desc.indexOf("皮试") > -1) {
              this.ifPPDOrder(button);
            }
            this.triggerButton = button;
            this.ifShowExcuteSign = true;
          }
        };
        utils.createJS("OrderExcute", callBack);
        /* global111 OrderExcute */
        // callBack(OrderExcute);
      } catch (e) {
        // loadingInstance.close();
        this.$message({
          showClose: true,
          message: e.message,
          type: "error",
        });
      }
      // }, 100);
    },
    ifPPDOrder(button) {
      const selectOrder = [];
      if (this.orderList.data.orders) {
        this.orderList.data.orders.forEach((order) => {
          if (order.check) {
            selectOrder.push(order.ID);
          }
        });
        if (selectOrder.length > 0) {
          orderHandleApi
            .runServerMethodFactory("ifPPDOrder", selectOrder[0])
            .then((ret) => {
              if (ret.trim() === "Y" && button.jsFunction === "setSkinTest") {
                this.ifPPDOrderRet = true;
              }
            });
        }
      }
    },
    setPlacerNo(event, orderItem) {
      const callBack = (object) => {
        if (object.setPlacerNo) {
          object.setPlacerNo(
            this.requestQuery,
            orderHandleApi.runServerMethodFactory,
            orderItem,
            this
          );
        } else {
          this.$message.error("OrderExute.js缺少setPlacerNo函数");
        }
      };
      utils.createJS("OrderExcute", callBack);
    },
    selectSheet(index) {
      this.updateSearchInfo({
        key: "sheetCode",
        value: this.sheetsCode[index].ID,
      });
      this.initColumnsAndButtons({
        sheetCode: this.sheetsCode[index].ID,
        hospitalID: this.sheetsCode[index].hospitalID,
      });
    },
    onStartDateChange(date) {
      const dateStr = utils.formatDate(date).replace(/-/g, "/");
      if (dateStr !== "") {
        const dateObj = new Date(dateStr);
        let month = dateObj.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        const day =
          dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
        this.updateSearchInfo({
          key: "startDate",
          value: `${dateObj.getFullYear()}-${month}-${day}`,
        });
      }
    },
    onEndDateChange(date) {
      const dateStr = utils.formatDate(date).replace(/-/g, "/");
      if (dateStr !== "") {
        const dateObj = new Date(dateStr);
        let month = dateObj.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        const day =
          dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
        this.updateSearchInfo({
          key: "endDate",
          value: `${dateObj.getFullYear()}-${month}-${day}`,
        });
      }
    },
    onOrderTypeRadioChange(value) {
      this.updateSearchInfo({
        key: "orderType",
        value,
      });
      this.requestQuery();
    },
    startTimeSelectBlur(timeSelect) {
      const currTimeValue = timeSelect.$children[0].currentValue;
      if (utils.formatTime(currTimeValue) !== "") {
        this.updateSearchInfo({
          key: "startTime",
          value: timeSelect.$children[0].currentValue,
        });
      } else {
        this.$message({
          message: "开始时间输入错误",
          duration: 0,
          showClose: true,
          type: "error",
        });
      }
    },
    onStartTimeChange(time) {
      this.updateSearchInfo({
        key: "startTime",
        value: time,
      });
    },
    endTimeSelectBlur(timeSelect) {
      const currTimeValue = timeSelect.$children[0].currentValue;
      if (utils.formatTime(currTimeValue) !== "") {
        this.updateSearchInfo({
          key: "endTime",
          value: timeSelect.$children[0].currentValue,
        });
      } else {
        this.$message({
          message: "结束时间输入错误",
          duration: 0,
          showClose: true,
          type: "error",
        });
      }
    },
    onEndTimeChange(time) {
      this.updateSearchInfo({
        key: "endTime",
        value: time,
      });
    },
    onDoctorOrderFlagChange(value) {
      this.updateSearchInfo({
        key: "doctorOrderFlag",
        value,
      });
    },
    onCreateOrderFlagChange(value) {
      this.updateSearchInfo({
        key: "createOrderFlag",
        value,
      });
    },
    onExcutedOrderFlagChange(value) {
      this.updateSearchInfo({
        key: "excutedOrderFlag",
        value,
      });
      /* this.initColumnsAndButtons({
        sheetCode: this.searchInfo.sheetCode,
        hospitalID: this.searchInfo.hospitalID
      });*/
      // this.requestQuery();
    },
    onPrintedOrderFlagChange(value) {
      this.updateSearchInfo({
        key: "printedOrderFlag",
        value,
      });
      /* this.initColumnsAndButtons({
        sheetCode: this.searchInfo.sheetCode,
        hospitalID: this.searchInfo.hospitalID
      });*/
      // this.requestQuery();
    },
    onLongOrderFlagChange(value) {
      this.updateSearchInfo({
        key: "longOrderFlag",
        value,
      });
      /* this.initColumnsAndButtons({
        sheetCode: this.searchInfo.sheetCode,
        hospitalID: this.searchInfo.hospitalID
      });*/
      // this.requestQuery();
    },
    onLongOrderNotNewFlagChange(value) {
      this.updateSearchInfo({
        key: "longOrderNotNewFlag",
        value,
      });
      /* this.initColumnsAndButtons({
        sheetCode: this.searchInfo.sheetCode,
        hospitalID: this.searchInfo.hospitalID
      });*/
      // this.requestQuery();
    },
    onTempOrderFlagChange(value) {
      this.updateSearchInfo({
        key: "tempOrderFlag",
        value,
      });
      /* this.initColumnsAndButtons({
        sheetCode: this.searchInfo.sheetCode,
        hospitalID: this.searchInfo.hospitalID
      });*/
      // this.requestQuery();
    },
    onSearchBtnClick() {
      this.requestQuery();
    },
    onReadCardBtnClick() {
      try {
        const callBack = (object) => {
          // 获取读卡的值
          let episodeId = "";
          episodeId = object.readCard();
          // 如果获取了值，则根据这个值刷新页面
          if (document.getElementById("CardNo").value !== "") {
            this.$store.commit("updateSelectedPatients", {
              selectedPatients: new Array(episodeId),
            });
            this.requestQuery();
          }
        };
        utils.createJS("myself", callBack);
      } catch (e) {
        // loadingInstance.close();
        this.$message({
          showClose: true,
          message: e.message,
          type: "error",
        });
      }
    },
    onPrintHistoryBtnClick() {
      /* global window*/
      window.open(
        "dhc.nurse.ip.operationrecord.csp",
        "护士打印日志",
        `top=0,left=0,width=${window.screen.availWidth - 100},height=${
          window.screen.availHeight - 100
        },toolbar=no, menubar=no`
      );
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b orderExcute {
  display: flex;
  margin: 0 10px 10px;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  @e unPrintNum {
    color: white;
    font-size: var(--mainFontSize);
    background-color: rgb(255, 64, 35, 0.7);
    text-align: center;
    border-radius: 5px;
    margin-left: -10px;
    padding: 2px;
    position: absolute;
    line-height: 20px;
    transform: translateY(-5%) translateX(-15%);
    user-select: none;
    &:hover {
      /* background-color: var(--mainColor); */
      cursor: pointer;
    }
    @when checked {
      background-color: var(--mainColor);
    }
  }
  @e searchUl {
    display: block;
    position: relative;
    height: 85px;
    /* margin: 0 auto;*/
    /*width: 1000px;
    border-bottom: 1px solid #cccccc;*/
    text-align: center;
  }
  @e select {
    width: 150px;
  }
  @e searchLi {
    float: left;
    height: 70px;
    padding: 5px;
    margin-right: 15px;
  }
  @e readCardLi {
    float: left;
    height: 70px;
    width: 200px;
    margin-top: 10px;
    padding: 5px;
    margin-right: 15px;
  }
  @e datePickerLabel {
    font-size: var(--mainFontSize);
    display: block;
    line-height: 35px;
  }
  @e datePicker {
    display: block !important;
    margin: 4px 0;
    width: 145px !important;
  }
  @e timeSelect {
    display: block !important;
    margin: 4px 0;
    width: 140px !important;
  }
  @e switch {
    line-height: 33px;
  }
  @e checkBox {
    display: block;
    line-height: 33px;
  }
  @e searchBtn {
    margin: 15px 0;
  }
  @e filterOrderColoumn {
    padding-left: 100px;
    width: 150px;
  }
  @e searchOrderInput {
    width: 150px;
  }
  @e printCountInput {
    width: 160px;
  }
  @e splitLine {
    display: block;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  @e tabs {
    flex: 1;
    border: 1px solid #cccccc;
    border-radius: 3px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
  }
  @e tabContent {
    flex-grow: 1;
    /* position: relative; */
  }
  @e btns {
    position: relative;
    height: 40px;
    border-bottom: 1px solid #cccccc;
    line-height: 40px;
    padding-left: 10px;
  }
  @e btn {
    font-size: var(--mainFontSize);
    color: #656565;
    margin: 0 10px;
    &:hover {
      color: var(--mainColor);
      cursor: pointer;
    }
  }
  @e dispostateSearch {
    margin: 4px 10px 4px 0;
    float: right;
    z-index: 2;
  }
  @e orderList {
    /* position: absolute !important;*/
    top: 41px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  @e dialog {
    & .el-dialog__title {
      color: #fff;
    }
  }
  @e disposeStat {
    height: 10px;
    margin-bottom: 20px;
    @m LongUnnew {
      background-color: var(--LongUnnewColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m LongNew {
      background-color: var(--LongNewColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m Temp {
      background-color: var(--TempColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m Immediate {
      background-color: var(--ImmediateColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m SkinTest {
      background-color: var(--SkinTestColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m SkinTestNorm {
      background-color: var(--SkinTestColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m SkinTestAbnorm {
      background-color: var(--SkinTestAbnorm);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m Discontinue {
      background-color: var(--DiscontinueColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m ExecDiscon {
      background-color: var(--ExecDisconColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m Exec {
      background-color: var(--ExecColor);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m NeedToDeal {
      background-color: var(--NeedToDeal);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m NeedToStop {
      background-color: var(--NeedToStop);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m AlreadyDeal {
      background-color: var(--AlreadyDeal);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m AlreadyStop {
      background-color: var(--AlreadyStop);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m RefuseDispDrug {
      background-color: var(--RefuseDispDrug);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
    @m SpecmentReject {
      background-color: var(--SpecmentReject);
      color: #000;
      width: 72px;
      font-size: 11px;
      text-align: center;
    }
  }
  & .el-dialog__body {
    padding-top: 15px;
  }
  @e sheetConfigBtn {
    margin: 0 !important;
    padding: 0 !important;
    line-height: 20px !important;
  }
}
div.el-radio-group + label.el-checkbox {
  margin-left: 30px;
}
label.el-checkbox + .orderExcute__btn {
  margin-left: 30px;
}

/* 消息提示框 */
.el-message {
  min-width: 380px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  position: fixed;
  left: 240px;
  top: 20px;
  transform: translateX(0);
  background-color: #edf2fc;
  transition: opacity 0.3s, transform 0.4s;
  overflow: hidden;
  padding: 15px 15px 15px 20px;
  display: flex;
  align-items: center;
}
.el-message--error {
  color: #ff3d2c;
  background: #ffe3e3;
  border: 1px #fec0c0 solid;
}
.el-message__content {
  padding: 0;
  font-size: 18px;
  line-height: 1;
}

.el-message__closeBtn {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: black;
  font-size: 16px;
}
</style>
