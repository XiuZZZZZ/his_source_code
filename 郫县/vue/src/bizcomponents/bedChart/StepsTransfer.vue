<template>
  <el-steps class="stepsTransfer" :space="70" direction="vertical">
    <div class="stepsTransfer__round">
    </div>
    <div class="stepsTransfer__stepLineBegin"></div>
    <el-step v-for="(item,index) in transferRecords" :active="1" :key="index">
      <span class="stepsTransfer__title" :class="{'is-regInHosp':item.transType==='入院登记','is-firstToBed':item.transType==='首次分床',
                                                                                                            'is-changeBed':item.transType==='分床','is-transWard':item.transType==='转病区','is-transDept':item.transType==='转科'}" slot="title">{{getTransStepTitle(item)}}
      </span>
      <template class="stepsTransfer__description" slot="description">
        <div class="stepsTransfer__description--firstLine" v-if="item.transFrom!==''">
          原：{{item.transFrom}}
        </div>
        <div class="stepsTransfer__description--secondLine" v-if="item.transTo!==''">
          现：{{item.transTo}}
        </div>
      </template>
      <i :class="getTransStepIcon(item)" slot="icon"></i>
    </el-step>
    <div class="stepsTransfer__stepLineEnd"></div>
    <div class="stepsTransfer__round"></div>
  </el-steps>
</template>
<script>
import patApi from "../../store/api/patient";

export default {
  name: "StepsTransfer",
  props: ["episodeID"],
  data() {
    return {
      transferRecords: []
    };
  },
  watch: {
    episodeID() {
      this.getTransRecords();
    }
  },
  mounted() {
    this.getTransRecords();
  },
  methods: {
    getTransRecords() {
      this.transferRecords = [];
      patApi.getTransRecords(this.episodeID).then(data => {
        this.transferRecords = data;
      });
    },
    getTransStepTitleCss(item) {
      if (item.transType === "首次分床") {
        return "stepsTransfer__title";
      }
      return "";
    },
    getTransStepTitle(item) {
      return `${item.transDate} ${item.transTime}|${item.transType}|${
        item.transUser
      }`;
    },
    getTransStepDesc(item) {
      if (item.transFrom !== "") {
        return `原:${item.transFrom} 现:${item.transTo}`;
      }
      return `${item.transTo}`;
    },
    getTransStepIcon(item) {
      const transType = item.transType;
      let iconCSS = "";
      switch (transType) {
        case "入院登记":
          iconCSS = "stepsTransfer__icon--regInHosp fa fa-registered fa-lg";
          break;
        case "首次分床":
          iconCSS = "stepsTransfer__icon--firstToBed fa fa-bed fa-lg";
          break;
        case "分床":
          iconCSS = "stepsTransfer__icon--changeBed fa fa-exchange fa-lg";
          break;
        case "转病区":
          iconCSS =
            "stepsTransfer__icon--transWard fa fa-arrow-circle-right fa-lg";
          break;
        case "转科":
          iconCSS =
            "stepsTransfer__icon--transDept fa fa-arrow-circle-o-right fa-lg";
          break;
        default:
          iconCSS = "";
          break;
      }
      return iconCSS;
    }
  }
};
</script>
<style>
@b stepsTransfer {
  margin: 10px 0px;
  & .el-step__title {
    font-size: 14px;
    line-height: normal;
    display: inline-block;
    width: 350px;
  }
  & .el-step.is-vertical {
    display: flex;
    max-width: 100% !important;
  }
  & .el-step.is-vertical .el-step__title {
    padding-bottom: 0px;
  }

  & .el-step__head.is-text {
    font-size: 14px;
    border-style: none;
  }

  & .el-step__description.is-wait {
    color: #666666;
  }
  @e title {
    @when regInHosp {
      color: #7322a9;
    }
    @when firstToBed {
      color: #e87e2b;
    }
    @when changeBed {
      color: #6aad4a;
    }
    @when transWard {
      color: #2c79b9;
    }
    @when transDept {
      color: #eb5e45;
    }
  }
  @e icon {
    text-align: center;
    @m regInHosp {
      color: #7322a9;
    }
    @m firstToBed {
      color: #e87e2b;
    }
    @m changeBed {
      color: #6aad4a;
    }
    @m transWard {
      color: #2c79b9;
    }
    @m transDept {
      color: #eb5e45;
    }
  }
  @e description {
    color: black;
    @m firstLine {
      margin: 0px 0px 0px 0px;
    }
    @m secondLine {
      margin: 0px 0px 0px 0px;
    }
  }
  @e round {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    border-width: 2px;
    border-style: solid;
    border-color: #ccc;
    margin-left: 5px;
  }

  @e stepLineBegin {
    margin-left: 8px;
    width: 2px;
    height: 30px;
    box-sizing: border-box;
    top: 32px;
    bottom: 0;
    margin-left: 11px;
    display: inline-block;
    background-color: #bfcbd9;
  }
  @e stepLineEnd {
    margin-left: 8px;
    width: 2px;
    height: 30px;
    box-sizing: border-box;
    top: 32px;
    bottom: 0;
    margin-left: 11px;
    display: inline-block;
    background-color: #bfcbd9;
  }
}
</style>
