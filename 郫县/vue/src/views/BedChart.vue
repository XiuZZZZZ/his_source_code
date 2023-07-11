<template>
  <div class="bedChartView">
    <ToolBar class="bedChartView__head">
      <ToolBarItem :img="translatePng"
                   @clickToolBarItem="clickToolBarItemTranslate">转移</ToolBarItem>
      <ToolBarItem :img="outHospitalPng"
                   @clickToolBarItem="clickToolBarItemOutHosp">出院</ToolBarItem>
      <SummaryInfo :currentWard="currentWard"></SummaryInfo>
    </ToolBar>
    <div class="bedChartView__settingArea">
      <el-input placeholder="请输入内容"
                v-model="tmpSearchContent"
                class="bedChartView__searchInput"
                @keyup.native.enter="searchInputEnter">
        <el-select v-model="searchKeyCode"
                   clearable
                   slot="prepend"
                   placeholder="请选择"
                   @change="searchKeyChange">
          <el-option v-for="info of infoSettingSort"
                     :label="info.description"
                     :key="info.key"
                     :value="info.key"></el-option>
        </el-select>
      </el-input>
      <el-tooltip :content="'显示床位详细信息'"
                  placement="top">
        <el-switch v-model="ifShowDetail"
                   active-color="#3D9CD2"
                   active-text="详细"
                   inactive-text="简要">
        </el-switch>
      </el-tooltip>
      <!--<el-tooltip :content="'切换床位列表'"
                                        placement="top">
                              <el-switch v-model="ifShowBedList"
                                         on-color="#3D9CD2"
                                         on-text="列表"
                                         off-text="床位图"
                                         :width="75">
                              </el-switch>
                            </el-tooltip> -->
      <CommonButton border="1px solid #cccccc"
                    color="#378ec4"
                    iconColor="#378ec4"
                    backgroundColor="#ffffff"
                    iconBackgroundColor="#ffffff"
                    :hover="true"
                    iconBorderRight="1px solid #cccccc"
                    :iconClass="searchButtonIconClass">
        快捷查询
        <BedSearch slot="hoverContent"></BedSearch>
      </CommonButton>
      <i class="fa fa-cog fa-2x bedChartView__settingIcon"
         @click="showDialogBedSetting"></i>
    </div>
    <Tab class="bedChartView__tabs"
         :data="tabsData"
         backgroundColor="#f7f7f7"
         border="1px solid #cccccc"
         lineBorder="1px solid #cccccc"
         @selectTab="selectWardTab"
         :defaultSelectedTabIndex="defaultTabIndex">
      <div slot="rightHeadSlot">
      </div>
      <BedChart class="bedChartView__bedChart"
                :searchContent="searchContent"
                :searchKeyCode='searchKeyCode'
                slot="contentSlot"
                @contextmenu.native="onContextMenu"></BedChart>
    </Tab>
    <component v-model="ifShowDialogBedSetting"
               :is="dialogBedSettingComponentName"
               dialogTitle="床位设置">
    </component>
    <component v-model="ifShowDialogBedListSetting"
               :is="dialogBedListSettingComponentName"
               dialogTitle="床位列表设置">
    </component>
    <component v-model="ifShowDialogTransfer"
               :is="dialogTransferComponentName"
               dialogTitle="转移">
    </component>
  </div>
</template>
<script>
import {
  Switch,
  Tooltip,
  Dialog,
  Form,
  FormItem,
  Select,
  Option,
  Col,
  Slider,
  Input
} from "element-ui";
import { mapActions, mapGetters, mapMutations } from "vuex";
import CommonButton from "../components/CommonButton";
import ToolBar from "../components/ToolBar";
import ToolBarItem from "../components/ToolBarItem";
import Tab from "../components/Tab";
import BedChart from "../bizcomponents/bedChart/BedChart";
import SummaryInfo from "../bizcomponents/bedChart/SummaryInfo";
import BedSearch from "../bizcomponents/bedChart/BedSearch";
import borrowBedPng from "../assets/icon/navIcon/borrowBed.png";
import translatePng from "../assets/icon/navIcon/translate.png";
import outHospitalPng from "../assets/icon/navIcon/outHospital.png";
import session from "../store/api/session";

export default {
  name: "bedChartView",
  data() {
    return {
      ifShowDialogUpdateBed: false,
      dialogExcuteMethod: null,
      borrowBedPng,
      translatePng,
      outHospitalPng,
      ifShowBedList: false,
      ifShowDetail: true,
      ifShowDialogBedSetting: false,
      dialogBedSettingComponentName: "",
      ifShowDialogBedListSetting: false,
      dialogBedListSettingComponentName: "",
      searchButtonIconClass: "fa fa-angle-down",
      tmpSearchContent: "",
      searchContent: "",
      searchKeyCode: "",
      ifShowDialogTransfer: false,
      dialogTransferComponentName: "",
      loadingInstance: null
    };
  },
  watch: {
    ifShowDetail(value) {
      this.updateIfShowDetailInfo({
        ifShowDetailInfo: value
      });
    },
    ifShowBedList(value) {
      this.updateIfShowBedList({
        ifShowBedList: value
      });
    },
    requestQueryFlag(value) {
      if (value) {
        this.loadingInstance = this.$loading({
          target: ".bedChartView",
          text: "拼命加载中"
        });
        this.getWardInitData();
      } else if (this.loadingInstance) {
        this.loadingInstance.close();
      }
    }
  },
  computed: {
    ...mapGetters([
      "beds",
      "currentWard",
      "ifShowDetailInfo",
      "selectedInfo",
      "locLinkWards",
      "infoSetting",
      "requestQueryFlag"
    ]),
    defaultTabIndex() {
      let index = this.tabsData.findIndex(
        tab => tab.ID === session.USER.WARDID
      );
      index = index === -1 ? 0 : index;
      return index;
    },
    // 返回排序过的数据
    infoSettingSort() {
      const sortKey = [
        "name",
        "diagnosis",
        "mainDoctor",
        "admReason",
        "medicareNo",
        "bedCode"
      ];
      const infoSettingSort = [];
      sortKey.forEach(key => {
        const infoFinded = this.infoSetting.infoData.find(
          info => info.key === key
        );
        if (infoFinded) {
          infoSettingSort.push(Object.assign({}, infoFinded));
        }
      });
      const sortKeyString = `^${sortKey.join("^")}^`;
      this.infoSetting.infoData.forEach(info => {
        if (sortKeyString.indexOf(info.key) === -1) {
          infoSettingSort.push(Object.assign({}, info));
        }
      });
      return infoSettingSort;
    },
    tabsData() {
      const tabs = [];
      for (let i = 0; i < this.locLinkWards.length; i += 1) {
        const tab = {};
        tab.name = this.locLinkWards[i].wardDesc;
        tab.ID = this.locLinkWards[i].wardID;
        tab.index = i;
        tabs.push(tab);
      }
      return tabs;
    }
  },
  created() {
    this.getLocLinkWards();
    const that = this;
    const refresh = () => {
      that.getLocLinkWards();
      that.selectWardTab(that.defaultTabIndex);
    };
    setInterval(refresh, 60000);
  },
  methods: {
    ...mapMutations([
      "updateIfShowDetailInfo",
      "updateBedSize",
      "updateIfShowBedList"
    ]),
    ...mapActions(["getLocLinkWards", "getWardInitData"]),
    searchKeyChange() {
      this.tmpSearchContent = "";
      this.searchContent = "";
    },
    searchInputEnter() {
      this.searchContent = this.tmpSearchContent;
    },
    onContextMenu(event) {
      event.returnValue = false;
      event.preventDefault();
      return false;
    },
    selectWardTab(index) {
      this.$store.dispatch("changeCurrentWard", {
        index
      });
    },
    clickToolBarItemTranslate() {
      if (
        this.selectedInfo.episodeID !== "" ||
        this.selectedInfo.waitingEpisodeID !== ""
      ) {
        const episodeID =
          this.selectedInfo.episodeID === ""
            ? this.selectedInfo.waitingEpisodeID
            : this.selectedInfo.episodeID;
        let messageInfo = "";
        if (this.selectedInfo.waitingRoom === "转出区") {
          messageInfo = "正在转移中的患者不允许再次转移!";
        }
        if (this.ifBorrowBed(episodeID)) {
          messageInfo = "患者包床未结束,不能转移,请先结束包床!";
        }
        if (messageInfo !== "") {
          this.$message({
            showClose: true,
            message: messageInfo,
            type: "warning"
          });
          return;
        }
        this.dialogTransferComponentName = "dialog-transfer";
        this.ifShowDialogTransfer = true;
      } else {
        this.$message({
          showClose: true,
          message: "请先选中患者!",
          type: "warning"
        });
      }
    },
    ifBorrowBed(episodeID) {
      const borrowBed = this.beds.find(
        bed => bed.unavailEpisodeID === episodeID
      );
      if (borrowBed && borrowBed.unavailReason === "包床") {
        return true;
      }
      return false;
    },
    clickToolBarItemOutHosp() {
      if (
        this.selectedInfo.episodeID !== "" ||
        this.selectedInfo.waitingEpisodeID !== ""
      ) {
        let episodeID = "";
        if (this.selectedInfo.episodeID !== "") {
          episodeID = this.selectedInfo.episodeID;
        } else {
          episodeID = this.selectedInfo.waitingEpisodeID;
        }
        let messageInfo = "";
        if (this.selectedInfo.waitingRoom === "转出区") {
          messageInfo = "正在转移中的患者不允许办理出院,请先取消转移!";
        }
        if (this.ifBorrowBed(episodeID)) {
          messageInfo = "患者包床未结束,不能出院,请先结束包床!";
        }
        if (messageInfo !== "") {
          this.$message({
            showClose: true,
            message: messageInfo,
            type: "warning"
          });
          return;
        }
        /* global window */
        // 获得窗口的垂直位置;
        console.log(window.screen.availHeight);
        console.log(window.screen.availWidth);
        const iTop = (window.screen.availHeight - 30 - 392) / 2;
        console.log(iTop);
        // 获得窗口的水平位置;
        const iLeft = (window.screen.availWidth - 10 - 830) / 2;
        console.log(iLeft);
        window.open(
          `nur.hisui.discharge.csp?EpisodeID=${episodeID}&type=F&TMENU`,
          "出院",
          `top=${iTop},left=${iLeft},width=830,height=392`
        );
      } else {
        this.$message({
          showClose: true,
          message: "请先选中患者!",
          type: "warning"
        });
      }
    },
    showDialogBedSetting() {
      if (this.ifShowBedList) {
        this.dialogBedListSettingComponentName = "dialog-bed-list-setting";
        this.ifShowDialogBedListSetting = true;
      } else {
        this.dialogBedSettingComponentName = "dialog-bed-setting";
        this.ifShowDialogBedSetting = true;
      }
    }
  },
  components: {
    ToolBar,
    ToolBarItem,
    Tab,
    BedChart,
    SummaryInfo,
    CommonButton,
    BedSearch,
    ElSwitch: Switch,
    ElTooltip: Tooltip,
    ElDialog: Dialog,
    ElForm: Form,
    ElFormItem: FormItem,
    ElSelect: Select,
    ElOption: Option,
    ElCol: Col,
    ElInput: Input,
    ElSlider: Slider,
    DialogBedSetting(resolve) {
      require.ensure(
        ["../bizcomponents/bedChart/DialogBedSetting"],
        require => {
          resolve(require("../bizcomponents/bedChart/DialogBedSetting"));
        },
        "DialogBedSetting"
      );
    },
    DialogBedListSetting(resolve) {
      require.ensure(
        ["../bizcomponents/bedChart/DialogBedListSetting"],
        require => {
          resolve(require("../bizcomponents/bedChart/DialogBedListSetting"));
        },
        "DialogBedListSetting"
      );
    },
    DialogTransfer(resolve) {
      require.ensure(
        ["../bizcomponents/bedChart/DialogTransfer"],
        require => {
          resolve(require("../bizcomponents/bedChart/DialogTransfer"));
        },
        "DialogTransfer"
      );
    }
  }
};
</script>
<style>
@b bedChartView {
  height: 100%;
  width: 100%;
  margin: auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: stretch;
  @e head {
    flex-grow: 0;
    z-index: 1300;
    border-bottom: 1px solid #cccccc;
  }
  @e tabs {
    flex-grow: 1;
    border: 1px solid #cccccc;
    margin: 10px 10px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: stretch;
    background-color: #fff;
  }
  @e bedChart {
    flex-grow: 1;
    position: relative;
    margin: 5px;
  }
  @e searchInput {
    width: 250px;
    margin: 0 20px;
    position: relative;
    top: 7px;
    & .el-input-group__prepend {
      width: 65px;
      background-color: #fff;
    }
  }

  @e settingIcon {
    position: relative;
    top: 6px;

    &:hover {
      cursor: pointer;
      animation: fa-spin 2s infinite linear;
    }
  }
  @e settingArea {
    line-height: 40px;
    position: fixed;
    top: 86px;
    right: 20px;
    z-index: 1250;
    max-width: 580px;
  }
  & .tab__wrapper {
    min-height: 45px;
  }
}
</style>
