<template>
  <div class="summaryInfo">
    <!-- <p>当前在院人数 :
      <span>&nbsp;{{summaryInfo.inHospitalPatNum}}</span>
    </p>-->
    <p>
      在院人数 :
      <span>{{summaryInfo.inHospitalPatNum}}&nbsp;&nbsp;&nbsp;</span>
      <a href="#" @click="clickNeedToDealPatPanel">
        <span class="summaryInfo__needToDeal">需处理人数:&nbsp;</span>
        <span
          class="summaryInfo__num"
          :class="{'bounce':summaryInfo.needToDealPatNum}"
        >{{summaryInfo.needToDealPatNum}}</span>
      </a>
    </p>
    <ArrowPanel
      class="summaryInfo__body"
      v-show="needToDealPatPanelShow"
      @close="closeNeedToDealPatPanel"
      title="医嘱消息"
      :arrowSize="9"
      arrowColor="#ffffff"
      :arrowBorderWidth="1"
      arrowBorderColor="#b5b5b5"
      :arrowLeft="350"
    >
      <summary-info-patient v-for="pat of summaryPats" :key="pat.episodeID" :data="pat" />
    </ArrowPanel>
    <!--<p>当前在院人数 :
      <span>&nbsp;{{summaryInfo.inHospitalPatNum}}</span>
    </p>-->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ArrowPanel from "../../components/ArrowPanel";
import SummaryInfoPatient from "./SummaryInfoPatient";

export default {
  name: "SummaryInfo",
  props: ["currentWard"],
  data() {
    return {
      needToDealPatPanelShow: false
    };
  },
  computed: {
    ...mapGetters(["patBedMap", "beds", "summaryInfo"]),
    summaryPats() {
      let pats = [];
      Object.keys(this.summaryInfo.needToDealPats).forEach(episodeID => {
        if (this.patBedMap[episodeID]) {
          pats.push(this.patBedMap[episodeID]);
        }
      });
      pats = pats.sort((prePat, nextPat) => prePat.bedCode - nextPat.bedCode);
      return pats;
    }
  },
  watch: {
    currentWard() {
      this.needToDealPatPanelShow = false;
    },
    needToDealPatPanelShow(value) {
      const { needToDealPats } = this.summaryInfo;
      if (value) {
        this.$store.commit("updateSelectedInfo", {
          category: ""
          // categoryDetail: '',
        });
      }
      let showIndex = 0;
      this.beds.forEach((bed, index) => {
        let ifShow = false;
        let ifFloat = false;
        if (value) {
          if (needToDealPats[bed.patient.episodeID]) {
            ifShow = true;
            ifFloat = true;
            if (!bed.ifShow) {
              showIndex += 1;
            }
          }
        } else {
          ifShow = true;
          if (!bed.ifShow) {
            showIndex += 1;
          }
        }
        this.$store.commit("updateBedShowState", {
          ifShow,
          ifFloat,
          index,
          showIndex
        });
      });
    }
  },
  methods: {
    clickNeedToDealPatPanel() {
      const { needToDealPatNum } = this.summaryInfo;
      this.needToDealPatPanelShow =
        parseInt(needToDealPatNum, 10) !== 0
          ? !this.needToDealPatPanelShow
          : this.needToDealPatPanelShow;
    },
    closeNeedToDealPatPanel() {
      this.needToDealPatPanelShow = false;
    }
  },
  components: {
    ArrowPanel,
    SummaryInfoPatient
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b summaryInfo {
  font-size: 14px;
  line-height: 30px;
  position: relative;
  text-align: right;
  float: right;
  margin-top: 4px;
  margin-right: 22px;
  @e needToDeal {
    font-size: 38px;
  }
  @e body {
    width: 466px;
    height: 220px;
    right: -10px;
    background-color: white;
    border: 1px solid #b5b5b5;
    border-radius: 6px;
    box-shadow: 2px 2px 15px 1px #bdbcbc;
    z-index: 3;
  }
  @e num {
    color: red;
    display: inline-block;
    font-weight: bold;
    font-size: 48px;
    text-decoration: underline;
  }
}

.shake {
  display: inline-block;
  transform-origin: center center;
}
</style>
