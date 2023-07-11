<template>
  <div class="orderList">
    <div class="orderList__headWrapper"
         ref="headWrapper">
      <table class="orderList__head orderList__table"
             :style="getTableStyle">
        <colgroup>
          <col :width="checkBoxWidth"></col>
          <template v-for="column of columns">
            <template v-if="column.key==='arcimDesc'">
              <col :width="disposeStateWidth" ></col>
              <col :width="groupChartWidth" ></col>
            </template>
            <col :width="column.width" ></col>
          </template>
        </colgroup>
        <thead>
          <tr>
            <th>
              <el-checkbox :value="data.check"
                           @input="setAllCheckValue"
                           :indeterminate="data.indeterminate"
                           @change="onAllCheckChange"
                           class="orderList__checkBox orderList__expansitonClickArea is-circle"></el-checkbox>
            </th>
            <template v-for="column of columns">
              <template v-if="column.key==='arcimDesc'">
                <th class="orderList__headTh" >处置状态</th>
                <th class="orderList__headTh"></th>
              </template>
              <th class="orderList__headTh">{{column.title}}</th>
            </template>
          </tr>
        </thead>
      </table>
    </div>
    <div class="orderList__bodyWrapper"
         @scroll="onBodyScroll"
         ref="bodyWrapper">
      <table class="orderList__body orderList__table"
             :style="getTableStyle">
        <colgroup>
          <col :width="checkBoxWidth"></col>
          <template v-for="column of columns" >
            <template v-if="column.key==='arcimDesc'" >
              <col :width="disposeStateWidth"
                   align="center"></col>
              <col :width="groupChartWidth"></col>
            </template>
            <col :width="column.width" align="center"></col>
          </template>
        </colgroup>
        <tbody>
          <order-item class="orderList__row"
                      v-for="(order,index) of data.orders"
                      :class="{'is-selected':index===selectedRowIndex}"
                      :style="calculateRowHeight(order)"
                      @click.native="clickRow(index)"
                      @checkChange="onOrderItemCheckChange"
                      @setPlacerNo="setPlacerNo"
                      v-if="order.show"
                      :key="order.ID"
                      :orderItemIndex="index"
                      :focus="order.focus"
                      :columns="columns"
                      :order="order"
                      :evenRow="index%2===0?1:0">
          </order-item>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import OrderItem from "../orderExcute/OrderItem";
import utils from "../../comm/utils";

let loadingInstance;
export default {
  name: "OrderLIst",
  components: {
    OrderItem
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      disposeStateWidth: "150",
      checkBoxWidth: "40",
      groupChartWidth: "20",
      selectedRowIndex: -1
    };
  },
  watch: {
    data() {
      if (
        typeof this.data !== "undefined" &&
        typeof this.data.orders !== "undefined"
      ) {
        // this.data.orders.sort(utils.compareByProperty("labNo"));
        // if (this.columns.findIndex(column => column.key === "labNo") > -1) {
        //  this.data.orders.sort(utils.compareByTwoProperty("bedCode", "labNo"));
        // } else {
        this.data.orders.sort(
          utils.compareByTwoProperty("bedCode", "createDateTime")
        );
        // }
      }
    },
    requestQueryFlag(value) {
      if (value) {
        const { searchInfo } = this;
        if (
          !utils.formatDate(searchInfo.startDate) ||
          !utils.formatDate(searchInfo.endDate) ||
          !utils.formatTime(searchInfo.startTime) ||
          !utils.formatTime(searchInfo.endTime)
        ) {
          this.$message.error("查询条件错误!");
          this.finishQuery();
          return;
        }
        loadingInstance = this.$loading({
          target: ".orderExcuteView", // ".orderExcuteView__tabs", // ".orderList__bodyWrapper",
          text: "查询数据中..."
        });
        this.$emit("search");
        this.$nextTick(() => {
          this.getOrders();
        });
        // this.getOrders();
      }
    },
    "data.orders": function (value) {
      if (value) {
        return loadingInstance ? loadingInstance.close() : null;
      }
      return null;
    }
  },
  computed: {
    ...mapGetters(["requestQueryFlag", "searchInfo"]),
    getTableStyle() {
      let width = 0;
      this.columns.forEach(column => {
        width += parseFloat(column.width, 10);
      });
      width += parseFloat(this.checkBoxWidth, 10);
      return {
        width: `${width}px`
      };
    }
  },
  methods: {
    ...mapActions(["getOrders"]),
    ...mapMutations([
      "updateSearchInfo",
      "updateOrderListCheckStatus",
      "updateOrdersCheckStatus",
      "finishQuery"
    ]),
    calculateRowHeight(order) {
      let height = 50;
      const arcimObj = this.columns.find(column => column.key === "arcimDesc");
      height += (order.arcimDesc.length + 1) * 16 / arcimObj.width * 16;
      return {
        height: `${height}px`
      };
    },
    clickRow(rowIndex) {
      this.selectedRowIndex = rowIndex;
    },
    onBodyScroll() {
      const scrollLeft = this.$refs.bodyWrapper.scrollLeft;
      this.$refs.headWrapper.scrollLeft = scrollLeft;
    },
    onOrderItemCheckChange() {
      let allCheck = true;
      let existCheck = false;
      this.data.orders.forEach(order => {
        allCheck = allCheck && order.check;
        existCheck = order.check || order.indeterminate || existCheck;
      });
      this.updateOrderListCheckStatus({
        indeterminate: existCheck && !allCheck,
        check: allCheck
      });
    },
    setAllCheckValue(checked) {
      this.updateOrderListCheckStatus({
        check: checked
      });
    },
    onAllCheckChange(checked) {
      const check = this.data.indeterminate || checked;
      this.updateOrdersCheckStatus({
        check,
        indeterminate: false
      });
      this.updateOrderListCheckStatus({
        indeterminate: false
      });
    },
    setPlacerNo(event, orderItem) {
      this.$emit("setPlacerNo", event, orderItem);
    },
    getRowStyle(order) {
      return [`is-${order.disposeStatCode}`];
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b orderList {
  background-color: #f5f5f5;
  /* padding: 10px; */
  overflow: auto;
  & tr[evenrow="0"] {
    /* background-color: #edf1f2; */
  }
  & tr:hover {
    background-color: #edf1f2;
  }
  @e table {
    table-layout: fixed;
    & th {
      /* background-color: #f7f7f7; */
    }
  }
  @e headWrapper {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    color: #a5a5a5;
    font-size: var(--mainFontSize);
    border-bottom: 1px solid #f5f5f5;
  }
  @e head {
    background-color: #f9f9fa;
    border-bottom: 1px solid #ccc;
  }
  @e headTh {
    font-weight: 400;
    height: 40px;
    text-align: center;
  }
  @e bodyWrapper {
    position: absolute !important;
    overflow: auto;
    background-color: #fff;
    /*top: 305px;*/
    /* top: 229px; */
    /* right: 350px; */
    top: 135px;
    left: 270px;
    right: 17px;
    bottom: 17px;
    color: #333;
    /*height:500px*/
  }
  @e checkBox {
    & .el-checkbox__inner {
      /* border: 1px solid #fff; */
      /* background-color: #f5f5f5; */
      height: 17px;
      width: 17px;
      border: 1px solid var(--mainColor);
    }
    & .el-checkbox__input.is-focus .el-checkbox__inner {
      border: 1px solid var(--mainColor);
    }
    & .el-checkbox__inner::after {
      height: 9px;

      border-right: 2px solid #fff !important;
      border-bottom: 2px solid #fff !important;
    }
    & .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
      height: 5px;
      width: 19px;
      left: -2px;
    }
    @when circle {
      & .el-checkbox__inner {
        border-radius: var(--checkBoxBorderRadius);
      }
    }
  }
  @e expansitonClickArea {
    &::before {
      content: "";
      position: absolute;
      display: block;
      top: var(--checkBoxExpansitonClickAreaSize);
      left: var(--checkBoxExpansitonClickAreaSize);
      right: var(--checkBoxExpansitonClickAreaSize);
      bottom: var(--checkBoxExpansitonClickAreaSize);
      cursor: pointer;
      border-radius: var(--checkBoxBorderRadius);
    }
  }
  @e row {
    /* border-bottom: 2px solid #f5f5f5; */
    border-bottom: 1px solid #ccc;
    transition: all 0.3s ease;
    position: relative;
    width: 100%;
    @when LongUnnew {
      background-color: var(--LongUnnewColor);
      color: var(--LongUnnewColor);
    }
    @when NeedToDeal {
      background-color: var(--NeedToDeal);
    }

    @when LongNew {
      background-color: var(--LongNewColor);
    }
    @when Temp {
      background-color: var(--TempColor);
    }
    @when Immediate {
      background-color: var(--ImmediateColor);
    }
    @when SkinTest {
      background-color: var(--SkinTestColor);
    }
    @when Discontinue {
      background-color: var(--DiscontinueColor);
    }
    @when ExecDiscon {
      background-color: var(--ExecDisconColor);
    }
    @when Exec {
      background-color: var(--ExecColor);
    }
    @when NeedToDeal {
      background-color: var(--NeedToDeal);
    }
    @when NeedToStop {
      background-color: var(--NeedToStop);
    }
    @when AlreadyDeal {
      background-color: var(--AlreadyDeal);
    }
    @when AlreadyStop {
      background-color: var(--AlreadyStop);
    }
    /*
    <!--:class="{'is-NeedToDeal':order.disposeStatCode == 'NeedToDeal'}"-->*/
    /*&:hover .orderItem__execTimeChart {
      padding: 0 0 17px 0;
      height: auto;
      overflow: visible;
    }*/
    @when selected {
      background-color: #edf1f2;
    }
  }
}
</style>
