<template>
  <div class="orderExcute">
    <ul class="orderExcute__searchUl">
      <li class="orderExcute__searchLi">
        <span class="orderExcute__datePickerLabel">开始时间</span>
        <span class="orderExcute__datePickerLabel">结束时间</span>
      </li>
      <li class="orderExcute__searchLi">
        <yl-date-picker class="orderExcute__datePicker"
                        align="right"
                        type="date"
                        :value="searchInfo.startDate"
                        @input="onStartDateChange">
        </yl-date-picker>
        <yl-date-picker class="orderExcute__datePicker"
                        align="right"
                        type="date"
                        :value="searchInfo.endDate"
                        @input="onEndDateChange">
        </yl-date-picker>
      </li>
      <li class="orderExcute__searchLi">
        <el-time-select class="orderExcute__timeSelect"
                        :value="searchInfo.startTime"
                        @input="onStartTimeChange"
                        :picker-options="timeOption">
        </el-time-select>
        <el-time-select class="orderExcute__timeSelect"
                        :value="searchInfo.endTime"
                        @input="onEndTimeChange"
                        :picker-options="timeOption">
        </el-time-select>
      </li>
      <li class="orderExcute__searchLi">
        <div class="orderExcute__switch">
          <el-switch :value="searchInfo.doctorOrderFlag"
                     @input="onDoctorOrderFlagChange"
                     active-text="医生医嘱"
                     inactive-text="护士医嘱"></el-switch>
        </div>
        <div class="orderExcute__switch">
          <el-switch :value="searchInfo.createOrderFlag"
                     @input="onCreateOrderFlagChange"
                     active-text="开医嘱时间"
                     inactive-text="要求执行时间"></el-switch>
        </div>
      </li>
      <li class="orderExcute__searchLi">
        <div class="orderExcute__checkBox">
          <el-checkbox :value="searchInfo.excutedOrderFlag"
                       @input="onExcutedOrderFlagChange">已执行</el-checkbox>
        </div>
        <div class="orderExcute__checkBox">
          <el-checkbox :value="searchInfo.printedOrderFlag"
                       @input="onPrintedOrderFlagChange">已打印</el-checkbox>
        </div>
      </li>
      <li class="orderExcute__searchLi">
        <common-button class="orderExcute__searchBtn"
                       @click="onSearchBtnClick"
                       width="100">查询</common-button>
      </li>
      <li class="orderExcute__searchLi">
        <div class="orderExcute__disposeStat">
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--Temp">需执行</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--NeedToStop">停止[需处理]</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--AlreadyStop">停止[已处理]</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--RefuseDispDrug">药房拒发药</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--RefuseLab">检验拒收</el-tag>
        </div>
        <div class="orderExcute__disposeStat">
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--SkinTest">皮试</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--LongNew">新开长嘱</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--Discontinue">需停止执行</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--Exec">已执行</el-tag>
          <el-tag type="info"
                  size="mini"
                  class="orderExcute__disposeStat--LongUnnew">非新长嘱</el-tag>
        </div>
      </li>
      <li class="orderExcute__searchLi">
        <common-button class="orderExcute__searchBtn"
                       @click="onPrintHistoryBtnClick"
                       width="100">打印日志</common-button>
      </li>
    </ul>
    <span class="orderExcute__splitLine"></span>
    <Tab class="orderExcute__tabs"
         :data="sheetsCode"
         backgroundColor="#f7f7f7"
         lineBorder="1px solid #cccccc"
         border="1px solid #cccccc"
         :defaultSelectedTabIndex="defaulSheetIndex"
         @selectTab="selectSheet">
      <div class="orderExcute__tabContent"
           slot="contentSlot">
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
          <el-checkbox v-model="ifPrintTitle"
                       label="是否打印标题"></el-checkbox>
          <!-- v-if="((searchInfo.orderType!=='A')&&(searchInfo.sheetCode==='DefaultSee'))||(searchInfo.sheetCode!=='DefaultSee')" -->
          <span class="orderExcute__btn"
                v-for="(button,index) of buttons"
                :key="index"
                @click="onBtnClick(button)">
            {{button.name}}
          </span>
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
                        </CommonButton> -->
          <el-input class="orderExcute__searchOrderInput"
                    placeholder="请输入医嘱信息"
                    v-model="filterOrderText">
          </el-input>
        </div>
        <order-list class="orderExcute__orderList"
                    @setPlacerNo="setPlacerNo"
                    :data="orderList.data"
                    :columns="orderList.columns">
        </order-list>
      </div>
    </Tab>
    <el-dialog :visible.sync="ifShowExcuteSign"
               custom-class="orderExcute__dialog"
               width="25%"
               :title="triggerButton.desc"
               :modal-append-to-body="false">
      <OrderSign ref="orderSign"
                 :triggerButton="triggerButton"
                 @close="ifShowExcuteSign=false;"
                 :func="func"></OrderSign>
    </el-dialog>
    <el-dialog :visible.sync="ifShowOrderSetPlacerNotes"
               custom-class="orderExcute__dialog"
               width="45%"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               title="检验备注"
               :modal-append-to-body="false">
      <OrderSetPlacerNotes ref="orderSetPlacerNotes"
                           :orders="ordersOfOrderSetPlacerNotes"
                           :func="funcOfOrderSetPlacerNotes"
                           @close="ifShowOrderSetPlacerNotes=false;"></OrderSetPlacerNotes>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import CommonButton from '../../components/CommonButton';
import DatePicker from '../../components/DatePicker';
import Tab from '../../components/Tab';
import OrderList from './OrderList';
import OrderSearch from './OrderSearch';
import OrderSetPlacerNotes from './OrderSetPlacerNotes';
import OrderSign from './OrderSign';
import utils from '../../comm/utils';
import session from '../../store/api/session';
import orderHandleApi from '../../store/api/orderHandle';
import pinyinUtil from '../../comm/pinyinUtil';

export default {
  name: 'OrderExcute',
  components: {
    CommonButton,
    Tab,
    OrderList,
    OrderSearch,
    OrderSign,
    YlDatePicker: DatePicker,
    OrderSetPlacerNotes,
  },
  props: [
    'data',
  ],
  data() {
    return {
      timeOption: {
        start: '00:00',
        step: '01:00',
        end: '23:00',
      },
      searchButtonIconClass: 'fa fa-angle-down',
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
      filterOrderText: '',
      disposeStats: [{ code: 'LongUnnew', desc: '非分长嘱' },
      { code: 'LongNew', desc: '新开长嘱' },
      { code: 'Temp', desc: '新开临嘱' },
      { code: 'Immediate', desc: '新开即刻' },
      { code: 'SkinTest', desc: '皮试医嘱' },
      { code: 'Discontinue', desc: '' },
      { code: 'ExecDiscon', desc: '' },
      { code: 'Exec', desc: '' },
      { code: 'NeedToDeal', desc: '' },
      { code: 'NeedToStop', desc: '' },
      { code: 'AlreadyDeal', desc: '' },
      { code: 'AlreadyStop', desc: '' }],
    };
  },
  created() {
    this.$eventBus.$on('patientTree-patients-change', patients => {
      this.patients = [];
      patients.forEach(node => {
        if (node.children && node.children.length > 0) {
          node.children.forEach(patient => {
            this.patients.push(patient);
            this.orderIDMapPatient[patient.orderID] = patient;
          });
        }
      });
    });
    this.initOrderExcuteState();
  },
  watch: {
    ifShowExcuteSign(value) {
      if (!value) {
        this.$refs.orderSign.init();
      }
    },
    ifShowOrderSetPlacerNotes(value) {
      if (!value) {
        this.$refs.orderSetPlacerNotes.init();
      }
    },
    filterOrderText(value) {
      if (this.orderList.data.orders) {
        const uppCaseValue = value.toUpperCase();
        const filterKeys = ['arcimDesc'];
        this.orderList.data.orders.forEach(order => {
          order.show = !!filterKeys.find(key => {
            if (order[key]) {
              const content = String(order[key]);
              if ((content.indexOf(uppCaseValue) > -1) || (content.toUpperCase().indexOf(uppCaseValue) > -1) || (pinyinUtil.getFirstLetter(content).indexOf(uppCaseValue) > -1)) {
                return true;
              }
            }
            return false;
          });
        });
      }
    },
  },
  computed: {
    ...mapGetters(['orderList', 'defaulSheetIndex', 'sheetsCode', 'searchInfo', 'buttons']),
  },
  methods: {
    ...mapActions(['initOrderExcuteState', 'initColumnsAndButtons', 'initSearchDateTime']),
    ...mapMutations(['requestQuery', 'updateSearchInfo']),
    onBtnClick(button) {
      if (button.jsFunction.indexOf('Print') > -1) {
        const callBack = object => {
          let func;
          if (object.handle) {
            func = object.handle(button, this);
          } else {
            this.$message.error('OrderExute.js缺少handle函数');
            return;
          }
          if (typeof func === 'string') {
            this.$message.error(func);
            return;
          } else if (typeof func === 'undefined') {
            this.$message.error('没有维护对应的函数');
            return;
          }
          // 不弹窗
          if (!button.ifShowWindow) {
            if (func && ((typeof func) === 'function')) {
              const info = {
                userID1: session.USER.USERID,
                locID: session.USER.CTLOCID,
                queryTypeCode: this.searchInfo.sheetCode,
              };
              func(this.requestQuery, orderHandleApi.runServerMethodFactory, info);
            }
          } else {
            // 弹窗
            this.func = (info, loading) => {
              info.queryTypeCode = this.searchInfo.sheetCode;
              func(this.requestQuery, orderHandleApi.runServerMethodFactory, info, loading);
            };
            this.triggerButton = button;
            this.ifShowExcuteSign = true;
          }
        };
        // utils.createJS('OrderExcute', callBack);
        /* global OrderExcute */
        callBack(OrderExcute);
      }
      else {
        const loadingInstance = this.$loading({
          fullscreen: true,
          text: '后台处理中...',
        });
        setTimeout(() => {
          try {
            const callBack = object => {
              let func;
              if (object.handle) {
                func = object.handle(button, this);
              } else {
                this.$message.error('OrderExute.js缺少handle函数');
                return;
              }
              if (typeof func === 'string') {
                loadingInstance.close();
                this.$message.error(func);
                return;
              } else if (typeof func === 'undefined') {
                loadingInstance.close();
                this.$message.error('没有维护对应的函数');
                return;
              }
              // 不弹窗
              if (!button.ifShowWindow) {
                if (func && ((typeof func) === 'function')) {
                  const info = {
                    userID1: session.USER.USERID,
                    locID: session.USER.CTLOCID,
                    queryTypeCode: this.searchInfo.sheetCode,
                  };
                  func(this.requestQuery, orderHandleApi.runServerMethodFactory, info, loadingInstance);
                  loadingInstance.close();
                }
              } else {
                // 弹窗
                loadingInstance.close();
                this.func = (info, loading) => {
                  func(this.requestQuery, orderHandleApi.runServerMethodFactory, info, loading);
                };
                this.triggerButton = button;
                this.ifShowExcuteSign = true;
              }
            };
            // utils.createJS('OrderExcute', callBack);
            /* global OrderExcute */
            callBack(OrderExcute);
          } catch (e) {
            loadingInstance.close();
            this.$message.error(e.message);
          }
        }, 100);
      }

    },
    setPlacerNo(event, orderItem) {
      const callBack = object => {
        if (object.setPlacerNo) {
          object.setPlacerNo(this.requestQuery, orderHandleApi.runServerMethodFactory, orderItem, this);
        } else {
          this.$message.error('OrderExute.js缺少setPlacerNo函数');
        }
      };
      utils.createJS('OrderExcute', callBack);
    },
    selectSheet(index) {
      this.updateSearchInfo({
        key: 'sheetCode',
        value: this.sheetsCode[index].ID,
      });
      this.initColumnsAndButtons({
        sheetCode: this.sheetsCode[index].ID,
        hospitalID: this.sheetsCode[index].hospitalID,
      });
    },
    onStartDateChange(date) {
      if (date && date instanceof Date) {
        let month = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        this.updateSearchInfo({
          key: 'startDate',
          value: `${date.getFullYear()}-${month}-${day}`,
        });
      }
    },
    onEndDateChange(date) {
      if (date && date instanceof Date) {
        let month = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        this.updateSearchInfo({
          key: 'endDate',
          value: `${date.getFullYear()}-${month}-${day}`,
        });
      }
    },
    onOrderTypeRadioChange(value) {
      this.updateSearchInfo({
        key: 'orderType',
        value,
      });
      this.requestQuery();
    },
    onStartTimeChange(time) {
      this.updateSearchInfo({
        key: 'startTime',
        value: time,
      });
    },
    onEndTimeChange(time) {
      this.updateSearchInfo({
        key: 'endTime',
        value: time,
      });
    },
    onDoctorOrderFlagChange(value) {
      this.updateSearchInfo({
        key: 'doctorOrderFlag',
        value,
      });
    },
    onCreateOrderFlagChange(value) {
      this.updateSearchInfo({
        key: 'createOrderFlag',
        value,
      });
    },
    onExcutedOrderFlagChange(value) {
      this.updateSearchInfo({
        key: 'excutedOrderFlag',
        value,
      });
    },
    onPrintedOrderFlagChange(value) {
      this.updateSearchInfo({
        key: 'printedOrderFlag',
        value,
      });
    },
    onSearchBtnClick() {
      this.requestQuery();
    },
    onPrintHistoryBtnClick() {
      /* global window*/
      window.open('dhc.nurse.ip.operationrecord.csp', '护士打印日志', `top=0,left=0,width=${(window.screen.availWidth - 100)},height=${(window.screen.availHeight - 100)},toolbar=no, menubar=no`);
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
  @e searchUl {
    display: block;
    position: relative;
    height: 85px;
    margin: 0 auto;
    /*width: 1000px;
    border-bottom: 1px solid #cccccc;*/
    text-align: center;
  }
  @e searchLi {
    float: left;
    height: 70px;
    padding: 5px;
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
  @e searchOrderInput {
    padding-left: 100px;
    width: 150px;
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
    position: relative;
  }
  @e btns {
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
    position: absolute !important;
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
    display: block;
    margin-left: 30px;
    line-height: 33px;
    font-size: 10px;
    @m LongUnnew {
      background-color: var(--LongUnnewColor);
      color: #000;
      width: 80px;
    }
    @m LongNew {
      background-color: var(--LongNewColor);
      color: #000;
      width: 80px;
    }
    @m Temp {
      background-color: var(--TempColor);
      color: #000;
      width: 80px;
    }
    @m Immediate {
      background-color: var(--ImmediateColor);
      color: #000;
      width: 80px;
    }
    @m SkinTest {
      background-color: var(--SkinTestColor);
      color: #000;
      width: 80px;
    }
    @m Discontinue {
      background-color: var(--DiscontinueColor);
      color: #000;
      width: 80px;
    }
    @m ExecDiscon {
      background-color: var(--ExecDisconColor);
      color: #000;
      width: 80px;
    }
    @m Exec {
      background-color: var(--ExecColor);
      color: #000;
      width: 80px;
    }
    @m NeedToDeal {
      background-color: var(--NeedToDeal);
      color: #000;
      width: 80px;
    }
    @m NeedToStop {
      background-color: var(--NeedToStop);
      color: #000;
      width: 80px;
    }
    @m AlreadyDeal {
      background-color: var(--AlreadyDeal);
      color: #000;
      width: 80px;
    }
    @m AlreadyStop {
      background-color: var(--AlreadyStop);
      color: #000;
      width: 80px;
    }
    @m RefuseDispDrug {
      background-color: var(--RefuseDispDrug);
      color: #000;
      width: 80px;
    }
    @m RefuseLab {
      background-color: var(--RefuseLab);
      color: #000;
      width: 80px;
    }
  }

  & .el-dialog__body {
    padding-top: 15px;
  }
}
div.el-radio-group + label.el-checkbox {
  margin-left: 30px;
}
label.el-checkbox + .orderExcute__btn {
  margin-left: 30px;
}
</style>
