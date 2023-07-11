<template>
  <!--<div class="waitingContent" :style="{ height:data.height+'px', width: data.width+'px',left:data.left+'px', top:data.top+'px'}"-->
  <div class="waitingRoom" @drop="drop" @dragover="dragOver">
    <div class="waitingRoom__head" @click="clickWaitingRoomHead">
      <i :class="getRoomIcon"></i>
      <span>{{data.desc}}</span>
      <span class="waitingRoom__num">{{data.patients.length}}</span>
    </div>
    <transition name="expand">
      <ul
        class="waitingRoom__body"
        v-show="ifShow"
        @click.stop="clickWaitingRoom"
        :style="getStyle"
      >
        <waiting-patient
          v-for="patient of data.patients"
          :data="patient"
          :key="patient.episodeID"
          :waitRoom="data"
          @clickWaitingPat="clickWaitingPat"
          @clickTransToBed="clickTransToBed"
        ></waiting-patient>
      </ul>
    </transition>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import WaitingPatient from "./WaitingPatient";

export default {
  name: "WaitingRoom",
  props: [
    "data",
    "selectedWaitingEpisodeID",
    "roomNum",
    "roomIndex",
    "activedWaitRoomIndex"
  ],
  data() {
    return {
      ifShow: this.activedWaitRoomIndex === this.roomIndex
    };
  },
  watch: {
    activedWaitRoomIndex(value, oldValue) {
      if (value !== oldValue) {
        this.ifShow = this.activedWaitRoomIndex === this.roomIndex;
      }
    }
  },
  computed: {
    ...mapGetters(["selectedInfo"]),
    getStyle() {
      const rootParentHeight = this.$parent.$refs.domRootWaitingRoom
        .offsetHeight;
      const style = {
        height: 0
      };
      style.height = parseInt(rootParentHeight, 10) - this.roomNum * 41 - 25;
      style.height += "px";
      return style;
    },
    getRoomIcon() {
      let iconClass = "";
      const roomCode = this.data.code;
      switch (roomCode) {
        case "W":
          iconClass = "waitingRoom__icon fa fa-clock-o";
          break;
        case "D":
          iconClass = "waitingRoom__icon fa fa-hospital-o";
          break;
        case "P":
          iconClass = "waitingRoom__icon fa fa-bed";
          break;
        default:
          iconClass = "waitingRoom__icon";
          break;
      }
      return iconClass;
    }
  },
  methods: {
    drop(event) {
      const episodeID = event.dataTransfer.getData("Text");
      this.$emit("clickWaitingRoom", this, episodeID);
    },
    dragOver(event) {
      if (this.data.query === "BA") {
        event.preventDefault();
      }
    },
    clickWaitingPat(patient) {
      //  this.selectedIndex = this.selectedIndex === patient.index ? null : patient.index;
      // const { episodeID } = this.selectedInfo;
      // if (episodeID === "") {
      this.$emit("clickWaitingPat", patient);
      // } else {
      //   this.$emit("clickWaitingRoom", this);
      // }
    },
    clickTransToBed(bed) {
      this.$emit("clickTransToBed", bed);
    },
    clickWaitingRoomHead() {
      if (this.activedWaitRoomIndex === this.roomIndex) {
        this.ifShow = !this.ifShow;
      }
      const activedWaitRoomIndex = this.roomIndex;
      this.$store.commit("updateSelWardRoom", {
        activedWaitRoomIndex
      });
    },
    clickWaitingRoom() {
      //   this.$emit('clickWaitingRoom', this.ifExpand);
      this.$emit("clickWaitingRoom", this);
    }
  },
  components: {
    WaitingPatient
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b waitingRoom {
  width: 100%;
  height: auto;
  /*box-shadow: 2px 2px 10px #bdbcbc;*/
  margin: var(--accordionList-margin);
  @e head {
    position: relative;
    line-height: var(--accordionList_head-height);
    width: 100%;
    background-color: var(--accordionList_head-color);
    color: var(--accordionList_head-fontColor);
    font-size: var(--navFontSize);
  }
  @e body {
    /*background-color: #edebe9;*/
    background-color: var(--accordionList_body-color);
    color: #918f8d;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 12px 0 12px 0;
  }
  @e icon {
    margin: var(--accordionList_icon-margin);
    color: var(--accordionList_head-fontColor);
    width: 15px;
  }
  @e num {
    position: absolute;
    display: inline-block;
    top: calc((var(--accordionList_head-height) - 16px) / 2);
    right: var(--accordionList_icon-margin);
    width: 26px;
    height: 16px;
    vertical-align: middle;
    text-align: center;
    line-height: 16px;
    background-color: #cdf2db;
    font-size: var(--subFontSize);
    color: #434343;
    border-radius: 8px;
  }
}

.expand-leave-active {
  transition: height 0.5s ease;
  height: 0 !important;
  overflow: hidden;
}

.expand-enter {
  height: 0 !important;
  overflow: hidden;
}

.expand-enter-active {
  transition: height 0.5s ease;
  overflow: hidden;
}
</style>
