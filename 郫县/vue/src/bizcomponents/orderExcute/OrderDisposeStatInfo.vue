<template>
  <td class="orderItem__td orderDisposeStatInfo" style="position:relative">
    <template v-for="info of infos">
      <!-- <el-tooltip placement="top"
                                                effect="dark"
                                                transition=""
                                                :content="`${disposeStateInfo[info.disposeStatCode]} : ${info.num}条`">
                                      <span class="orderDisposeStatInfo__disposeStat cursorPoint is-circle"
                                            :style="getDisposeStatSpanStyle(index)"
                                            :class="getDisposeStatSpanClass(info.disposeStatCode)"
                                            @click.stop="onClickDisposeStatSpan(info.disposeStatCode)">
                                        {{info.num}}
                                      </span>
      </el-tooltip>-->
      <a
        href="#"
        v-if="info.disposeStatCode"
        class="orderDisposeStatInfo__disposeStat cursorPoint is-label"
        :key="info.disposeStatCode"
        :class="getDisposeStatSpanClass(info.disposeStatCode)"        
      ><!--@click.stop="onClickDisposeStatSpanLabel(info.disposeStatCode)"-->
        &nbsp;&nbsp;{{disposeStateInfo[info.disposeStatCode]}}
        <span
          class="orderDisposeStatInfo__triangle"
          :class="getDisposeStatSpanClass(info.disposeStatCode)"
        >
          <span class="orderDisposeStatInfo__circle"></span>
        </span>
        <span v-if="info.num" class="orderDisposeStatInfo__num">{{info.num}}</span>
      </a>
    </template>
  </td>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "OrderDisposeStatInfo",
  props: ["infos"],
  data() {
    const selectInfo = {};
    this.infos.forEach(info => {
      selectInfo[info.disposeStatCode] = false;
    });
    return {
      selectInfo
    };
  },
  watch: {
    infos(value) {
      value.forEach(info => {
        this.selectInfo[info.disposeStatCode] = false;
      });
    }
  },
  computed: {
    ...mapGetters(["disposeStateInfo"])
  },
  methods: {
    getDisposeStatSpanStyle(index) {
      return {
        left: `${25 * index + 5}px`
      };
    },
    getDisposeStatSpanClass(disposeStatCode) {
      return [
        `is-${disposeStatCode}`,
        this.selectInfo[disposeStatCode] ? "is-selected" : ""
      ];
    },
    onClickDisposeStatSpan(disposeStatCode) {
      this.$emit("clickDisposeStat", disposeStatCode);
    },
    onClickDisposeStatSpanLabel(disposeStatCode) {
      if (this.infos[0].num) {
        this.selectInfo[disposeStatCode] = !this.selectInfo[disposeStatCode];
        this.$emit(
          "clickDisposeStat",
          disposeStatCode,
          this.selectInfo[disposeStatCode]
        );
      }
    }
  }
};
</script>
<style >
@import "../../assets/main.css";
:root {
  --orderItemInterval: 15px;
}
@b orderDisposeStatInfo {
  padding-top: 10px;
  @e num {
    display: inline-block;
    position: absolute;
    right: 4px;
    line-height: 14px;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    padding: 1px 0;
    /* background-color: #fff; */
    /* color: #6b7a8c; */
    border-radius: 2px;
    min-width: 10px;
    text-align: center;
  }
  @e circle {
    position: absolute;
    top: -4px;
    left: 10px;
    background-color: #fff;
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 5px;
  }
  @e triangle {
    display: block;
    /* background-color: #000; */
    width: 0px;
    height: 0px;
    position: absolute;
    border-width: 13px;
    border-style: solid;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    left: -26px;
    top: 0;
    @when LongUnnew {
      border-right-color: var(--LongUnnewColor);
    }
    @when LongNew {
      border-right-color: var(--LongNewColor);
    }
    @when Temp {
      border-right-color: var(--TempColor);
    }
    @when Immediate {
      border-right-color: var(--ImmediateColor);
    }
    @when SkinTest {
      border-right-color: var(--SkinTestColor);
    }
    @when SkinTestAbnorm {
      border-right-color: var(--SkinTestAbnorm);
    }
    @when SkinTestNorm {
      border-right-color: var(--AlreadyDeal);
    }
    @when Discontinue {
      border-right-color: var(--DiscontinueColor);
    }
    @when ExecDiscon {
      border-right-color: var(--ExecDisconColor);
    }
    @when Exec {
      border-right-color: var(--ExecColor);
    }
    @when NeedToDeal {
      border-right-color: var(--NeedToDeal);
    }
    @when NeedToStop {
      border-right-color: var(--NeedToStop);
    }
    @when AlreadyDeal {
      border-right-color: var(--AlreadyDeal);
    }
    @when AlreadyStop {
      border-right-color: var(--AlreadyStop);
    }
    @when RefuseDispDrug {
      border-right-color: var(--RefuseDispDrug);
    }
    @when SpecmentReject {
      border-right-color: var(--SpecmentReject);
    }
  }
  @e disposeStat {
    display: block;
    font-weight: normal;
    font-size: 14px;
    height: 16px;
    position: relative;
    color: #fff;
    @when selected {
      /* background-color: #e5f2fa; */
      /* color: #017bce; */
      & .orderDisposeStatInfo__circle {
        background-color: transparent;
      }
    }
    @when label {
      text-align: left;
      /* background-color: #fff; */
      padding: 5px 5px;
      color: #000;
      /* width: 95px; */
      /* min-width: 90px; */
      width: 90px;
      font-size: 12px;
      margin-top: 2px;
      margin-bottom: 2px;
      margin-left: 20px;
    }
    @when circle {
      text-align: center;
      position: absolute;
      top: calc(var(--orderItemInterval) + 1px);
      width: 20px;
      line-height: 20px;
      border-radius: 20px;
    }
    @when LongUnnew {
      background-color: var(--LongUnnewColor);
      color: var(--LongUnnewColor);
    }
    @when LongNew {
      background-color: var(--LongNewColor);
      color: var(--LongNewColor);
    }
    @when Temp {
      background-color: var(--TempColor);
      color: var(--TempColor);
    }
    @when Immediate {
      background-color: var(--ImmediateColor);
      color: var(--ImmediateColor);
    }
    @when SkinTest {
      background-color: var(--SkinTestColor);
      color: var(--SkinTestColor);
    }
    @when SkinTestNorm {
      background-color: var(--AlreadyDeal);
      color: var(--AlreadyDeal);
    }
    @when SkinTestAbnorm {
      background-color: var(--SkinTestAbnorm);
      color: var(--SkinTestAbnorm);
    }
    @when Discontinue {
      background-color: var(--DiscontinueColor);
      color: var(--DiscontinueColor);
    }
    @when ExecDiscon {
      background-color: var(--ExecDisconColor);
      color: var(--DiscontinueColor);
    }
    @when Exec {
      background-color: var(--ExecColor);
      color: var(--ExecColor);
    }
    @when NeedToDeal {
      background-color: var(--NeedToDeal);
      color: var(--NeedToDeal);
    }
    @when NeedToStop {
      background-color: var(--NeedToStop);
      color: var(--NeedToStop);
    }
    @when AlreadyDeal {
      background-color: var(--AlreadyDeal);
      color: var(--AlreadyDeal);
    }
    @when AlreadyStop {
      background-color: var(--AlreadyStop);
      color: var(--AlreadyStop);
    }
    @when RefuseDispDrug {
      background-color: var(--RefuseDispDrug);
      color: var(--RefuseDispDrug);
    }
    @when SpecmentReject {
      background-color: var(--SpecmentReject);
      color: var(--SpecmentReject);
    }
  }
}
</style>
