<template>
  <div class="temperatureMeasureRuleConfig">
    <div class="temperatureMeasureRuleConfig__toolbar">
      <!-- <el-input class="temperatureMeasureRuleConfig__input"
                placeholder="请输入筛选信息"
                v-model="filterText">
      </el-input> -->
      <CommonButton class="temperatureMeasureRuleConfig__button"
                    width="100"
                    color="#ffffff"
                    border="#509de1"
                    background-color="#509de1"
                    @click="onAddBtnClick">新建</CommonButton>
    </div>
    <common-table :runServerMethodStr="`${className}:${findRule}`"
                  :height="tableHeight"
                  @row-dblclick="rowDblclick"
                  ref="table">
      <span slot="type"
            slot-scope="scope">{{scope.row.type.desc}}</span>
      <template v-for="code in ['items','secondItems','measureItems','locs','invalidLocs','measureTimesToday','measureTimes','continueMeasureTimes']"
                :slot="code"
                slot-scope="scope">
        <div v-for="item in scope.row[code]"
             :key="item.ID||item">
          <template v-if="item.desc">
            {{item.desc}}
          </template>
          <template v-else>
            {{item}}
          </template>
        </div>
      </template>
      <el-table-column label="操作"
                       slot="right"
                       width="80">
        <el-button size="small"
                   type="danger"
                   slot-scope="scope"
                   @click="onDelBtnClick(scope.row.ID)">删除</el-button>
      </el-table-column>
    </common-table>
    <el-dialog class="temperatureMeasureRuleConfig__dialog"
               :visible.sync="ifShowDialogRuleEdit"
               width="40%"
               title="需测信息维护"
               top="1vh"
               @close="closeDialog"
               :modal-append-to-body="false">
      <measure-rule-edit :form="form"
                         @saved="ruleEditSaved"
                         @close="ruleEditClose"
                         :value="selectedRowObject"
                         ref="ruleEdit"></measure-rule-edit>
    </el-dialog>
  </div>
</template>
<script>
import Select from "../components/Select";
import CommonTable from "../components/CommonTable";
import CommonButton from "../components/CommonButton";
import MeasureRuleEdit from "../bizcomponents/temperatureMeasure/MeasureRuleEdit";
import temperatureMeasureRuleApi from "../store/api/temperatureMeasureRule";

export default {
  name: "TemperatureMeasureRuleConfig",
  props: ["filterText"],
  data() {
    return {
      form: {},
      tableHeight: 0,
      className: temperatureMeasureRuleApi.className,
      findRule: temperatureMeasureRuleApi.findRule,
      ifShowDialogRuleEdit: false,
      selectedRowObject: null
    };
  },
  components: {
    YlSelect: Select,
    CommonTable,
    CommonButton,
    MeasureRuleEdit
  },
  beforeMount() {
    this.tableHeight = document.body.offsetHeight - 70;
  },
  methods: {
    rowDblclick(row) {
      this.selectedRowObject = row;
      this.ifShowDialogRuleEdit = true;
    },
    onDelBtnClick(ID) {
      this.$confirm("确认删除此规则?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => temperatureMeasureRuleApi.deleteRule(ID))
        .then(result => {
          const resultStr = String(result);
          if (resultStr !== "0") {
            this.$message.error(resultStr);
          } else {
            this.$message.success("删除成功!");
            this.$refs.table.reload();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    closeDialog() {
      setTimeout(() => {
        this.selectedRowObject = {};
        this.$refs.ruleEdit.init();
      }, 200);
    },
    ruleEditClose() {
      this.ifShowDialogRuleEdit = false;
    },
    ruleEditSaved() {
      this.ifShowDialogRuleEdit = false;
      this.$refs.table.reload();
    },
    onAddBtnClick() {
      this.ifShowDialogRuleEdit = true;
      this.$nextTick(() => this.$refs.ruleEdit.init());
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../assets/main.css";
@b temperatureMeasureRuleConfig {
  padding: 15px;  
  @e toolbar {
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
    margin: 0 10px;
  }  
  & .el-dialog__body {
    overflow-y: auto;
    padding: 20px;
    max-height: 530px;
  }
  & .el-dialog {
    max-height: none;
    max-width: calc(100% - 0px);
  }
}
</style>
