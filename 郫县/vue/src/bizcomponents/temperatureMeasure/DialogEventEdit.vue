<template>
  <el-dialog :visible.sync="ifShow"
             @close="closeDialog"
             custom-class="DialogEventEdit"
             width="65%"
             title="事件登记"
             :modal-append-to-body="false">
    <PatInfoBanner :patInfo="patient"
                   class="DialogEventEdit__patInfo">
    </PatInfoBanner>
    <div class="DialogEventEdit__toolbar">

      <yl-date-picker style="width: 150px;"
                      v-model="searchDate">
      </yl-date-picker>
      &nbsp;&nbsp;
      <el-time-select v-model="searchTime"
                      :picker-options="{ start: '01:00',step: '01:00',end: '23:00'}"
                      style="width: 120px;">
      </el-time-select>
      &nbsp;&nbsp;
      <yl-select v-model="eventTypeID"
                 @update:data="value=>eventTypes=value"
                 :runServerMethodStr="`${cls}:${methodFindEventType}`">
        <el-option v-for="eventType in eventTypes"
                   :key="eventType.ID"
                   :label="eventType.desc"
                   :value="eventType.ID"></el-option>
      </yl-select>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <CommonButton width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="onClickAddBtn">新增</CommonButton>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <CommonButton width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#fe9a4a"
                    @click="onClickUpdateBtn">修改</CommonButton>
    </div>
    <common-table :runServerMethodStr="`${cls}:${methodFindEvent}:${episodeID}`"
                  @row-click="rowClick"
                  :height="400"
                  ref="table">
      <el-table-column label="操作"
                       slot="right"
                       width="80">
        <template slot-scope="scope">
          <span class="icon icon-cancel"
                :style="{background :`url(../images/uiimages/bed/cancel.png) center center no-repeat`}"
                @click="onClickDelBtn(scope.row.ID)"></span>
        </template>
      </el-table-column>
    </common-table>
  </el-dialog>
</template>
<script>
import dateTimeFormat from "../../comm/utils";
import temperatureApi from "../../store/api/temperature";
import DatePicker from "../../components/DatePicker";
import Select from "../../components/Select";
import CommonTable from "../../components/CommonTable";
import CommonButton from "../../components/CommonButton";
import PatInfoBanner from "../bedChart/PatInfoBanner";

export default {
  name: "DialogEventEdit",
  props: ["value", "patient"],
  data() {
    return {
      ifShow: false,
      searchDate: new Date(),
      searchTime: "12:00",
      eventTypes: [],
      eventTypeID: "",
      selectedID: "",
      cls: temperatureApi.className,
      methodFindEvent: temperatureApi.findEvent,
      methodFindEventType: temperatureApi.findEventType,
      episodeID: ""
    };
  },
  mounted() {
    this.episodeID = this.patient.episodeID;
    this.ifShow = true;
    this.init();
  },
  components: {
    CommonTable,
    YlDatePicker: DatePicker,
    YlSelect: Select,
    CommonButton,
    PatInfoBanner
  },
  watch: {
    value(value) {
      this.ifShow = value;
      if (value) {
        this.init();
        this.episodeID = this.patient.episodeID;
      }
    }
  },
  methods: {
    init() {
      this.searchDate = new Date();
      dateTimeFormat.getCurrentDateTime().then(dateTime => {
        this.searchTime = dateTime.time;
      });
      this.eventTypeID = "";
      this.selectedID = "";
    },
    rowClick(row) {
      this.searchDate = dateTimeFormat.formatDate(row.date);
      this.searchTime = row.time;
      this.eventTypeID = row.typeID;
      this.selectedID = row.ID;
    },
    timeSelectBlur(timeSelect) {
      this.searchTime = timeSelect.$children[0].currentValue;
    },
    closeDialog() {
      this.ifShow = false;
      this.$emit("input", this.ifShow);
    },
    onClickUpdateBtn() {
      if (this.selectedID === "") {
        this.$message.error("请选择事件");
        return;
      }
      const date = dateTimeFormat.formatDate(this.searchDate);
      if (!date) {
        this.$message.error("日期格式错误");
        return;
      }
      const time = dateTimeFormat.formatTime(this.searchTime);
      if (!time) {
        this.$message.error("时间格式错误");
        return;
      }
      if (this.eventTypeID === "") {
        this.$message.error("请选择事件类型");
        return;
      }
      temperatureApi
        .updateEvent(this.selectedID, date, time, this.eventTypeID)
        .then(() => {
          this.$refs.table.reload();
          this.$message({
            message: "修改成功",
            type: "success"
          });
        });
    },
    onClickAddBtn() {
      const date = dateTimeFormat.formatDate(this.searchDate);
      if (!date) {
        this.$message.error("日期格式错误");
        return;
      }
      const time = dateTimeFormat.formatTime(this.searchTime);
      if (!time) {
        this.$message.error("时间格式错误");
        return;
      }
      if (this.eventTypeID === "") {
        this.$message.error("请选择事件类型");
        return;
      }
      temperatureApi
        .insertEvent(this.patient.episodeID, date, time, this.eventTypeID)
        .then(() => {
          this.$refs.table.reload();
          this.$message({
            message: "添加成功",
            type: "success"
          });
        });
    },
    onClickDelBtn(ID) {
      temperatureApi.deleteEvent(ID).then(() => {
        this.$refs.table.reload();
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.selectedID = "";
      });
    }
  }
};
</script>
<style >
@import "../../assets/main.css";
@b DialogEventEdit {
  & .el-dialog__title {
    color: #fff;
    font-size: 16px;
    font-weight: normal;
  }
  & .el-dialog__body {
    padding-top: 0;
  }
  & tr {
    height: 35px;
  }
  @e toolbar {
    width: 100%;
    height: 40px;
    padding-top: 10px;
    padding-bottom: 0;
  }
  & thead th div {
    color: #5e5e5e;
  }
  & td {
    padding: 0;
  }
  & th {
    padding: 0;
  }
  & .icon {
    padding-left: 20px;
    background-position: left 0px center;
    display: inline-block;
    font-size: 12px;
    height: 28px;
    display: inline-block;
  }
  & .icon:hover {
    cursor: pointer;
  }
}
</style>
