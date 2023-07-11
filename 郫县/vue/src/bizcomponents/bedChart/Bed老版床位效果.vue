<template>
  <div class="bed" :class="{'is-needToDeal':data.needToDeal,'is-inUse':data.patient.episodeID,'is-free':!data.patient.episodeID}" draggable="true" :style="getStyle" @click.stop="data.patient.episodeID?clickBed():''" @dblclick.stop="data.patient.episodeID?dbclickBed():''">
    <template v-if="data.typeCode!=='MATERNALBABY'">
      <p class="bed__head" :style="{ lineHeight: `${headHeight}px` }" :class="{ 'is-free':(!data.patient.episodeID)&&(data.unavailPatName == ''),'is-invalid': data.unavailPatName !== '','is-male':ifMale, 'is-female':ifFemale }">{{data.code}} 床</p>
      <div class="bed__printIconGroup" :class="{'is-inUse':data.patient.episodeID}" v-if="data.patient.episodeID">
        <a href="#">
          <img class="bed__printIcon" :src="'../images/uiimages/bed/printBedCard.png'" @click.stop="printBedCard">
          <img class="bed__printIcon" :src="'../images/uiimages/bed/wristband.png'" v-if="printConfigInfo.wirstBandPrintFlag===2" @click.stop="printWristband">
        </a>
      </div>
      <p class="bed__num" :class="{'is-male':(data.patient.sex === '男'),'is-female': (data.patient.sex === '女') }" v-if="data.patient.inDays">{{data.patient.inDays}}</p>
      <div class="bed__body" :class="{'is-maleSelected': ifSelected&&(data.patient.sex === '男') ,'is-femaleSelected': ifSelected&&(data.patient.sex === '女')}" :style="{ width: (this.positionInfo.bedWidth-2)+'px'}">
        <div class="bed__info" :style="{ height: `${infoHeight}px` }">
          <p style="display:block;" :style="{lineHeight:`${infoHeight/2}px`}">
            <template v-if="data.patient.episodeID">
              <i class="bed__sexIcon" :class="getSexClass" v-if="data.patient.sex">&nbsp;&nbsp;</i>
              <!--<div class="icon iconInfo">-->
              <span class="bed__patientName" :class="{ 'is-male':ifMale, 'is-female':ifFemale}" @click="updatePatInfo">
                <a href="#" class="bed__patientName" :class="{ 'is-male':ifMale, 'is-female':ifFemale}">{{data.patient.name}}&nbsp;&nbsp;</a>
              </span>
              <span class="bed__splitChar">|&nbsp;&nbsp;</span>
              <span class="bed__admReason">{{data.patient.admReason}}</span>
              <span class="bed__careLevel" :class="{ 'is-oneLevel':ifOneLevel, 'is-specialLevel':ifSpecialLevel}">{{data.patient.careLevel}}</span>
            </template>
            <span class="bed__patientName is-unavail" v-if="data.unavailReason">&nbsp;&nbsp;{{data.unavailPatName}}&nbsp;{{data.unavailReason}}</span>
          </p>
          <p style="display:block;" :style="{lineHeight:`${infoHeight/2}px`}">
            <template v-if="data.patient.episodeID">
              <span class="bed__doctor">&nbsp;医&nbsp;:&nbsp;{{data.patient.mainDoctor}}</span>
              <span v-if="data.patient.mainNurse" class="bed__nurse">&nbsp;护&nbsp;:&nbsp;{{data.patient.mainNurse}}&nbsp;</span>
            </template>
          </p>
        </div>
        <transition name="expand">
          <div class="bed__detailInfo" :style="{ height: `${positionInfo.bedHeight-headHeight-infoHeight-footHeight-2}px` }" v-if="data.patient.episodeID&&ifShowDetailInfo">
            <span v-for="value of detailInfo">{{value}}&nbsp&nbsp</span>
          </div>
        </transition>
        <div class="bed__btnGroup" v-if="!data.patient.episodeID">
          <div class="bed__btnContainer" v-if="(selectedInfo.episodeID||selectedInfo.waitingEpisodeID)&&!data.unavailPatName&&!data.unavailReason">
            <p class="bed__btnWraper">
              <common-button class="bed__btn" width="70" @click="clickBed">
                分床
              </common-button>
            </p>
          </div>
          <div class="bed__btnContainer">
            <!--:style="{overflow:'hidden',height:((selectedInfo.episodeID||selectedInfo.waitingEpisodeID)||data.unavailPatName)?'50%':'100%'}">-->
            <p class="bed__btnWraper">
              <common-button class="bed__btn" :width="data.unavailReason?100:70" @click="clickBorrowBed" ref="borrowBedBtn">
                {{data.unavailReason?`结束${data.unavailReason}`:"包床"}}
              </common-button>
            </p>
          </div>
        </div>
        <div class="bed__foot" :style="{ lineHeight: `${footHeight}px` }">
          <a href="#" v-for="image of data.images" v-if="image.iconSrc!==''">
            <img class="bed__icon" :src="'../images/'+image.iconSrc" @click="clickImage(image)" :title="image.title">
          </a>
        </div>
        <arrow-panel class="bed__popoverPatInfo" v-if="data.patient.episodeID" :arrowSize="5" arrowColor="#3d3d3d" :arrowBorderWidth="1" :arrowLeft="10" :style="{top: `${positionInfo.bedHeight-30}px`}">
          <pat-info :data="data.patient" />
        </arrow-panel>
      </div>
    </template>
    <template v-if="data.typeCode==='MATERNALBABY'">
      <div class="babyBed" :class="{ 'is-boySelected': ifSelected&&ifMale ,'is-girlSelected': ifSelected&&ifFemale}" :style="{ width: (positionInfo.babyBedWidth-2)+'px'}">
        <div class="babyBed__babyBody">
          <a href="#">
            <img class="babyBed__babyIcon" :src="'../images/uiimages/bed/'+getSexIcon">
          </a>
          <span class="babyBed__patName" :class="{ 'is-boy':ifMale, 'is-girl':ifFemale}">&nbsp;{{data.patient.name}}</span>
          <a href="#" v-for="image of data.images">
            <img class="babyBed__babyIcon" :src="'../images/'+image.iconSrc" @click="clickImage(image)" :title="image.title">
            <img class="bed__printIcon" :src="'../images/uiimages/bed/printBedCard.png'" @click="printBedCard">
            <img class="bed__printIcon" :src="'../images/uiimages/bed/wristband.png'" @click="printWristband">
          </a>
        </div>
        <arrow-panel v-if="data.patient.episodeID" class="babyBed__popoverPatInfo" :arrowSize="5" arrowColor="#3d3d3d" :arrowBorderWidth="1" :arrowLeft="10">
          <pat-info :data="data.patient" />
        </arrow-panel>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import CommonButton from '../../components/CommonButton';
import ArrowPanel from '../../components/ArrowPanel';
import PatInfo from './PatInfo';
import session from '../../store/api/session';
import printComm from '../../comm/utils';

export default {
  name: 'Bed',
  props: {
    data: {
      type: Object,
      required: true,
    },
    bedIndex: {
      type: Number,
      required: true,
    },
    ifShowDetailInfo: Boolean,
    headHeight: {
      type: Number,
      default: 24,
    },
    infoHeight: {
      type: Number,
      default: 54,
    },
    detailInfoHeight: {
      type: Number,
      default: 36,
    },
    footHeight: {
      type: Number,
      default: 24,
    },
    positionInfo: {
      type: Object,
      default: {
        bedWidth: 134,
        bedHeight: 120,
        bedMergeWidth: 273,
        babyHorizontalInterval: 5,
        babyBedWidth: 134,
        babyBedHeight: 22,
        babyBedNum: 3,
        columns: 5, //  一行容纳的床位数
        horizontalInterval: 5, //  床之间的最小水平间隔
        verticalInterval: 5, // 床之间的垂直间隔
      },
    },
  },
  computed: {
    ...mapGetters(['selectedInfo', 'infoSetting', 'printConfigInfo']),
    getSexClass() {
      return {
        'fa fa-venus is-female': this.data.patient.sex === '女',
        'fa fa-mars is-male': this.data.patient.sex === '男',
      };
    },
    detailInfo() {
      //  详细信息根据配置显示
      const detailInfoAarray = [];
      this.infoSetting.detailInfo.forEach(key => {
        if (this.data.patient[key]) {
          detailInfoAarray.push(this.data.patient[key]);
        }
      });
      return detailInfoAarray;
    },
    getSexIcon() {
      let icon = 'boy.png';
      if (this.data.patient.sex === '女') {
        icon = 'girl.png';
      }
      return icon;
    },
    ifMale() {
      return this.data.patient.sex === '男';
    },
    ifFemale() {
      return this.data.patient.sex === '女';
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
        bedMergeWidth,
        babyBedWidth,
        columns,
        horizontalInterval,
        verticalInterval,
        babyHorizontalInterval,
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
      let height = bedHeight;
      if (this.data.typeCode === 'MATERNALBABY') {
        // 母婴同室行列数计算
        const { babyBedIndex, motherBedIndex } = this.data;
        const motherColumnNo = parseInt(motherBedIndex % columns, 10);
        const motherRowNo = parseInt(motherBedIndex / columns, 10);
        height = 20;
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
      const zIndex = Math.ceil((3000 - parseInt(top, 10) - left) / 20);
      const style = {
        height: `${height}px`,
        width: `${width}px`,
        left: `${left}px`,
        top: `${top}px`,
        visibility: 'visible',
        position: 'absolute',
        opacity: 1,
        zIndex,
      };
      if (this.data.ifFloat) {
        style.float = 'left';
        style.position = 'relative';
        style.left = 0;
        style.top = 0;
        style.margin = '0 20px 20px 0';
      } else if (!this.data.ifShow) {
        style.visibility = 'hidden';
        style.opacity = 0;
      }
      return style;
    },
    ifOneLevel() {
      return this.data.patient.careLevel === 'Ⅰ级';
    },
    ifSpecialLevel() {
      return this.data.patient.careLevel === '特级';
    },
  },
  methods: {
    clickImage(image) {
      const { linkUrl } = image;
      if (linkUrl) {
        /* global websys_lu:true */
        websys_lu(linkUrl, false, 'top=40,left=40,width=640,height=480');
      }
    },
    clickBed() {
      if (this.data.patient.episodeID) {
        this.$emit('clickPatient', this); //  点击病人
      } else if (this.data.unavailPatName === '') {
        this.$emit('clickFreeBed', this); //  点击空床
      }
    },
    dbclickBed() {
      this.$emit('dbclickPatient', this);
    },
    clickBorrowBed() {
      this.$emit('clickBorrowBed', this);
    },
    printBedCard() {
      const webIP = session.USER.WEBIP;
      const printDLL = printComm.getPrintDll();
      const {
        name,
        sex,
        bedCode,
        age,
        regNo,
        medicareNo,
        inHospDateTime,
        mainDoctor,
      } = this.data.patient;
      const params = `${name}$${sex}$${bedCode}床$${age}$${regNo}$${medicareNo}$${inHospDateTime}$${mainDoctor}$`; // '197yh$女$0101床$20岁$0000000011$000007$14/03/2017$indoctor $';
      printDLL.showOtherSingleSheet(
        params,
        'BedCard',
        webIP,
        'NurseBedCard.xml',
      );
    },
    printWristband() {
      const webIP = session.USER.WEBIP;
      const printDLL = printComm.getPrintDll();
      const { episodeID } = this.data.patient;
      printDLL.showNurseExcuteSheetPreview(
        episodeID,
        'PrintWD',
        'O',
        '',
        webIP,
        'true',
        1,
        'NurseOrder.xml',
      );
    },
    printChildWristband() {
      console.log('printChildWristband');
    },
    updatePatInfo() {
      this.$emit('clickUpdatePat', this); //  点击病人
      // console.log('updatePatInfo', data);
    },
  },
  components: {
    ArrowPanel,
    PatInfo,
    CommonButton,
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../../assets/main.css';
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
  @e head {
    background-color: var(--maleColor);
    color: var(--headFontColor);
    font-size: 14px;
    padding-left: 9px;
    @when free {
      background-color: var(--headBackgroundColor);
      color: #999999;
      font-size: 14px;
      padding-left: 9px;
      border: 1px solid var(--grayBorderColor);
      border-bottom: 1px solid #ccc;
    }
    @when invalid {
      background-color: var(--grayBorderColor);
      color: #ffffff;
      font-size: 14px;
      padding-left: 9px;
      border: 1px solid var(--grayBorderColor);
      border-bottom: 1px solid #ccc;
    }
    @when male {
      background-color: var(--maleColor);
      border: 1px solid var(--maleColor);
    }
    @when female {
      background-color: var(--femaleColor);
      border: 1px solid var(--femaleColor);
    }
  }
  @e printIconGroup {
    display: inline-block;
    margin-right: 8px;
    position: absolute;
    right: 35px;
    top: 5px;
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
    top: 5px;
    font-size: 12px;
    min-width: 20px;
    min-height: 15px;
    padding: 0 5px 0 5px;
    text-align: center;
    border-radius: 5px;
    @when male {
      background-color: #ebf5fa;
    }
    @when female {
      background-color: #fff1f0;
    }
  }
  @e body {
    position: absolute;
    top: 25px;
    bottom: 0px;
    font-size: 18px;
    border-left: 1px solid var(--grayBorderColor);
    border-bottom: 1px solid var(--grayBorderColor);
    border-right: 1px solid var(--grayBorderColor);
    color: #666666;
    @when maleSelected {
      background-color: #ebf5fa;
      border-left: 1px solid var(--maleColor);
      border-bottom: 1px solid var(--maleColor);
      border-right: 1px solid var(--maleColor);
    }
    @when femaleSelected {
      background-color: #fff1f0;
      border-left: 1px solid var(--femaleColor);
      border-bottom: 1px solid var(--femaleColor);
      border-right: 1px solid var(--femaleColor);
    }
  }
  @e info {
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
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
  @e patientName {
    display: table-cell;
    vertical-align: middle;
    @when male {
      color: #46a2d7;
      /*color: var(--maleColor);*/
    }
    @when female {
      color: var(--femaleColor);
    }
    @when unavail {
      position: absolute;
      color: #666666;
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
    line-height: 18px;
    font-size: 13px;
    color: #000;
    /*color: #595959;*/
    padding: 0 0 0 4px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.05);
    /*background-color: rgba(251, 253, 255, 0.5);*/
  }

  @e foot {
    position: absolute;
    bottom: 0;
  }

  @e icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 0 0 8px;
  }

  @e btnGroup {
    display: flex;
    position: absolute;
    top: 0;
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
    min-width: 250px;
    min-height: 200px;
    transform: translateY(-30px);
    transition-timing-function: ease-in-out;
    transition-duration: 0.2s;
    transition-property: all;
    white-space: nowrap;
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
  @when boySelected {
    background-color: #ebf5fa;
    border: 1px solid var(--maleColor);
  }
  @when girlSelected {
    background-color: #fff1f0;
    border: 1px solid var(--femaleColor);
  }
  @e babyBody {
    display: inline-block;
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
  }
  @e patName {
    @when boy {
      color: var(--maleColor);
    }
    @when girl {
      color: var(--femaleColor);
    }
  }
  @e popoverPatInfo {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    width: 160px;
    height: 300px;
    transform: translateY(-10px);
    transition-timing-function: ease-in-out;
    transition-duration: 0.2s;
    transition-property: all;
    white-space: nowrap;
  }
  @e babyIcon {
    vertical-align: sub;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin: 0 0 0 4px;
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
</style>
