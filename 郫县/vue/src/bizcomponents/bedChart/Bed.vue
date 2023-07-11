<template>
  <div
    class="bed"
    :class="{
      'is-needToDeal': data.needToDeal,
      'is-inUse': data.patient.episodeID && !ifMotherTrans,
      'is-free': !data.patient.episodeID || ifMotherTrans,
    }"
    :draggable="data.patient"
    @dragstart="dragStart"
    :style="getStyle"
    @click.stop="
      data.patient.episodeID && !data.unavailReason
        ? ifShowDetailInfo
          ? clickBed()
          : ''
        : clickTransBed()
    "
    @dblclick.stop="data.patient.episodeID ? dbclickBed() : ''"
  >
    <template v-if="data.typeCode !== 'MATERNALBABY'">
      <p class="bed__head" :style="getCareLevelHead">
        {{ data.code }} 床
        <span
          @click="updatePatInfo"
          v-if="data.patient.name && data.unavailReason === ''"
        >
          <a class="bed__patientName" :style="getCareLevelHead" href="#">{{
            data.patient.name
          }}</a>
        </span>
      </p>
      <div
        class="bed__printIconGroup"
        :class="{ 'is-inUse': data.patient.episodeID }"
        :style="{
          right: `${positionInfo.bedFontSize * 3}px`,
          top: `${positionInfo.bedHeadHeight / 4}px`,
        }"
        v-if="data.patient.episodeID && !data.unavailReason"
      >
        <a href="#">
          <el-tooltip placement="top" effect="light" content="打印床头卡">
            <img
              class="bed__printIcon"
              :src="'../images/uiimages/bed/printBedCard.png'"
              @click.stop="printBedCard"
            />
          </el-tooltip>

          <el-tooltip placement="top" effect="light" content="腕带">
            <img
              class="bed__printIcon"
              :src="'../images/uiimages/bed/wristband.png'"
              v-if="
                printConfigInfo.wirstBandPrintFlag === 2 ||
                printConfigInfo.wirstBandPrintFlag === 3
              "
              @click.stop="printWristband"
            />
          </el-tooltip>
          <el-tooltip placement="top" effect="light" content="婴儿腕带">
            <img
              class="bed__printIcon"
              :src="'../images/uiimages/bed/wristband.png'"
              v-if="
                printConfigInfo.childWirstBandPrintFlag === 2 ||
                printConfigInfo.childWirstBandPrintFlag === 3
              "
              @click.stop="printChildWristband"
            />
          </el-tooltip>
        </a>
      </div>
      <el-tooltip placement="top" effect="light" content="住院天数">
        <p
          class="bed__num"
          :style="getCareLevelHead"
          v-if="data.patient.inDays"
        >
          {{ data.patient.inDays }}天
        </p>
      </el-tooltip>
      <div
        class="bed__body"
        :class="{
          'is-MaleNew': !ifSelected && ifMale,
          'is-FemaleNew': !ifSelected && ifFemale,
          'is-otherLevelSelected': ifSelected,
        }"
        :style="{
          width: this.positionInfo.bedWidth - 2 + 'px',
          top: `${positionInfo.bedHeadHeight + 2}px`,
        }"
        v-if="ifShowDetailInfo"
      >
        <span
          class="bed__unavailInfo"
          v-if="data.unavailReason && ifShowDetailInfo"
        >
          {{ data.unavailPatName }}&nbsp;&nbsp;{{
            data.unavailReason
          }}&nbsp;&nbsp;{{ data.unavailDays }}
          <span
            class="bed__unavailInfo--unit"
            v-if="data.unavailDays && ifShowDetailInfo"
            >天</span
          >
        </span>
        <el-popover
          placement="right"
          trigger="hover"
          :width="160"
          :disabled="data.BedAppInfo.length < 1"
        >
          <el-steps direction="vertical" :active="1">
            <el-step
              v-for="appinfo in data.BedAppInfo"
              :key="appinfo.AppflagID"
              :title="String(appinfo.AppPat)"
              :description="appinfo.AppDate"
              :style="{ flexBasis: 'none' }"
            ></el-step>
          </el-steps>
          <span
            class="bed__sealSpanWrapper"
            v-if="data.BedAppInfo.length > 0"
            slot="reference"
          >
            <span class="bed__sealSpan is-apped">预</span>
          </span>
        </el-popover>
        <transition name="expand">
          <div
            class="bed__detailInfo"
            :style="{
              height: `${positionInfo.bedInfoHeight}px`,
              fontSize: `${positionInfo.bedFontSize}px`,
              lineHeight: `${positionInfo.bedFontSize + 8}px`,
            }"
            v-if="
              data.patient.episodeID && ifShowDetailInfo && !data.unavailReason
            "
          >
            <p>
              <span class="bed__detailInfo--sex"
                >{{ data.patient.sex }}&nbsp;:</span
              >
              <span class="bed__detailInfo--age">{{ data.patient.age }}</span>
            </p>
            <span
              style="display: block"
              v-for="(value, key) of detailInfo"
              :key="key"
            >
              <span
                v-if="key !== '性别' && key !== '年龄'"
                class="bed__detailInfo--infoKey"
                >{{ key }}&nbsp;:</span
              >
              <span
                v-if="key !== '性别' && key !== '年龄'"
                class="bed__detailInfo--infoValue"
                >{{ value }}</span
              >
            </span>
          </div>
        </transition>
        <div
          class="bed__btnGroup"
          v-if="ifMotherTransSel || !data.patient.episodeID"
        >
          <div
            class="bed__btnContainer"
            v-if="
              (selectedInfo.episodeID !== '' ||
                selectedInfo.waitingEpisodeID != '') &&
              (ifMotherTransSel ||
                (!data.unavailPatName && !data.unavailReason))
            "
          >
            <p class="bed__btnWraper">
              <common-button class="bed__btn" width="70" @click="clickTransBed"
                >分床</common-button
              >
            </p>
          </div>
          <div class="bed__btnContainer" v-if="!ifMotherTrans">
            <p class="bed__btnWraper">
              <common-button
                class="bed__btn"
                :width="data.unavailReason ? 100 : 70"
                @click="clickBorrowBed"
                ref="borrowBedBtn"
                >{{
                  data.unavailReason ? `结束${data.unavailReason}` : "包床"
                }}</common-button
              >
            </p>
          </div>
        </div>
        <div class="bed__foot" :style="{ lineHeight: `${footHeight}px` }">
          <template
            v-for="(image, index) of data.images"
            v-if="!data.unavailReason && image.iconSrc !== '' && image.visible"
          >
            <el-tooltip
              :key="index"
              class="item"
              effect="light"
              placement="bottom-start"
              :open-delay="1000"
              :hide-after="5000"
              :content="String(image.title)"
            >
              <template v-if="image.linkUrl !== ''">
                <a
                  v-if="String(image.iconSrc).indexOf('/') > -1"
                  class="bed__icon"
                  :key="index"
                  :style="{ background: `url(../images/${image.iconSrc})` }"
                  @click="clickImage(image)"
                  href="#"
                ></a>
                <a
                  v-else
                  :key="index"
                  class="bed__iconText"
                  @click="clickImage(image)"
                  >{{ image.iconSrc }}</a
                >
              </template>
              <template v-else>
                <img class="bed__icon" :src="'../images/' + image.iconSrc" />
              </template>
            </el-tooltip>
          </template>
          <span
            class="bed__unavailInfo"
            :class="{ 'is-showDetail': !ifShowDetailInfo }"
            v-if="data.unavailReason && !ifShowDetailInfo"
            >{{ data.unavailPatName }}&nbsp;&nbsp;{{
              data.unavailDays
            }}
            天</span
          >
        </div>
        <arrow-panel
          class="bed__popoverPatInfo"
          v-if="data.patient.episodeID && infoSetting.popoverInfo.length > 0"
          :arrowSize="5"
          arrowColor="#3d3d3d"
          :arrowBorderWidth="1"
          :arrowLeft="10"
          :style="{
            top: `${positionInfo.bedHeight - 30}px`,
            fontSize: `${positionInfo.bedFontSize}px`,
          }"
        >
          <pat-info :data="data.patient" />
        </arrow-panel>
      </div>
    </template>
    <template v-if="data.typeCode === 'MATERNALBABY'">
      <div
        class="babyBed"
        :class="{
          'is-boySelected': ifSelected && ifMale,
          'is-girlSelected': ifSelected && ifFemale,
          'is-simple': !ifShowDetailInfo,
          'is-otherSelected': ifSelected && !ifMale && !ifFemale,
        }"
        :style="{ width: positionInfo.babyBedWidth - 2 + 'px' }"
      >
        <div class="babyBed__babyBody">
          <a href="#" @click="updatePatInfo">
            <img
              class="babyBed__babyIcon"
              :src="'../images/uiimages/bed/' + getSexIcon"
            />
          </a>
          <el-popover ref="printLinks" placement="top" trigger="hover">
            <div @click.stop="printBedCard">
              <a href="#">打印床头卡</a>
            </div>
            <div @click.stop="printChildWristband">
              <!--v-if="printConfigInfo.childWirstBandPrintFlag===2||printConfigInfo.childWirstBandPrintFlag===3">-->
              <a href="#">打印腕带</a>
            </div>
          </el-popover>
          <el-button
            v-popover:printLinks
            icon="el-icon-printer"
            class="babyBed__printLinks"
            size="mini"
          ></el-button>
          <span
            class="babyBed__patName"
            :class="{ 'is-boy': ifMale, 'is-girl': ifFemale }"
          >
            <a class="babyBed__patName" href="#">{{ data.patient.name }}</a>
          </span>
          <!-- <a href="#">
              <img class="babyBed__printIcon"
                :src="'../images/uiimages/bed/printBedCard.png'"
                 @click.stop="printBedCard">
            </a>
            <a href="#"> 
              <img class="babyBed__printIcon"
                :src="'../images/uiimages/bed/wristband.png'"
                 v-if="printConfigInfo.wirstBandPrintFlag===2"
                 @click.stop="printChildWristband">    
          </a>-->
          <a
            href="#"
            v-for="(image, index) of data.images"
            v-if="image.iconSrc !== ''"
            :key="index"
          >
            <img
              class="babyBed__babyIcon"
              :src="'../images/' + image.iconSrc"
              @click="clickImage(image)"
              :title="String(image.title)"
            />
          </a>
        </div>
        <!--<span v-if="ifShowDetailInfo" class="babyBed__medicareNo">{{data.patient.medicareNo}}
            <a href="#"> 
              <img class="babyBed__printIcon"
                 :src="'../images/uiimages/bed/wristband.png'"
                 @click.stop="printChildWristband">    
            </a>     
        </span>-->
        <arrow-panel
          v-if="data.patient.episodeID"
          class="babyBed__popoverPatInfo"
          :arrowSize="5"
          arrowColor="#3d3d3d"
          :arrowBorderWidth="1"
          :arrowLeft="10"
        >
          <pat-info :data="data.patient" />
        </arrow-panel>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import CommonButton from "../../components/CommonButton";
import ArrowPanel from "../../components/ArrowPanel";
import PatInfo from "./PatInfo";
import session from "../../store/api/session";
import printComm from "../../comm/utils";
import bedApi from "../../store/api/bed";

export default {
  name: "Bed",
  props: {
    data: {
      type: Object,
      required: true
    },
    bedIndex: {
      type: Number,
      required: true
    },
    ifShowDetailInfo: Boolean,
    headHeight: {
      type: Number,
      default: 24
    },
    infoHeight: {
      type: Number,
      default: 122
    },
    detailInfoHeight: {
      type: Number,
      default: 36
    },
    footHeight: {
      type: Number,
      default: 24
    },
    positionInfo: {
      type: Object,
      default: {
        bedWidth: 134,
        bedHeight: 130,
        bedHeadHeight: 24,
        bedInfoHeight: 82,
        bedMergeWidth: 273,
        bedFontSize: 14,
        babyHorizontalInterval: 5,
        babyBedWidth: 134,
        babyBedHeight: 22,
        babyBedNum: 3,
        columns: 5, //  一行容纳的床位数一行容纳的床位数
        horizontalInterval: 5, //  床之间的最小水平间隔
        verticalInterval: 5 // 床之间的垂直间隔
      }
    }
  },
  watch: {
    ifShowDetailInfo(value) {
      if (!value) {
        this.positionInfo.bedInfoHeight = 0;
      } else {
        this.positionInfo.bedInfoHeight = this.bedSize.infoHeight;
      }
    }
  },
  computed: {
    ...mapGetters([
      "bedSize",
      "selectedInfo",
      "infoSetting",
      "printConfigInfo"
    ]),
    getSexClass() {
      return {
        "fa fa-venus is-female": this.data.patient.sex === "女",
        "fa fa-mars is-male": this.data.patient.sex === "男"
      };
    },
    detailInfo() {
      //  详细信息根据配置显示
      //  const detailInfoAarray = [];
      const detailInfoObject = {};
      this.infoSetting.detailInfo.forEach(key => {
        const objectKey = this.infoSetting.infoData.find(n => n.key === key);
        if (this.data.patient[key]) {
          // detailInfoAarray.push(this.data.patient[key]);
          detailInfoObject[objectKey.description] = this.data.patient[key];
        } else {
          detailInfoObject[objectKey.description] = "";
        }
      });
      return detailInfoObject;
      // return detailInfoAarray;
    },
    getSexIcon() {
      let icon = "boy.png";
      if (this.data.patient.sex === "女") {
        icon = "girl.png";
      }
      return icon;
    },
    ifMale() {
      return this.data.patient.sex === "男";
    },
    ifFemale() {
      return !this.data.unavailReason && this.data.patient.sex === "女";
    },
    ifMotherTrans() {
      return this.data.unavailReason && this.data.unavailReason === "母亲转科";
    },
    ifMotherTransSel() {
      return (
        this.data.unavailReason &&
        this.data.unavailReason === "母亲转科" &&
        this.selectedInfo.waitingEpisodeID === this.data.patient.episodeID
      );
    },
    ifSelected() {
      return (
        this.data.patient.episodeID &&
        this.selectedInfo.episodeID === this.data.patient.episodeID
      );
    },
    getStyle() {
      const {
        bedWidth,
        bedHeight,
        bedHeadHeight,
        bedInfoHeight,
        bedMergeWidth,
        babyBedWidth,
        columns,
        horizontalInterval,
        verticalInterval,
        babyHorizontalInterval
      } = this.positionInfo;
      // const width = parseInt(this.data.width, 10);
      // const height = parseInt(this.data.height, 10) > maxBedHeight ? maxBedHeight : parseInt(this.data.height, 10);
      let left = 0;
      let top = 0;
      const bedIndex = this.data.bedIndex;
      const columnNo = parseInt(bedIndex % columns, 10);
      const rowNo = parseInt(bedIndex / columns, 10);
      left = columnNo * bedMergeWidth + (columnNo + 1) * horizontalInterval;
      top = rowNo * bedHeight + (rowNo + 1) * verticalInterval;
      let width = bedWidth;
      const footHeight = this.ifShowDetailInfo ? this.footHeight : 0;

      let height = this.ifShowDetailInfo
        ? bedInfoHeight + bedHeadHeight + footHeight
        : bedHeadHeight + footHeight;
      this.positionInfo.bedHeight = this.ifShowDetailInfo
        ? bedInfoHeight + bedHeadHeight + footHeight
        : bedHeadHeight + footHeight;
      // let height = bedHeight;

      if (this.data.typeCode === "MATERNALBABY") {
        // 母婴同室行列数计算
        const { babyBedIndex, motherBedIndex } = this.data;
        const motherColumnNo = parseInt(motherBedIndex % columns, 10);
        const motherRowNo = parseInt(motherBedIndex / columns, 10);
        height = this.positionInfo.babyBedHeight;
        width = babyBedWidth;
        top =
          motherRowNo * bedHeight +
          (motherRowNo + 1) * verticalInterval +
          babyBedIndex * (height + verticalInterval);
        // 母亲床left 加上 婴儿床水平间隔
        left =
          motherColumnNo * bedMergeWidth +
          (motherColumnNo + 1) * horizontalInterval +
          bedWidth +
          babyHorizontalInterval;
      }
      let unavailBackImage = "";
      if (this.data.unavailReason !== "") {
        const imagePath = printComm.getDevImagePath();
        unavailBackImage = `url(${imagePath}bed/${
          this.data.unavailReason
        }.png) no-repeat bottom right #fbfbfb`;
      }
      const zIndex = Math.ceil((20000 - parseInt(top, 10) * 2.5 - left) / 20);
      const style = {
        height: `${height}px`,
        width: `${width}px`,
        left: `${left}px`,
        top: `${top}px`,
        background: `${unavailBackImage}`,
        visibility: "visible",
        position: "absolute",
        opacity: 1,
        zIndex
      };
      if (this.data.ifFloat) {
        style.float = "left";
        style.position = "relative";
        style.left = 0;
        style.top = 0;
        style.margin = "0 20px 20px 0";
      } else if (!this.data.ifShow) {
        style.visibility = "hidden";
        style.opacity = 0;
      }
      return style;
    },
    getCareLevelHead() {
      const levelColor = this.data.patient.careLevelColor;
      let sytle = {
        lineHeight: `${this.positionInfo.bedHeadHeight}px`
      };
      if (levelColor && levelColor !== "") {
        sytle = {
          lineHeight: `${this.positionInfo.bedHeadHeight}px`,
          fontSize: `${this.positionInfo.bedFontSize}px`,
          color: "#ffffff",
          backgroundColor: levelColor,
          borderBottom: `1px solid ${levelColor}`
        };
      }
      return sytle;
    }
  },
  methods: {
    ...mapActions(["getLocLinkWards"]),
    dragStart(event) {
      if (this.data.patient.episodeID) {
        event.dataTransfer.setData(
          "Text",
          this.data.patient.episodeID.toString()
        );
      }
    },
    clickImage(image) {
      const { linkUrl, location, hisui, title } = image;
      if (linkUrl) {
        if (!hisui) {
          /* global websys_createWindow:true */
          websys_createWindow(linkUrl, title, location.replace(/"/g, ""), "");
        } else {
          const locationObj = this.stringToObj(location);
          /* global websys_showModal */
          if (locationObj) {
            websys_showModal({
              title,
              url: linkUrl,
              modal: true,
              top: locationObj.top,
              left: locationObj.left,
              width: locationObj.width ? locationObj.width : "80%",
              height: locationObj.height ? locationObj.height : "60%"
            });
          } else {
            websys_showModal({
              title,
              url: linkUrl,
              modal: true
            });
          }
        }
      }
    },
    stringToObj(location) {
      let tempStr = location;
      if (location !== "") {
        tempStr = tempStr.replace("top", '"top"');
        tempStr = tempStr.replace("left", '"left"');
        tempStr = tempStr.replace("width", '"width"');
        tempStr = tempStr.replace("height", '"height"');
        tempStr = tempStr.replace(/=/g, ":");
        tempStr = `{${tempStr}}`;
        return JSON.parse(tempStr);
      }
      return false;
    },
    clickBed() {
      this.$emit("clickPatient", this);
    },
    clickTransBed() {
      if (
        (this.selectedInfo.episodeID !== "" ||
          this.selectedInfo.waitingEpisodeID) &&
        (typeof this.data.patient.episodeID === "undefined" ||
          this.data.patient.episodeID === this.selectedInfo.waitingEpisodeID)
      ) {
        const episodeID =
          this.selectedInfo.episodeID || this.selectedInfo.waitingEpisodeID;
        if (this.selectedInfo.waitingRoom === "转出区") {
          this.$message({
            type: "error",
            message: "正在转移中的患者请先取消转移",
            showClose: true
          });
          return;
        }
        bedApi.ifBedAvailable(this.data.ID).then(available => {
          if (String(available) === "0") {
            bedApi.ifRoomSexRestrict(episodeID, this.data.ID).then(roomSex => {
              if (String(roomSex) === "0") {
                this.$emit("clickTransBed", this.data);
              } else {
                this.$message({
                  message: "性别与床位要求不符合!",
                  duration: 0,
                  showClose: true,
                  type: "error"
                });
              }
            });
          } else {
            this.getLocLinkWards();
            this.$message({
              message: available.toString(),
              duration: 0,
              showClose: true,
              type: "error"
            });
          }
        });
      }
    },
    dbclickBed() {
      this.$emit("dbclickPatient", this);
    },
    clickBorrowBed() {
      this.$emit("clickBorrowBed", this);
    },
    printBedCard() {
      const ctlocId = session.USER.CTLOCID;
      let printXml = "NurseBedCard.xml";
      if (ctlocId === "85") {
        printXml = "NurseBedCardLocKANGFU.xml";
      }
      if (ctlocId === "368" || ctlocId === "121") {
        printXml = "NurseBedCardFCK.xml";
      }
      const webIP = session.USER.WEBIP;
      const { episodeID } = this.data.patient;
      const ret = tkMakeServerCall(
        "Nur.CommonInterface.Bed",
        "getBedXml",
        episodeID,
        ctlocId
      );
      printComm.showOtherSingleSheet(episodeID, "BedCard", webIP, ret);
    },
    printWristband() {
      /*
      const webIP = session.USER.WEBIP;
      const { episodeID } = this.data.patient;
      /* global prt_Wristband
      // prt_Wristband(episodeID);
      printComm.showNurseExcuteSheetPreview(
        episodeID,
        "PrintWD",
        "O",
        "",
        webIP,
        "true",
        1,
        "NurseOrder.xml"
      );
      */
      const webIP = session.USER.WEBIP;
      const wardID = session.USER.WARDID;
      let printType = "PrintWD";
      if (
        wardID === "31" ||
        wardID === "63" ||
        wardID === "4" ||
        wardID === "40"
      ) {
        printType = "PrintChildWD";
      }
      const { episodeID } = this.data.patient;
      printComm.showNurseExcuteSheetPreview(
        episodeID,
        printType,
        "O",
        "",
        webIP,
        "true",
        1,
        "NurseOrder.xml"
      );
    },
    printChildWristband() {
      const webIP = session.USER.WEBIP;
      const { episodeID } = this.data.patient;
      printComm.showNurseExcuteSheetPreview(
        episodeID,
        "PrintBabyWD",
        "O",
        "",
        webIP,
        "true",
        1,
        "NurseOrder.xml"
      );
    },
    updatePatInfo() {
      this.$emit("clickUpdatePat", this); //  点击病人
      // console.log('updatePatInfo', data);
    }
  },
  components: {
    ArrowPanel,
    PatInfo,
    CommonButton
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
:root {
  --headFontColor: #fff;
  --headBackgroundColor: #fff;
}

@b bed {
  background-color: var(--headBackgroundColor);
  transition: all 0.4s ease;
  @when needToDeal {
  }
  @when inUse {
    /*box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);*/
    /*box-shadow: 1px 1px 6px 1px #bdbcbc;*/

    background-color: #fbfbfb;
    &:hover {
      transform: translateY(-5px);
    }
    &:hover .bed__popoverPatInfo {
      visibility: visible;
      opacity: 0.8;
      transform: translateY(5px);
      transition-delay: 0.6s;
    }
    &:hover .bed__printIcon {
      visibility: visible;
      transition-delay: 0.2s;
    }
  }
  @when free {
    &:hover {
      & .bed__btn {
        transition: all 0.15s ease-in-out;
        transform: translateY(-32px);
        visibility: visible;
      }
    }
  }
  @when baby {
    font-size: 14px;
    border: 1px solid var(--grayBorderColor);
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
    left: 20px;
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
    @when apped {
      color: #f1091d;
      border-color: #f1091d;
      &::before {
        content: "";
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border: 2px solid #f1091d;
        border-radius: 50%;
      }
    }
  }
  @e head {
    /*background-color: #ffffff;*/
    font-size: 14px;
    border: 1px solid #ccc;
    border-bottom: none;
    padding-left: 9px;
    border-bottom: 1px solid var(--grayBorderColor);
    @when free {
      background-color: #fff;
      /*background-color: var(--headBackgroundColor);*/
      color: #999999;
      font-size: 14px;
      padding-left: 9px;
      /* border: 1px solid var(--grayBorderColor); */
      border-bottom: 1px solid #ccc;
    }
    @when invalid {
      background-color: #fbfbfb;
      /*background-color: var(--grayBorderColor);*/
      color: #ffffff;
      font-size: 14px;
      padding-left: 9px;
      /* border: 1px solid var(--grayBorderColor); */
      border-bottom: 1px solid #ccc;
    }
    @when specialLevel {
      color: #ffffff;
      background-color: var(--specialLevelColor);
      border-bottom: 1px solid var(--specialLevelColor);
    }
    @when oneLevel {
      color: #ffffff;
      background-color: var(--oneLevelColor);
      border-bottom: 1px solid var(--oneLevelColor);
    }
    @when twoLevel {
      color: #ffffff;
      background-color: var(--twoLevelColor);
      border-bottom: 1px solid var(--twoLevelColor);
    }
    @when threeLevel {
      color: #ffffff;
      background-color: var(--threeLevelColor);
      border-color: var(--threeLevelColor);
    }
    @when otherLevel {
      border-bottom: 1px solid var(--grayBorderColor);
    }
    @when otherLevelSelected {
      background-color: #f1f1f1;
      border-color: #c6c6c6;
    }
  }
  @e unavailInfo {
    display: inline-block;
    font-size: 18px;
    color: #000;
    padding-top: 10px;
    padding-left: 9px;
    @m unit {
      font-size: 16px;
    }
    @when showDetail {
      font-size: var(--mainFontSize);
    }
  }
  @e appInfo {
    color: red;
    font-size: 13px;
    line-height: 15px;
  }
  @e patientName {
    /*background-color: #ffffff;*/
    font-size: 14px;
    padding-left: 9px;
    @when specialLevel {
      color: #ffffff;
    }
    @when oneLevel {
      color: #ffffff;
    }
    @when twoLevel {
      color: #ffffff;
    }
    @when threeLevel {
      color: #ffffff;
    }
    @when otherLevel {
      color: #ffffff;
    }
  }
  @e printIconGroup {
    display: inline-block;
    margin-right: 8px;
    position: absolute;
  }
  @e printIcon {
    visibility: hidden;
    display: inline-block;
    margin: 0 0 0 3px;
    position: relative;
    transition: all 0.1s ease-in-out;
  }
  @e num {
    display: inline-block;
    position: absolute;
    right: 5px;
    top: 0px;
    font-size: 12px;
    min-width: 20px;
    min-height: 15px;
    padding: 0 5px 0 5px;
    text-align: center;
    border-radius: 5px;
    /* background-color: #fff; */
    color: #000;
    @when careLevel {
      color: #fff;
      /* background-color: #fae7ef; */
    }
  }
  @e body {
    position: absolute;
    bottom: 0px;
    font-size: 18px;
    border-left: 1px solid var(--grayBorderColor);
    border-bottom: 1px solid var(--grayBorderColor);
    border-right: 1px solid var(--grayBorderColor);
    background-color: #f4f4f4;
    color: #666666;
    @when specialLevelSelected {
      background-color: #fff7fa;
      border-color: #ff97b6;
    }
    @when oneLevelSelected {
      background-color: #fff1f0;
      border-color: #ff7165;
    }
    @when twoLevelSelected {
      background-color: #f5fffe;
      border-color: #00d0a7;
    }
    /* update zw 安贞医院区分选中患者颜色修改 */
    @when otherLevelSelected {
      background-color: #5cacee;
      /* border-top: 1px solid var(--grayBorderColor); */
      border-color: #c6c6c6;
    }
    /* add zw 安贞医院用于区分床位底色 */
    @when MaleNew {
      background-color: #8edbff;
      /*border-color:blue;*/
    }
    @when FemaleNew {
      background-color: #fac8d4;
      /*border-color:blue;*/
    }
    /*end*/
  }
  @e info {
    padding: 5px 5px 0px 5px;
    white-space: nowrap;
    overflow: hidden;
    font-size: 13px;
  }
  @e sexIcon {
    display: table-cell;
    vertical-align: middle;
    margin: 0 2px 0 10px;
    font-size: var(--mainFontSize);
    cursor: pointer;
    @when male {
      color: var(--maleColor);
    }
    @when female {
      color: var(--femaleColor);
    }
  }

  @e careLevel {
    vertical-align: top;
    width: 30px;
    height: 18px;
    border-radius: 4px;
    line-height: 18px;
    display: inline-block;
    font-size: 12px;
    position: absolute;
    right: 5px;
    top: 5px;
    color: #5ab0ea;
    @when oneLevel {
      color: #ff6ec7;
    }
    @when specialLevel {
      color: #fc6363;
    }
    @when otherLevel {
      color: #5ab0ea;
    }
  }
  @e admReason {
    display: table-cell;
    vertical-align: middle;
    color: #808080;
    font-size: var(--mainFontSize);
  }
  @e splitChar {
    display: table-cell;
    vertical-align: middle;
    color: #808080;
    font-size: var(--subFontSize);
  }
  @e doctor {
    display: inline-block;
    float: left;
    color: #808080;
    font-size: var(--mainFontSize);
  }
  @e nurse {
    display: inline-block;
    float: right;
    color: #808080;
    font-size: var(--mainFontSize);
  }
  @e detailInfo {
    color: #000;
    /*color: #595959;*/
    padding: 0 0 0 5px;
    overflow: hidden;
    @m sex {
      display: inline-block;
      width: 30%;
    }
    @m age {
      margin-left: 0px;
      display: inline-block;
      width: 67%;
    }
    @m infoKey {
      display: inline-block;
      width: 30%;
      color: #6b6b6b;
      vertical-align: top;
    }
    @m infoValue {
      margin-left: 0px;
      display: inline-block;
      width: 67%;
      vertical-align: top;
    }
    /*background-color: rgba(0, 0, 0, 0.05);
    background-color: rgba(251, 253, 255, 0.5);*/
  }

  @e foot {
    position: absolute;
    bottom: 0;
  }

  @e icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 0 0 4px;
  }
  @e iconText {
    position: relative;
    top: -3px;
    color: #fff;
    background-color: #7db561;
    display: inline-block;
    line-height: 16px;
    font-size: 13px;
    padding: 1px 3px;
    border-radius: 4px;
    margin: 0 0 0 8px;
  }

  @e btnGroup {
    display: flex;
    position: absolute;
    /* top: 40px; */
    flex-flow: column nowrap;
    justify-content: space-around;
    height: 100%;
    width: 100%;
    visibility: hidden;
  }

  @e btn {
    transition: all 0.15s ease-in-out;
  }

  @e btnContainer {
    overflow: hidden;
    height: 32px;
    flex: 0 0 auto;
    text-align: center;
  }

  @e btnWraper {
    position: relative;
    top: 32px;
    display: block;
    height: 100%;
    width: 100%;
  }
  @e popoverPatInfo {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    min-width: 310px;
    min-height: 100px;
    transform: translateY(-30px);
    transition-timing-function: ease-in-out;
    transition-duration: 0.2s;
    transition-property: all;
    white-space: nowrap;
  }
  & .arrowPanel__content {
    overflow: visible;
  }
}

@b babyBed {
  border: 1px solid #ccc;
  overflow: hidden;
  &:hover .babyBed__popoverPatInfo {
    visibility: visible;
    opacity: 0.9;
    transform: translateY(10px);
    transition-delay: 0.6s;
  }
  &:hover .babyBed__printIcon {
    visibility: visible;
    transition-delay: 0.2s;
  }
  @when boySelected {
    background-color: #ebf5fa;
    border: 1px solid var(--maleColor);
  }
  @when girlSelected {
    background-color: #fff1f0;
    border: 1px solid var(--femaleColor);
  }
  @when otherSelected {
    background-color: #ebf5fa;
    border: 1px solid #ca3eb7;
  }
  @when simple {
    margin: 3px 0 2px 0;
  }
  @e babyBody {
    display: inline-block;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
  }
  @e patName {
    font-size: 14px;
    @when boy {
      color: var(--maleColor);
    }
    @when girl {
      color: var(--femaleColor);
    }
  }
  @e medicareNo {
    display: inline-block;
    height: 14.5px;
    font-size: 14px;
    padding-left: 30px;
  }
  @e popoverPatInfo {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    min-width: 260px;
    width: 260px;
    height: 300px;
    transform: translateY(-10px);
    transition-timing-function: ease-in-out;
    transition-duration: 0.2s;
    transition-property: all;
    white-space: nowrap;
  }
  @e printIcon {
    visibility: hidden;
    display: inline-block;
    margin: 3px 3px 0 0;
    position: relative;
    transition: all 0.1s ease-in-out;
  }
  @e printLinks {
    border-style: none;
    margin: 2px 0 2px 0;
    padding: 3px;
    background: transparent;
  }
  @e babyIcon {
    vertical-align: sub;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 0 0 4px;
  }
  & .arrowPanel__content {
    overflow: visible;
  }
}

/*.iconInfo {
  vertical-align: middle;
  background-repeat: no-repeat;
  background-image: url('../../assets/bed/info.png');
}*/

.expand-leave-active {
  transition: height 0.3s ease;
  height: 0 !important;
  overflow: hidden;
}

.expand-enter {
  height: 0 !important;
  overflow: hidden;
}

.expand-enter-active {
  transition: height 0.3s ease;
  overflow: hidden;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-enter {
  transform: translateX(100px);
}
.el-popover {
  min-width: 30px;
}
& .el-tooltip__popper {
  font-size: 14px;
}
</style>
