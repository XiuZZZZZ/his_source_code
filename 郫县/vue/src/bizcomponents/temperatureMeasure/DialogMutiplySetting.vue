<template>
  <el-dialog :visible.sync="ifShow" 
  width="30%"
  @close="closeDialog">
    <template slot="title">
      <i class="fa fa-table dialogTitleColor"></i>
      <span class="dialogTitleColor dialogTitle">{{dialogTitle}}</span>
    </template>
    <template>
      <el-form class="dialogForm" label-position="right" label-width="100px">       
        <el-form-item label="默认列设置">
          <el-select size="small" :value="mutiplySetting.columnSetting" multiple filterable @input="updateShowColumns">
            <el-option v-for="item in columns" :key="item.code" :label="item.desc" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "ComponentName",
  props: ["value", "dialogTitle", "tempConfig"],
  data() {
    return {
      ifShow: false,
      columns: []
    };
  },
  watch: {
    value(value) {
      this.ifShow = value;
    }
  },
  mounted() {
    this.ifShow = true;
    this.columns = this.tempConfig.measureItems;
  },
  computed: {
    ...mapGetters(["mutiplySetting"])
  },
  methods: {
    ...mapMutations(["updateMutiplySetting"]),
    closeDialog() {
      this.ifShow = false;
      this.$emit("input", this.ifShow);
    },
    updateShowColumns(columnSetting) {
      this.updateMutiplySetting({
        columnSetting
      });
      this.$emit(
        "updateSelectMutiplySetting",
        this.mutiplySetting.columnSetting
      );
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
.dialogTitle {
  padding: 0 0 0 7px;
  font-size: 16px;
}

.dialogTitleColor {
  color: white;
}

.dialogForm {
  padding: 20px 50px;
}
</style>
