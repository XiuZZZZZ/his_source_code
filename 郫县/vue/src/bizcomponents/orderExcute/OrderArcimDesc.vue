<template>
  <td class="orderArcimDesc orderItem__arcimDescTd" @click="toggleTimeChartShow">
    <span class="orderArcimDesc__sealSpanWrapper" v-if="order.emergency">
      <span class="orderArcimDesc__sealSpan is-emergency">急</span>
    </span>
    <span class="orderArcimDesc__sealSpanWrapper" v-if="order.abnorm!==undefined">
      <span
        class="orderArcimDesc__sealSpan"
        :class="{'is-skinTest':order.abnorm!=='N','is-skinNorm':order.abnorm==='N'}"
      >{{getSkinTestText()}}</span>
    </span>
    <el-tooltip placement="top" effect="light" transition :disabled="!order.libPhaRuleDesc">
      <div
        class="orderArcimDesc__libPhaRuleDesc"
        slot="content"
        v-html="order.libPhaRuleDesc"
      >{{order.libPhaRuleDesc}}</div>
      <span
        class="orderItem__itemWrapper orderArcimDesc__mainOrder"
        @mouseover="onOrderArcimDescHover"
      >
        {{order[code]}}
        <span
          class="orderArcimDesc__orderActDesc"
          v-if="order.actDesc"
        >{{order.actDesc}}</span>
        <el-tooltip
          v-if="order.containerInfo&&order.containerInfo.desc"
          placement="top"
          effect="light"
          transition
          :disabled="order.containerInfo.desc===''"
          :content="`${order.containerInfo.desc}\n${getCollectAttentionFlag&&order.collectAttention?order.collectAttention:''}`"
        >
          <span
            class="orderArcimDesc__orderContainerInfo"
            v-if="order.containerInfo.notes!==''"
            @mouseover="onContainerInfoHover"
            :style="{backgroundColor:`${order.containerInfo.color}`, color:(order.containerInfo.color==='#ffff00'||order.containerInfo.color==='#ffffff')?'#000':'#fff'}"
          >{{order.containerInfo.notes}}</span>
        </el-tooltip>
        <a
          href="#"
          v-if="order.PRESCNO&&order.PRESCNO!==''"
          @click.stop="openPrescWindow(order.PRESCNO)"
        >
          <span class="orderArcimDesc__prescNo" v-if="order.PRESCNO&&order.PRESCNO!==''">方</span>
        </a>
        <span class="orderArcimDesc__oecprDescInfo" v-if="ifOecprDesc(order)">{{order.oecprDesc}}</span>
        <span class="orderArcimDesc__oecprDescInfo" v-if="order.ppdResult">{{order.ppdResult}}</span>
        <span class="orderArcimDesc__JPDescInfo" v-if="ifIPDosing(order)">静配</span>
        <template v-for="(printFlag,index) of printFlags">
          <el-tooltip :key="index" placement="top" effect="light" content="已打印标志">
            <span class="orderArcimDesc__printFlag" :key="index">{{printFlag}}</span>
          </el-tooltip>
        </template>
        <!--<el-popover v-if="order.containerInfo&&order.containerInfo.desc" placement="right" ref="popover" effect="dark" trigger="hover" transition="">
        <img class="orderArcimDesc__containerImage" :src="order.containerInfo.imageUrl" alt=""></image>
        <span class="orderArcimDesc__containerNotice">{{order.containerInfo.notice}}</span>
      </el-popover>
        <span class="orderArcimDesc__orderContainerInfo" v-if="order.containerInfo&&order.containerInfo.desc" v-popover:popover>{{order.containerInfo.desc}}</span>-->
        <el-tooltip
          placement="top"
          effect="dark"
          transition
          :content="`滴速: ${order.speedFlowUnit}`"
          v-if="order.speedFlowRate&&order.childs.length===0"
        >
          <div class="orderArcimDesc__speedFlowWrapper">
            <span class="orderArcimDesc__speedFlowRate">{{order.speedFlowRate}}</span>
            <i class="orderArcimDesc__speedFlowIcon fa fa-tint"></i>
            <span class="orderArcimDesc__speedFlowUnit">{{order.speedFlowUnit}}</span>
          </div>
        </el-tooltip>
      </span>
    </el-tooltip>
    <span
      class="orderItem__itemWrapper orderArcimDesc__childOrder"
      v-for="(child,index) of order.childs"
      v-show="child.orcatDesc&&String(child.orcatDesc).indexOf('草药')<0"
      :key="index"
    >
      {{child[code]}}
      <span class="orderArcimDesc__oecprDescInfo" v-if="ifOecprDesc(child)">{{child.oecprDesc}}</span>
      <span class="orderArcimDesc__orderActDesc" v-if="child.actDesc">{{child.actDesc}}</span>
      <el-tooltip
        placement="top"
        effect="dark"
        :content="`滴速: ${child.speedFlowUnit}`"
        v-if="child.speedFlowRate&&(index===(order.childs.length-1))"
      >
        <div class="orderArcimDesc__speedFlowWrapper">
          <span class="orderArcimDesc__speedFlowRate">{{child.speedFlowRate}}</span>
          <i class="orderArcimDesc__speedFlowIcon fa fa-tint"></i>
          <span class="orderArcimDesc__speedFlowUnit">{{child.speedFlowUnit}}</span>
        </div>
      </el-tooltip>
    </span>
    <span
      class="orderItem__itemWrapper orderArcimDesc__childOrder"
      v-for="(child,index) of order.sameLabNoOrders"
      :key="`sameLabNoOrders${child.ID}${index}`"
    >
      {{child[code]}}
      <span
        class="fa fa-minus-square orderArcimDesc__splitLab cursorPoint"
        v-if="ifTimeChartShow"
        @click.stop="clickSplitLabBtn(child)"
      ></span>
    </span>

    <order-time-chart
      :show="ifTimeChartShow"
      :order="order"
      @clickTimeChartDate="onClickTimeChartDate"
      @clickTimeChartTime="onClickTimeChartTime"
      @setExecCheckValue="setExecCheckValue"
      @execCheckChange="onExecCheckChange"
    ></order-time-chart>
  </td>
</template>
<script>
import OrderTimeChart from "./OrderTimeChart";
import orderApi from "../../store/api/order";

export default {
  name: "OrderArcimDesc",
  props: ["order", "code"],
  data() {
    return {
      ifTimeChartShow: false,
      printFlags: [],
      getCollectAttentionFlag: false
    };
  },
  created() {
    this.printFlags = this.getPrintFlag();
  },
  watch: {
    order() {
      this.printFlags = this.getPrintFlag();
    }
  },
  components: {
    OrderTimeChart
  },
  methods: {
    onOrderArcimDescHover() {
      orderApi.getLibPhaRule(this.order.ID).then(libPhaRule => {
        if (libPhaRule && libPhaRule.length > 0) {
          let libPhaRuleDesc = "";
          libPhaRule.forEach(rule => {
            if (rule.retMsg) {
              rule.retMsg.forEach(retMsg => {
                retMsg.chlidren.forEach((childMsg, childIndex) => {
                  libPhaRuleDesc += `(${childIndex + 1})${childMsg.labelDesc}:${
                    childMsg.alertMsg
                  };<br/>`;
                });
              });
            }
          });
          this.$set(this.order, "libPhaRuleDesc", libPhaRuleDesc);
        }
      });
    },
    onContainerInfoHover() {
      if (this.getCollectAttentionFlag || !this.order.containerInfo) {
        return;
      }
      this.getCollectAttentionFlag = true;
      orderApi.getCollectAttention(this.order.ID).then(collectAttention => {
        this.$set(this.order, "collectAttention", collectAttention);
      });
    },
    clickSplitLabBtn(order) {
      this.$emit("clickSplitLabBtn", order);
    },
    onClickTimeChartDate(date) {
      this.$emit("clickTimeChartDate", date);
    },
    onClickTimeChartTime(time) {
      this.$emit("clickTimeChartTime", time);
    },
    setExecCheckValue(index) {
      this.$emit("setExecCheckValue", index);
    },
    onExecCheckChange() {
      this.$emit("execCheckChange");
    },
    toggleTimeChartShow() {
      this.ifTimeChartShow = !this.ifTimeChartShow;
    },
    getSkinTestText() {
      let text = "皮";
      if (this.order.abnorm === "Y") {
        text = "阳";
      } else if (this.order.abnorm === "N") {
        text = "阴";
      }
      return text;
    },
    ifOecprDesc(order) {
      // 需要显示的附加说明
      const showOecprs = [
        "自备药即刻",
        "自备药长期",
        "取药医嘱",
        "长期嘱托",
        "临时嘱托"
      ];
      return showOecprs.indexOf(order.oecprDesc) > -1;
    },
    ifIPDosing(order) {
      // 静配中心加标志
      let JPFlag = false;
      if (order.execInfos) {
        order.execInfos.forEach(exec => {
          if (exec.filteFlagExtend === "JP") {
            JPFlag = true;
            return JPFlag;
          }
          return JPFlag;
        });
      }
      return JPFlag;
    },
    getPrintFlag() {
      // 打印标志
      const order = this.order;
      const printFlag = [];
      if (order.execInfos) {
        order.execInfos.forEach(exec => {
          if (exec.printFlag.indexOf("P") > -1) {
            if (printFlag.indexOf("条码已打") < 0) {
              printFlag.push("条码已打");
            }
          }
          /* else if (exec.printFlag.indexOf("T") > -1) {
            if (printFlag.indexOf("瓶签已打") < 0) {
              printFlag.push("瓶签已打");
            }
          } else if (exec.printFlag.indexOf("Z") > -1) {
            if (printFlag.indexOf("瓶贴已打") < 0) {
              printFlag.push("瓶贴已打");
            }
          } else if (exec.printFlag.indexOf("S") > -1) {
            if (printFlag.indexOf("输液卡已打") < 0) {
              printFlag.push("输液卡已打输");
            }
          }*/
        });
      }
      return printFlag;
    },
    openPrescWindow(prescNo) {
      const linkUrl = `dhcpha/dhcpha.common.prescpreview.csp?paramsstr=DHCINPHA^${prescNo}^Y+&PrtType=DISPPREVIEW`;
      /* global websys_createWindow */
      websys_createWindow(linkUrl, "处方预览", "");
    }
  }
};
</script>
<style >
@import "../../assets/main.css";

@b orderArcimDesc {
  @e containerImage {
    width: 200px;
    height: 200px;
  }
  @e containerNotice {
    color: #ff5c5c;
    width: 200px;
    display: block;
  }
  @e sealSpanWrapper {
    position: absolute;
    overflow: hidden;
    width: 54px;
    height: 50px;
    top: 0;
    right: 0;
  }

  @e sealSpan {
    position: relative;
    display: block;
    top: -7px;
    left: 10px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    transform: rotate(-30deg);
    border: 2px dotted rgba(255, 0, 0, 0.7);
    font-size: var(--navFontSize);
    z-index: auto;
    border-radius: 15px;
    color: rgba(255, 0, 0, 0.7);
    text-align: center;
    @when emergency {
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 2px solid rgba(255, 0, 0, 0.7);
        border-radius: 50%;
      }
    }
    @when skinTest {
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 2px solid rgba(255, 0, 0, 0.7);
        border-radius: 50%;
      }
    }
    @when skinNorm {
      color: #3dae66;
      border-color: #3dae66;
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 2px solid #3dae66;
        border-radius: 50%;
      }
    }
  }
  @e mainOrder {
    font-size: var(--mainOrderFontSize);
  }
  @e childOrder {
    font-size: var(--mainOrderFontSize);
  }
  @e splitLab {
    position: absolute;
    left: -30px;
    color: red;
    top: 4px;
    transition: all 0.5s ease-in-out;
  }
  @e orderActDesc {
    color: #fff;
    background-color: #ff7368;
    font-size: 12px;
    line-height: 13px;
    position: relative;
    left: 4px;
    font-weight: normal;
    text-align: center;
    display: inline-block;
    padding-top: 2px;
    width: 18px;
    height: 15px;
    padding: 3px 1px 0;
    border-radius: 5px;
  }
  @e orderContainerInfo {
    cursor: pointer;
    color: #fff;
    display: inline-block;
    min-width: 12px;
    min-height: 12px;
    font-size: 11px;
    line-height: 12px;
    vertical-align: middle;
    position: relative;
    left: 4px;
    font-weight: normal;
    text-align: center;
    padding: 4px 3px 3px;
    border-radius: 5px;
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: -15px;
      left: -15px;
      bottom: -15px;
      right: -15px;
    }
  }
  @e speedFlowWrapper {
    position: absolute;
    box-sizing: border-box;
    height: 18px;
    bottom: 0;
    right: 0;
    font-size: 18px;
    width: 50px;
    color: #2cafe7;
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: -15px;
      left: -15px;
      bottom: -15px;
      right: -15px;
    }
  }
  @e speedFlowRate {
  }
  @e speedFlowIcon {
    font-size: 12px;
  }
  @e speedFlowUnit {
    display: none;
    position: relative;
    top: -1px;
  }
  @e oecprDescInfo {
    color: #f52717;
    font-size: 10px;
  }
  @e JPDescInfo {
    color: #9400d3;
    margin-left: 8px;
    font-size: 14px;
  }
  @e printFlag {
    margin-left: 5px;
    color: #ff5c5c;
    font-size: 12px;
  }
  @e libPhaRuleDesc {
    max-width: 300px;
    font-size: 13px;
  }
  @e prescNo {
    cursor: pointer;
    color: #fff;
    background-color: #ff00ff;
    display: inline-block;
    min-width: 12px;
    min-height: 12px;
    font-size: 11px;
    line-height: 12px;
    vertical-align: middle;
    position: relative;
    left: 4px;
    font-weight: normal;
    text-align: center;
    padding: 4px 3px 3px;
    border-radius: 5px;
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: -15px;
      left: -15px;
      bottom: -15px;
      right: -15px;
    }
  }
}
</style>
