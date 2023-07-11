<template>
  <div class="bedChartContent">
    <div class="waitingRoomsArea" ref="domRootWaitingRoom">
      <waiting-room
        v-for="(wardRoom,index) of wardRooms"
        :key="index"
        :activedWaitRoomIndex="activedWaitRoomIndex"
        :roomIndex="index"
        :data="wardRoom"
        :roomNum="wardRooms.length"
        :selectedWaitingEpisodeID="selectedInfo.waitingEpisodeID"
        @clickWaitingRoom="clickWaitingRoom"
        @clickWaitingPat="clickWaitingPat"
        @clickTransToBed="clickTransBed"
      />
    </div>
    <div class="bedsArea">
      <div class="beds" v-if="!ifShowBedList" ref="bedsContainer">
        <bed
          v-for="(bed,index) of beds"
          :data="bed"
          :key="bed.ID"
          :bedIndex="index"
          :positionInfo="bedsPositonInfo"
          :ifShowDetailInfo="ifShowDetailInfo"
          @clickTransBed="clickTransBed"
          @clickPatient="clickPatient"
          @clickFreeBed="clickFreeBed"
          @clickBorrowBed="clickBorrowBed"
          @clickUpdatePat="clickUpdatePat"
          @mousedown.native="onMouseDown($event,bed)"
        />
      </div>
      <div class="beds" v-if="ifShowBedList">
        <ul class="bedListUl">
          <bed-list
            v-for="(bed,index) of beds"
            :key="bed.ID"
            :index="index"
            :titleIndex="titleIndex"
            :data="bed"
          >
            <!--v-if="(bed.ifShow)&&(bed.patient.episodeID)"-->
          </bed-list>
        </ul>
      </div>
    </div>
    <component
      v-model="ifShowDialog"
      :is="dialogBedTransactionComponentName"
      :dialogTitle="dialogTitle"
      :dialogTransTo="dialogTransTo"
      :transBed="transBed"
      :dialogTransPatient="dialogTransPatient"
      :errorMsg="errorMsg"
      :transType="transType"
      :dialogEpisodeID="getTranToRoomEpisodeID"
      @confirmDialog="confirmDialog"
    ></component>
    <component
      v-model="ifShowDialogUpdateBed"
      :is="dialogBedStatusComponentName"
      :borrowBed="borrowBed"
      :ifBorrowBed="ifBorrowBed"
      :dialogSize="dialogSize"
      :dialogTitle="dialogTitle"
    ></component>
    <component
      v-model="ifShowDialogUpdatePatInfo"
      :is="dialogUpdatePatInfoComponentName"
      :edit="true"
      :dialogParam="dialogUpdatePatInfo"
    ></component>
    <yl-menu :show="menuShow" :x="menuX" :y="menuY" @blur="onMenuBlur">
      <yl-menu-item
        :text="menuItem.menuDesc"
        v-for="menuItem of menu"
        :key="menuItem.menuDesc"
        @click="onMenuClick(menuItem)"
      ></yl-menu-item>
    </yl-menu>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import WaitingRoom from "./WaitingRoom";
import Bed from "./Bed";
import DialogTransaction from "./DialogTransaction";
import DialogBedStatus from "./DialogBedStatus";
import DialogUpdatePatInfo from "./DialogUpdatePatInfo";
import BedList from "./BedList";
import bedApi from "../../store/api/bed";
import roomApi from "../../store/api/room";
import menuParam from "../../comm/menuParam";
import Menu from "../../components/Menu";
import MenuItem from "../../components/MenuItem";
import inserviceApi from "../../store/api/inserviceInterface";
import temperatureApi from "../../store/api/temperature";
import datetTimeFormat from "../../comm/utils";

export default {
  name: "BedChart",
  props: ["searchContent", "searchKeyCode"],
  data() {
    return {
      dialogTitle: "",
      dialogTransTo: "",
      transBed: "",
      dialogTransPatient: "",
      dialogExcuteMethod: null,
      bedsPositonInfo: null,
      borrowBed: null,
      dialogSize: "small",
      ifBorrowBed: false,
      ifShowDialog: false,
      dialogBedTransactionComponentName: "",
      ifShowDialogUpdateBed: false,
      dialogBedStatusComponentName: "",
      errorMsg: "",
      ifShowDialogUpdatePatInfo: false,
      dialogUpdatePatInfoComponentName: "",
      dialogUpdatePatInfo: {
        title: "",
        patInfo: ""
      },
      menuShow: false,
      menuX: 100,
      menuY: 100,
      menu: [],
      transType: "BED",
      dragEpisodeID: ""
    };
  },
  mounted() {
    bedApi.getBedMenu(true).then(menuJson => {
      this.menu = menuJson;
    });
  },
  watch: {
    currentWard() {
      if (!this.ifShowBedList) {
        this.initBedsPositionInfo();
      }
    },
    bedSize() {
      if (!this.ifShowBedList) {
        this.initBedsPositionInfo();
      }
    },
    ifShowDialog(value) {
      if (!value) {
        this.errorMsg = "";
      }
    },
    searchContent(value) {
      // console.log(this.searchKeyCode);
      const valueIsNull = value === "";
      this.beds.forEach((bed, index) => {
        let showFlag = true;
        if (this.searchKeyCode !== "") {
          showFlag = valueIsNull || bed.match(value, this.searchKeyCode);
        } else {
          showFlag =
            valueIsNull ||
            bed.match(value, "bedCode") ||
            bed.match(value, "name") ||
            bed.match(value, "regNo");
        }
        this.updateBedShowState({
          ifShow: showFlag,
          ifFloat: valueIsNull ? false : showFlag,
          index
        });
      });
    }
  },
  computed: {
    ...mapGetters([
      "beds",
      "infoSetting",
      "currentWard",
      "patBedMap",
      "wardRooms",
      "selectedInfo",
      "activedWaitRoomIndex",
      "ifShowDetailInfo",
      "ifShowBedList",
      "ifShowUpdateBedDialog",
      "bedIntervalInfo",
      "bedSize"
    ]),
    getTranToRoomEpisodeID() {
      if (this.dragEpisodeID) {
        return this.dragEpisodeID;
      }
      return this.selectedInfo.episodeID
        ? this.selectedInfo.episodeID
        : this.selectedInfo.waitingEpisodeID;
    },
    titleIndex() {
      let ret = 0;
      for (const elem of this.beds.values()) {
        if (elem.patient.episodeID && elem.ifShow) {
          ret = elem.bedIndex;
          break;
        }
      }
      return ret;
    }
  },
  methods: {
    ...mapMutations(["updateBedShowState", "requestQuery", "finishQuery"]),
    initBedsPositionInfo() {
      // 减去滚动条的位置
      const containerWidth = this.$refs.bedsContainer.offsetWidth - 15;
      const bedWidth = this.bedSize.width;
      const bedHeight = this.bedSize.height;
      const bedInfoHeight = this.bedSize.infoHeight;
      const bedHeadHeight = this.bedSize.headHeight;
      const bedFontSize = this.bedSize.fontSize;
      // 婴儿床与母亲床间隔
      const babyHorizontalInterval = 5;
      // 计算合计床宽
      const bedMergeWidth =
        String(this.currentWard.ifMaternalBabyWard) === "true"
          ? bedWidth + this.currentWard.babyBedWidth + babyHorizontalInterval
          : bedWidth;
      let columns = parseInt(containerWidth / bedMergeWidth, 10);
      let horizontalInterval = 10;
      // 加上水平间隔的宽度如果大于父窗口宽度则 水平床位数减去一
      columns =
        columns * bedMergeWidth + (columns + 1) * horizontalInterval >
        containerWidth
          ? columns - 1
          : columns;
      horizontalInterval =
        (containerWidth - columns * bedMergeWidth) / (columns + 1);
      this.bedsPositonInfo = {
        // 大人床宽
        bedWidth,
        // 大人床高
        bedHeight,
        // 大人床详细信息高
        bedInfoHeight,
        // 卡片头高
        bedHeadHeight,
        // 字体大小
        bedFontSize,
        // 合计床宽
        bedMergeWidth,
        // 婴儿床与母亲床间隔
        babyHorizontalInterval,
        // 婴儿床高
        babyBedHeight: this.currentWard.babyBedHeight,
        // 婴儿床数量
        babyBedNum: this.currentWard.babyBedNum,
        // 婴儿床宽
        babyBedWidth: this.currentWard.babyBedWidth,
        // 一行容纳的床位数
        columns,
        // 床之间的最小水平间隔
        horizontalInterval,
        // 床之间的垂直间隔
        verticalInterval: 10
      };
    },
    clickPatient(patient) {
      this.menuShow = false;
      if (
        patient.data.unavailReason === "" ||
        patient.data.patient.episodeID === this.selectedInfo.waitingEpisodeID
      ) {
        const { episodeID } = this.selectedInfo;
        const selectedEpisodeID =
          episodeID === patient.data.patient.episodeID
            ? ""
            : patient.data.patient.episodeID;
        this.dialogTransPatient = `${patient.data.patient.name}`;
        this.$store.commit("updateSelectedInfo", {
          waitingEpisodeID: "",
          episodeID: selectedEpisodeID,
          waitingRoom: ""
        });
        const patientID = patient.data.patient.patientID;
        const canGiveBirth =
          patient.data.patient.sex === "女" &&
          patient.data.patient.ifNewBaby !== "Y"
            ? "1"
            : "0";
        menuParam.selectBedToTMenu(selectedEpisodeID, patientID, canGiveBirth);
      }
    },
    clickWaitingPat(patient) {
      const { waitingEpisodeID, waitingRoom } = this.selectedInfo;
      const selectedWaitingEpisodeID =
        waitingEpisodeID === patient.data.episodeID
          ? ""
          : patient.data.episodeID;
      const selectedWaitingRoom =
        waitingRoom === patient.waitRoom.desc
          ? waitingRoom
          : patient.waitRoom.desc;
      this.dialogTransPatient = `${patient.data.name}`;
      this.$store.commit("updateSelectedInfo", {
        waitingEpisodeID: selectedWaitingEpisodeID,
        episodeID: "",
        waitingRoom: selectedWaitingRoom
      });
      menuParam.selectBedToTMenu(
        selectedWaitingEpisodeID,
        patient.data.patientID
      );
    },
    clickFreeBed(freeBed) {
      const { episodeID, waitingEpisodeID } = this.selectedInfo;
      const patientEpisodeID = episodeID !== "" ? episodeID : waitingEpisodeID;
      return patientEpisodeID && this.transTo(patientEpisodeID, freeBed, null);
    },
    clickTransBed(freeBed) {
      this.menuShow = false;
      const ifMotherTrans = freeBed.unavailReason === "母亲转科";
      if (
        !ifMotherTrans &&
        (freeBed.unavailPatName !== "" || freeBed.unavailReason !== "")
      ) {
        this.$message({
          type: "warning",
          message: `床位不可用:${freeBed.code}床${freeBed.unavailReason}`,
          showClose: true
        });
        return;
      }
      const { episodeID, waitingEpisodeID } = this.selectedInfo;
      const unavailState = []; // "护士召回", "医嘱调整"
      if (episodeID !== "" || waitingEpisodeID !== "") {
        const patientEpisodeID =
          episodeID !== "" ? episodeID : waitingEpisodeID;
        const patient = this.patBedMap[patientEpisodeID];
        if (
          patient.motherTransLoc === "" &&
          unavailState.indexOf(patient.dischargeStatus) < 0
        ) {
          this.transTo(patientEpisodeID, freeBed, null);
        } else if (unavailState.indexOf(patient.dischargeStatus) > -1) {
          this.$notify({
            title: "通知",
            message:
              "护士召回、医生撤销出院状态的患者不能进行分床,可以在等候区进行医嘱处理!",
            type: "warning",
            duration: 0
          });
        }
      }
    },

    clickWaitingRoom(waitingRoom, dragEpisodeID) {
      if (waitingRoom.data.desc === "转出区") {
        this.$message({
          type: "warning",
          message: "不能将病人分配至转出区!",
          showClose: true
        });
        return "";
      }
      const episodeID = dragEpisodeID || this.selectedInfo.episodeID;
      const patient = this.patBedMap[episodeID];
      if (dragEpisodeID) {
        this.dragEpisodeID = parseInt(dragEpisodeID, 10);
      }
      if (patient.motherTransLoc === "") {
        return episodeID && this.transTo(episodeID, null, waitingRoom);
      }
      return episodeID;
    },
    transToAction(action, freeBed) {
      if (action === "confirm") {
        this.transFreeBed(freeBed);
      }
    },
    transTo(patientEpisodeID, freeBed, waitingRoom) {
      if (freeBed) {
        inserviceApi.ifBedApped(freeBed.ID, patientEpisodeID).then(ret => {
          if (String(ret).replace(/(\r\n)|(\n)|(\s)/g, "") === "Y") {
            this.$msgbox({
              title: "床位状态",
              message: "床位已经被预约是否继续",
              type: "warning",
              showCancelButton: true,
              showConfirmButton: true,
              callback: action => {
                this.transToAction(action, freeBed);
              }
            });
          } else {
            this.transFreeBed(freeBed);
          }
        });
      } else {
        this.dialogBedTransactionComponentName = "DialogTransaction";
        this.ifShowDialog = true;
        this.dialogTitle = `分配${waitingRoom.data.desc}确认`;
        this.dialogTransTo = `${waitingRoom.data.desc}`;
        this.transType = "WAITING";
        this.dialogExcuteMethod = (() => {
          const roomID = waitingRoom.data.ID;
          const excuteMethod = function(episodeID, mainDoc, mainNurse) {
            this.transToRoom(episodeID, roomID, mainDoc, mainNurse);
          };
          return excuteMethod;
        })();
      }
    },
    transFreeBed(freeBed) {
      this.dialogBedTransactionComponentName = "DialogTransaction";
      this.ifShowDialog = true;
      this.dialogTitle = "分床确认";
      this.transType = "BED";
      this.dialogTransTo = `${freeBed.code} 床`;
      this.transBed = freeBed;
      this.dialogExcuteMethod = (() => {
        const bedId = freeBed.ID;
        const excuteMethod = function(
          episodeID,
          mainDoc,
          mainNurse,
          vueComponent
        ) {
          this.transToBed(episodeID, bedId, mainDoc, mainNurse, vueComponent);
        };
        return excuteMethod;
      })();
    },
    transToBed(episodeID, bedID, mainDoc, mainNurse, vueComponent) {
      const transDate = vueComponent.transactionForm.transDate;
      const transTime = vueComponent.transactionForm.transTime;
      bedApi
        .transToBedServer(
          episodeID,
          bedID,
          mainDoc,
          mainNurse,
          transDate,
          transTime
        )
        .then(ret => {
          if (typeof ret === "object" && ret.status.toString() === "0") {
            if (
              this.patBedMap[episodeID].ifFirstToBed &&
              this.patBedMap[episodeID].ifFirstToBed === "Y"
            ) {
              const transactionForm = vueComponent.transactionForm;
              if (
                transactionForm.height !== "" ||
                transactionForm.weight !== "" ||
                transactionForm.temperature !== "" ||
                transactionForm.bloodPressure.sysPressure !== "" ||
                transactionForm.bloodPressure.diaPressure !== ""
              ) {
                this.saveHeightWeight(vueComponent, episodeID);
              } else {
                this.ifShowDialog = false;
                this.requestQuery();
              }
            } else {
              this.ifShowDialog = false;
              this.requestQuery();
            }
          } else {
            this.errorMsg = ret.status;
          }
        });
    },
    transToRoom(episodeID, roomID) {
      const wardID = this.currentWard.wardID;
      this.ifShowDialog = false;
      roomApi.transToRoomServer(episodeID, roomID, wardID).then(ret => {
        if (typeof ret === "object" && ret.status.toString() === "0") {
          this.dragEpisodeID = "";
          this.requestQuery();
        } else {
          this.$message({
            type: "warning",
            message: ret.status.toString(),
            showClose: true
          });
        }
      });
    },
    confirmDialog(episodeID, mainDoc, mainNurse, vueComponent) {
      this.dialogExcuteMethod(episodeID, mainDoc, mainNurse, vueComponent);
    },
    clickBorrowBed(freeBed) {
      this.dialogBedStatusComponentName = "DialogBedStatus";
      const unavailReason = freeBed.data.unavailReason;
      this.ifShowDialogUpdateBed = true;
      this.borrowBed = freeBed.data;
      if (unavailReason === "") {
        this.ifBorrowBed = true;
        this.dialogSize = "950px";
        this.dialogTitle = "修改床位状态";
      } else {
        this.ifBorrowBed = false;
        this.dialogSize = "350px";
        this.dialogTitle = `结束${unavailReason}`;
      }
    },
    clickUpdatePat(bed) {
      this.dialogUpdatePatInfoComponentName = "DialogUpdatePatInfo";
      this.ifShowDialogUpdatePatInfo = true;
      this.dialogUpdatePatInfo.title = "患者基本信息";
      this.dialogUpdatePatInfo.patInfo = bed.data.patient;
    },
    onMouseDown(event, bed) {
      if (event.button === 2 && this.selectedRow !== null) {
        const wardID = this.currentWard.wardID;
        // const { episodeID } = this.selectedInfo;
        if (
          bed.patient &&
          bed.patient.episodeID &&
          bed.patient.currWardID === wardID &&
          bed.unavailReason === ""
        ) {
          // && (episodeID === bed.patient.episodeID)
          this.$store.commit("updateSelectedInfo", {
            waitingEpisodeID: "",
            episodeID: bed.patient.episodeID
          });
          if (this.menu.length > 0) {
            this.menuShow = true;
            this.menuX = event.clientX;
            this.menuY = event.clientY;
            const patient = bed.patient;
            const patientID = patient.data.patient.patientID;
            const canGiveBirth =
              patient.data.patient.sex === "女" &&
              patient.data.patient.ifNewBaby !== "Y"
                ? "1"
                : "0";
            menuParam.selectBedToTMenu(
              patient.episodeID,
              patientID,
              canGiveBirth
            );
          }
        }
      }
    },
    onMenuClick(menuItem) {
      this.menuShow = false;
      this.handleMenuItem(menuItem);
    },
    handleMenuItem(menuItem) {
      const { episodeID } = this.selectedInfo;
      const patient = this.patBedMap[episodeID];
      /* global window */
      const tempUrl =
        patient.ifNewBaby &&
        patient.ifNewBaby === "Y" &&
        menuItem.babyUrlPara !== ""
          ? menuItem.babyUrlPara
          : menuItem.urlPara;
      const winWidth =
        menuItem.width && menuItem.width !== ""
          ? menuItem.width
          : window.screen.availWidth - 50;
      const winHeight =
        menuItem.height && menuItem.height !== ""
          ? menuItem.height
          : window.screen.availHeight - 50;
      const winTop =
        menuItem.top && menuItem.top !== ""
          ? menuItem.top
          : (window.screen.availHeight - winHeight) / 2;
      const winLeft =
        menuItem.left && menuItem.left !== ""
          ? menuItem.left
          : (window.screen.availWidth - winWidth) / 2;
      window.open(
        `${menuItem.menuUrl}?1=1&${tempUrl}&EpisodeID=${episodeID}&PatientID=${
          patient.patientID
        }`,
        menuItem.menuDesc,
        `top=${winTop},left=${winLeft},width=${winWidth},height=${winHeight}`
      );
    },
    onMenuBlur() {
      this.menuShow = false;
    },
    saveHeightWeight(vueComponent, episodeID) {
      const that = vueComponent;
      temperatureApi.getSplitCharDecimal().then(splitChar => {
        datetTimeFormat.getCurrentDateTime("1").then(dateTime => {
          const searchDate = datetTimeFormat.formatDate(new Date());
          const searchTime = dateTime.time;
          const dateTimeSplitChar = String.fromCharCode(
            splitChar.dateTimeSplitChar
          );
          const codeValueSplitChar = String.fromCharCode(
            splitChar.codeValueSplitChar
          );
          const codeSplitChar = String.fromCharCode(splitChar.codeSplitChar);
          const codeArray = [
            "height",
            "weight",
            "temperature",
            "sysPressure",
            "diaPressure"
          ];
          const dateTimeString = `${searchDate}${dateTimeSplitChar}${searchTime}${dateTimeSplitChar}`;
          let editItemValueString = "";
          let codeValueStrs = "";
          codeArray.forEach(code => {
            let codeValueString = "";
            if (code === "sysPressure" || code === "diaPressure") {
              codeValueString = `${code}${codeValueSplitChar}${
                that.transactionForm.bloodPressure[code]
              }`;
            } else {
              codeValueString = `${code}${codeValueSplitChar}${
                that.transactionForm[code]
              }`;
            }
            codeValueStrs += `${codeValueString}${codeSplitChar}`;
          });
          editItemValueString = `${dateTimeString}${codeValueStrs}`;
          if (editItemValueString !== "") {
            temperatureApi
              .saveObsData(episodeID, editItemValueString)
              .then(ret => {
                if (String(ret) !== "0") {
                  this.$message.error("生命体征信息保存失败!");
                  // callBack();
                } else {
                  this.ifShowDialog = false;
                  this.requestQuery();
                }
                /* else {
                  this.$message.error("生命体征信息保存失败!");
                }*/
              });
          }
        });
      });
    }
  },
  components: {
    WaitingRoom,
    Bed,
    BedList,
    YlMenu: Menu,
    YlMenuItem: MenuItem,
    DialogTransaction,
    DialogBedStatus,
    DialogUpdatePatInfo
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
@import "../../assets/main.css";

.bedChartContent {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

.waitingRoomsArea {
  width: var(--accordionList-width);
  height: auto;
  min-width: 180px;
  flex-grow: 0;
}

.bedsArea {
  flex-grow: 1;
  position: relative;
}

.beds {
  height: 100%;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0 5px 5px;
}

.bedListUl {
  padding: 20px 40px;
}

.title {
  color: #333;
  font-size: 14px;
  color: #b0b0b0;
  padding-bottom: 4px;
}

.col {
  float: left;
  text-align: center;
  width: 8%;
  height: 100%;
}

.col1 {
  padding-left: 32px;
}

.col-cell {
  height: 70px;
  vertical-align: middle;
  text-align: center;
  display: table-cell;
}

.bedListLi {
  position: relative;
  width: 98%;
  height: 70px;
  margin: 0 10px;
  border-bottom: 1px solid #f2f2f2;
  background-color: white;
  cursor: pointer;
}
</style>
