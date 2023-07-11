<template>
  <div class="delivery">
    <patInfo-banner :patInfo="patientInfo"></patInfo-banner>
    <div class="delivery__toolbar">
      <!-- <el-input class="delivery__input"
                placeholder="请输入筛选信息"
                v-model="filterText">
      </el-input> -->
      <CommonButton class="delivery__button"
                    width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="onAddBtnClick">新增</CommonButton>
    </div>
    <common-table :runServerMethodStr="`${className}:${findBaby}:${episodeID}`"
                  :height="tableHeight"
                  @row-dblclick="changeBabyInfo"
                  ref="table">
      <el-table-column label="操作"
                       slot="right">
        <template slot-scope="scope">
          <span class="icon icon-cancel"
                :style="{background :`url(../images/uiimages/bed/cancel.png) center center no-repeat`}"
                @click="onDelBtnClick(scope.row.pregDelBabyID)"></span>
        </template>

      </el-table-column>
    </common-table>
    <el-dialog class="delivery__dialog"
               :visible.sync="ifShowDalogBabyInfo"
               width="400px"
               title="新生儿详情"
               top="15vh"
               @close="closeDialog"
               :modal-append-to-body="false">
      <baby-info-edit :motherEpisodeID="episodeID"
                      :babyID='selectedBabyID'
                      @saved="dialogBabyInfoSaved"
                      @close="dialogBabyInfoClose"
                      ref="dialogBabyInfo"></baby-info-edit>
    </el-dialog>
  </div>
</template>
<script>
import Select from "../components/Select";
import CommonTable from "../components/CommonTable";
import CommonButton from "../components/CommonButton";
import BabyInfoEdit from "../bizcomponents/delivery/BabyInfoEdit";
import BabyInfoUpdate from "../bizcomponents/delivery/BabyInfoUpdate";
import PatInfoBanner from "../bizcomponents/bedChart/PatInfoBanner";
import SESSION from "../store/api/session";
import patientApi from "../store/api/patient";
import deliveryApi from "../store/api/delivery";

export default {
  name: "Delivery",
  props: ["filterText"],
  data() {
    return {
      episodeID: SESSION.USER.EPISODEID,
      patientInfo: null,
      form: {},
      tableHeight: 500,
      className: deliveryApi.className,
      findBaby: deliveryApi.findBaby,
      ifShowDalogBabyInfo: false,
      selectedBabyID: null,
      babyInfo: {}
    };
  },
  components: {
    YlSelect: Select,
    CommonTable,
    CommonButton,
    PatInfoBanner,
    BabyInfoEdit,
    BabyInfoUpdate
  },
  created() {
    this.tableHeight = document.body.offsetHeight - 150;
  },
  mounted() {
    if (this.episodeID) {
      patientApi.getPatient(this.episodeID).then(patient => {
        this.patientInfo = patient;
      });
    }
  },
  methods: {
    onDelBtnClick(ID) {
      const h = this.$createElement;
      let comment = {};
      comment = h("span", null, "确认删除分娩结果?");
      this.$msgbox({
        title: "删除分娩结果",
        message: comment,
        type: "warning",
        dangerouslyUseHTMLString: true,
        showCancelButton: true,
        showConfirmButton: true,
        callback: action => {
          if (action === "confirm") {
            deliveryApi.delete(ID).then(result => {
              if (result.toString() !== "0") {
                this.$message.error(result);
              } else {
                this.$message.success("删除成功!");
                this.$refs.table.reload();
              }
            });
          }
        }
      });
    },
    changeBabyInfo(row) {
      this.selectedBabyID = row.pregDelBabyID;
      this.ifShowDalogBabyInfo = true;
    },
    closeDialog() {
      this.selectedBabyID = "";
    },
    dialogBabyInfoClose() {
      this.ifShowDalogBabyInfo = false;
    },
    dialogBabyInfoSaved() {
      this.ifShowDalogBabyInfo = false;
      this.$refs.table.reload();
    },
    onAddBtnClick() {
      let errMessage = "";
      if (this.patientInfo.sex !== "女") {
        errMessage = "非女性患者,不能分娩!";
      }
      if (this.patientInfo.ifNewBaby === "Y") {
        errMessage = "新生儿患者不能分娩!";
      }
      if (this.patientInfo.bedCode === "") {
        errMessage = "不在床患者不能分娩!";
      }
      if (errMessage !== "") {
        this.$message({
          message: errMessage,
          duration: 5000,
          showClose: true,
          type: "error"
        });
        return;
      }

      this.ifShowDalogBabyInfo = true;
      this.selectedBabyID = "";
      this.$nextTick(() => this.$refs.dialogBabyInfo.init());
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
@import "../assets/main.css";
@b delivery {
  padding: 15px;
  @e toolbar {
    margin-top: 8px;
    height: 40px;
  }
  @e input {
    margin: 4px;
    width: 199px;
    & .el-input__inner {
      border: 1px solid var(--mainColor);
    }
  }
  @e button {
    margin: 0 10px 0 0;
  }
  & td {
    padding: 0;
    text-align: left;
    padding-left: 10px;
  }
  & th {
    color: #5e5e5e;
    font-weight: 700;
    padding: 5px;
    text-align: left;
    padding-left: 10px;
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
  & .el-dialog__body {
    overflow-y: auto;
    padding: 20px;
    max-height: 530px;
  }
  & .el-dialog {
    max-height: none;
  }
}
</style>
