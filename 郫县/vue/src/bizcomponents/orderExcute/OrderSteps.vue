<template>
    <el-steps class="orderSteps" align-center>
        <el-step v-for="(exec,index) in order.execInfos" :key="`step${exec.ID}`" :status="getStatus(exec)" 
        v-if="index<10">
        <div class="orderSteps__title" slot="title">
            <span class="orderSteps__title--date">{{exec.sttDate}}</span>
            <span class="orderSteps__title--time">{{exec.sttTime}}</span>
        </div>
        <div class="orderSteps__desc" slot="description">
            <span class="orderSteps__desc--updater" v-if="exec.execCtcpDesc!==''">{{exec.execCtcpDesc}}</span>
            <span class="orderSteps__desc--updateTime" v-if="exec.execDateTime!==''">{{exec.execDateTime}}</span>
            <span class="orderSteps__desc--printFlag" v-for="(print,index) in getPrintFlag(exec)" :key="`print${exec.ID}${index}`">{{print}}</span>
        </div>
        </el-step>
         <el-step v-if="order.execInfos&&order.execInfos.length>9" title="······"/>
    </el-steps>
</template>
<script>
export default {
  name: "OrderSteps",
  props: ["order"],
  methods: {
    getStatus(exec) {
      if (exec.disposeStatCode === "Exec" && exec.printFlag === "") {
        return "finish";
      }
      if (exec.disposeStatCode === "Exec" && exec.printFlag !== "") {
        return "success";
      }
      if (exec.disposeStatCode !== "Exec" && exec.printFlag !== "") {
        return "process";
      }
      return "wait";
    },
    getPrintFlag(exec) {
      const printFlag = [];
      if (exec.printFlag.indexOf("P") > -1) {
        if (String(printFlag).indexOf("条码已打") < 0) {
          printFlag.push("条码已打");
        }
      } else if (exec.printFlag.indexOf("T") > -1) {
        if (printFlag.indexOf("瓶签已打") < 0) {
          printFlag.push("瓶签已打");
        }
      } else if (exec.printFlag.indexOf("Z") > -1) {
        if (printFlag.indexOf("瓶贴已打") < 0) {
          printFlag.push("瓶贴已打");
        }
      } else if (exec.printFlag.indexOf("S") > -1) {
        if (printFlag.indexOf("输液卡已打") < 0) {
          printFlag.push("输液卡已打");
        }
      } else if (exec.printFlag.indexOf("Y") > -1) {
        if (printFlag.indexOf("执行单已打") < 0) {
          printFlag.push("执行单已打");
        }
      }
      return printFlag;
    }
  }
};
</script>
<style>
@b orderSteps {
  & .el-step__title {
    font-size: 14px;
    line-height: 14px;
  }
  & .el-step__main {
    min-width: 100px;
  }
  & .el-step.is-center .el-step__description {
    padding-left: 0;
    padding-right: 0;
  }
  & .el-step.is-horizontal {
    max-width: none !important;
  }

  @e title {
    @m date {
      display: block;
    }
    @m time {
      display: block;
    }
  }
  @e desc {
    margin-top: 3px;
    line-height: 15px;
    @m updater {
      min-width: 100px;
      display: block;
    }
    @m updateTime {
      min-width: 100px;
      display: block;
    }
    @m printFlag {
      min-width: 100px;
    }
  }
}
</style>

