<template>
  <li
    @click.stop="clickWaitingPat"
    draggable="true"
    class="waitingPatient"
    :class="{'is-maleSelected': ifSelected&&(data.sex === '男') ,'is-femaleSelected': ifSelected&&(data.sex === '女'),'is-selected': ifSelected}"
  >
    <i class="waitingPatient__icon" v-if="data.sex" :class="getSexClass"></i>
    <span class="waitingPatient__name">{{data.name}}</span>
    <a href="#">
      <span
        class="waitingPatient__lastBedCode fa fa-undo"
        v-if="waitRoom.ID==='99999999||1'"
        @click.stop="cancelTransLocBtnClick"
      ></span>
    </a>
    <span
      class="waitingPatient__dischargeStatus"
      v-if="data.dischargeStatus"
    >{{data.dischargeStatus}}</span>
    <a href="#">
      <i
        class="waitingPatient__transBedBtn fa fa-bed"
        v-if="waitRoom.ID!=='99999999||1'&&data.IPAppBedID&&data.IPAppBedID!==''&&data.lastBedCode===''&&data.roomDesc!=='转移中'"
        @click.stop="transBedBtnClick"
      ></i>
    </a>
    <span
      class="waitingPatient__lastBedCode"
      v-if="waitRoom.ID!=='99999999||1'&&data.lastBedCode&&data.dischargeStatus===''"
    >{{data.lastBedCode}}</span>
    <arrow-panel
      v-if="data.episodeID&&infoSetting.popoverInfo.length>0"
      class="waitingPatient__popoverPatInfo"
      :arrowSize="5"
      arrowColor="#3d3d3d"
      :arrowBorderWidth="1"
      :arrowLeft="10"
      title
    >
      <pat-info :data="data"/>
    </arrow-panel>
  </li>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ArrowPanel from "../../components/ArrowPanel";
import PatInfo from "./PatInfo";
import patApi from "../../store/api/patient";

export default {
  name: "WaitingPatient",
  props: ["data", "waitRoom"],
  methods: {
    ...mapActions(["getLocLinkWards"]),
    clickWaitingPat() {
      this.$emit("clickWaitingPat", this);
    },
    transBedBtnClick() {
      this.$emit("clickWaitingPat", this);
      const bedObj = this.beds.find(bed => bed.ID === this.data.IPAppBedID);
      this.$emit("clickTransToBed", bedObj);
    },
    cancelTransLocBtnClick() {
      const that = this;
      const { episodeID } = this.data;
      this.$confirm("本操作将取消转移, 是否继续?", "重要提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          patApi.cancelTransLocApply(episodeID).then(ret => {
            if (String(ret) === "0") {
              this.$message({
                type: "success",
                message: "取消转移成功!"
              });
              that.getLocLinkWards();
            } else {
              this.$message({
                type: "success",
                message: `取消转移失败!${ret}`
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "未进行取消转移操作!"
          });
        });
    }
  },
  computed: {
    ...mapGetters(["beds", "infoSetting"]),
    getSexClass() {
      return {
        "fa fa-venus is-female": this.data.sex === "女",
        "fa fa-mars is-male": this.data.sex === "男"
      };
    },
    ifSelected() {
      return this.$parent.selectedWaitingEpisodeID === this.data.episodeID;
    }
  },
  components: {
    ArrowPanel,
    PatInfo
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b waitingPatient {
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateX(5px);
    transition: all 0.15s ease-in-out;
  }
  &:hover .waitingPatient__popoverPatInfo {
    visibility: visible;
    opacity: 0.9;
    transform: translateY(10px);
    transition-delay: 0.6s;
  }
  @when maleSelected {
    background-color: #e1d1f6;
  }
  @when femaleSelected {
    background-color: #e2d0e6;
  }
  @when selected {
    border: 1px solid #ca3eb7;
  }
  @e icon {
    margin: 10px;
    padding: 2px 3px;
    border-radius: 2px;
    color: #ffffff;
    @when female {
      background-color: #ff7368;
    }
    @when male {
      background-color: #46a2d7;
    }
  }
  @e transBedBtn {
    margin: 10px;
    padding: 2px 3px;
    border-radius: 2px;
    color: #ffffff;
    background-color: #46a2d7;
  }
  @e lastBedCode {
    color: #fff;
    margin: 10px;
    padding: 2px 3px;
    border-radius: 5px;
    background-color: #ff6201;
  }
  @e dischargeStatus {
    color: #fff;
    margin: 10px;
    padding: 3px 3px;
    border-radius: 8px;
    background-color: #ff5c5c;
    font-size: 12px;
  }
  @e popoverPatInfo {
    z-index: 9999;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    min-width: 260px;
    width: 260px;
    height: 300px;
    transform: translateY(-10px);
    transition-timing-function: ease-in-out;
    transition-duration: 0.5s;
    transition-property: all;
    white-space: nowrap;
  }
  @e name {
    line-height: 36px;
  }
  @e cacelTransBedBtn {
    border-radius: 10px;
    width: 20px;
    height: 20px;
  }
}
</style>
