<template>
  <tr class="orderItem">
    <td class="orderItem__checkTd orderItem__td">
      <el-checkbox
        :indeterminate="order.indeterminate"
        :value="order.check"
        @input="setOrderCheckValue"
        @change="onOrderCheckChange"
        class="orderItem__checkBox orderList__expansitonClickArea orderList__checkBox is-circle"
      ></el-checkbox>
    </td>
    <template v-for="(column, index) of columns">
      <!-- column.multiply 表示需要显示多行信息 -->
      <template
        v-if="
          (order.childs.length > 0 && column.multiply) ||
          column.key === 'arcimDesc'
        "
      >
        <template v-if="column.key === 'arcimDesc'">
          <el-popover
            :key="`popover${index}${column.key}${column.ID}`"
            placement="bottom"
            :disabled="!order.execInfos"
            :width="order.execInfos && order.execInfos.length * 100"
            trigger="hover"
            :open-delay="500"
          >
            <order-steps :order="order"></order-steps>
            <order-dispose-stat-info
              slot="reference"
              :key="`stat${index}${column.key}${column.ID}`"
              :infos="getExecsDisposeStatInfos"
              @clickDisposeStat="onClickDisposeStatSpan"
            ></order-dispose-stat-info>
          </el-popover>
          <order-group-char
            :key="`group${index}${column.key}${column.ID}`"
            :num="order.childs.length"
            :childs="order.childs"
          ></order-group-char>
          <order-arcim-desc
            :key="`desc${index}${column.key}${column.ID}`"
            :order="order"
            :code="column.key"
            @clickTimeChartDate="onClickTimeChartDate"
            @clickTimeChartTime="onClickTimeChartTime"
            @setExecCheckValue="setExecCheckValue"
            @execCheckChange="onExecCheckChange"
          ></order-arcim-desc>
        </template>
        <template v-else>
          <td
            class="orderItem__mutiplyTd orderItem__td"
            :key="`orderItemtd${index}${column.key}${column.ID}`"
          >
            <span class="orderItem__itemWrapper">{{ order[column.key] }}</span>
            <template v-for="(child, index) of order.childs">
              <span
                class="orderItem__itemWrapper"
                v-if="child[column.key] && child[column.key] !== ''"
                :key="`orderItemWrapper${index}${column.key}${column.ID}`"
                >{{ child[column.key] }}</span
              >
            </template>
          </td>
        </template>
      </template>
      <template
        v-else-if="column.key === 'attOrdBtn' || column.key === 'addOrdBtn'"
      >
        <td
          v-if="column.key === 'attOrdBtn' || column.key === 'addOrdBtn'"
          :key="`columnBtn${index}${column.key}${column.ID}`"
        >
          <el-button
            type="primary"
            size="mini"
            plain
            @click="openInsOrd(column.key, order)"
            style="padding: 7px 6px"
            >{{ order[column.key] }}</el-button
          >
        </td>
      </template>
      <template v-else>
        <td
          v-if="column.key === 'placerNo'"
          :key="`orderItemtdPlacerNo${index}${column.key}${column.ID}`"
        >
          <el-input
            v-model="order[column.key]"
            ref="placerNoInput"
            @keydown.enter.native="onPlacerNoKeyDown($event)"
          ></el-input>
        </td>
        <td
          v-else
          :class="{ orderItem__notes: column.key === 'notes' }"
          class="orderItem__td"
          :style="{
            color:
              column.key == 'ordStatDesc' && order.ordStatDesc == '停止'
                ? 'red'
                : '',
          }"
          :key="`orderItemtdNotes${index}${column.key}${column.ID}`"
        >
          {{ order[column.key] }}
        </td>
      </template>
    </template>
  </tr>
</template>
<script>
import { mapMutations } from "vuex";
import OrderGroupChar from "./OrderGroupChar";
import OrderDisposeStatInfo from "./OrderDisposeStatInfo";
import OrderArcimDesc from "./OrderArcimDesc";
import OrderSteps from "./OrderSteps";

export default {
  name: "OrderItem",
  props: {
    columns: {
      type: Array,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
    orderItemIndex: {
      type: Number,
      required: true,
    },
    focus: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    OrderGroupChar,
    OrderDisposeStatInfo,
    OrderArcimDesc,
    OrderSteps,
  },
  watch: {
    focus() {
      this.$refs.placerNoInput[0].focus();
    },
  },
  methods: {
    ...mapMutations([
      "updateOrderCheckStatus",
      "updateExecsCheckStatus",
      "updateExecCheckStatus",
      "updateExecsCheckStatusByDisposeStatCode",
      "updateExecsCheckStatusBySttDate",
      "updateExecsCheckStatusBySttTime",
    ]),
    onClickDisposeStatSpan(disposeStatCode, check) {
      if (this.order.execInfos) {
        this.updateExecsCheckStatusByDisposeStatCode({
          index: this.orderItemIndex,
          disposeStatCode,
          check,
        });
        this.onExecCheckChange();
      }
    },
    onClickTimeChartDate(date) {
      this.updateExecsCheckStatusBySttDate({
        index: this.orderItemIndex,
        sttDate: date,
      });
      this.onExecCheckChange();
    },
    onClickTimeChartTime(time) {
      this.updateExecsCheckStatusBySttTime({
        index: this.orderItemIndex,
        sttTime: time,
      });
      this.onExecCheckChange();
    },
    setExecCheckValue(index) {
      this.updateExecCheckStatus({
        index: this.orderItemIndex,
        execIndex: index,
      });
    },
    setOrderCheckValue(checked) {
      this.updateOrderCheckStatus({
        check: checked,
        index: this.orderItemIndex,
      });
    },
    onOrderCheckChange(checked) {
      this.updateExecsCheckStatus({
        check: this.order.indeterminate || checked,
        index: this.orderItemIndex,
      });
      this.updateOrderCheckStatus({
        indeterminate: false,
        index: this.orderItemIndex,
      });
      this.$emit("checkChange");
      this.findSameLabNoOrder(this.order);
    },
    onExecCheckChange() {
      let allCheck = true;
      let existCheck = false;
      this.order.execInfos.forEach((execInfo) => {
        allCheck = allCheck && execInfo.check;
        existCheck = execInfo.check || existCheck;
      });
      this.updateOrderCheckStatus({
        indeterminate: existCheck && !allCheck,
        check: allCheck,
        index: this.orderItemIndex,
      });
      this.$emit("checkChange");
    },
    onPlacerNoKeyDown(event) {
      this.$emit("setPlacerNo", event, this);
    },
    findSameLabNoOrder(order) {
      if (typeof order.labNo !== "undefined") {
        const orderItems = this.$parent.$children;
        const sameLabOrds = orderItems.filter(
          (orderItem) =>
            typeof orderItem.order !== "undefined" &&
            order.labNo !== "" &&
            orderItem.order.labNo === order.labNo &&
            orderItem.order.ID !== order.ID
        );
        sameLabOrds.forEach((sameLabOrd) => {
          this.updateExecsCheckStatus({
            check: order.check,
            index: sameLabOrd.orderItemIndex,
          });
          let allCheck = true;
          let existCheck = false;
          sameLabOrd.order.execInfos.forEach((execInfo) => {
            allCheck = allCheck && execInfo.check;
            existCheck = execInfo.check || existCheck;
          });
          this.updateOrderCheckStatus({
            indeterminate: existCheck && !allCheck,
            check: allCheck,
            index: sameLabOrd.orderItemIndex,
          });
          this.$emit("checkChange");
        });
      }
    },
    openInsOrd(columnKey, order) {
      let linkUrl = `websys.chartbook.hisui.csp?ChartBookName=InpatientOderEntry&PatientID=${order.patientID}&EpisodeID=${order.episodeID}&mradm=${order.mradm}&SwitchSysPat=N`;
      /* global websys_createWindow */
      if (columnKey === "attOrdBtn") {
        linkUrl += `&OeordID=${order.ID}`;
        websys_createWindow(linkUrl, "绑费用", "");
      } else {
        websys_createWindow(linkUrl, "补费用", "");
      }
    },
  },
  computed: {
    getExecsDisposeStatInfos() {
      const exist = {};
      if (this.order.execInfos) {
        this.order.execInfos.forEach((execInfo) => {
          if (exist[execInfo.disposeStatCode]) {
            exist[execInfo.disposeStatCode] += 1;
          } else {
            exist[execInfo.disposeStatCode] = 1;
          }
        });
      } else {
        //  需处理医嘱界面没有医嘱执行记录的情况
        return [
          {
            disposeStatCode: this.order.disposeStatCode,
            // num: 1,
          },
        ];
      }
      return Object.keys(exist).map((key) => ({
        disposeStatCode: key,
        num: exist[key],
      }));
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
:root {
  --execCheckBoxBorderWidth: 2px;
  --checkBoxBorderRadius: 8px;
  --checkBoxExpansitonClickAreaSize: -15px;
}

@b orderItem {
  & .el-checkbox + .el-checkbox {
    margin: 0;
  }
  @e checkTd {
    text-align: center;
  }

  @e mutiplyTd {
    padding: 0;
    position: relative;
    vertical-align: top;
    overflow: visible;
    color: #6b7a8c;
    transition: transform 0.7s ease;
  }
  @e arcimDescTd {
    position: relative;
    vertical-align: top;
    overflow: visible;
    font-weight: bold;
    transition: all 0.7s ease;
    /* height: 50px;*/
  }
  @e notes {
    white-space: normal;
  }
  @e td {
    white-space: nowrap;
    /*overflow: hidden;*/
    color: #6b7a8c;
    text-align: center;
    word-break: break-all;
    text-overflow: ellipsis;
    vertical-align: top;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
      Microsoft YaHei, Noto Sans CJK SC, WenQuanYi Micro Hei, Arial, sans-serif;
    padding: var(--orderItemInterval) 0 0 0;
    transition: transform 0.7s ease;
    font-size: var(--mainOrderFontSize);
  }
  @e itemWrapper {
    margin: var(--orderItemInterval) 0 0 0;
    display: block;
    height: 20px;
    position: relative;
    &:nth-last-of-type(1) {
      margin: var(--orderItemInterval) 0;
    }
  }
}
</style>
