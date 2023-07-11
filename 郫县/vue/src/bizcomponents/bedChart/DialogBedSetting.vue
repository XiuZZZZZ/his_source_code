<template>
  <el-dialog :visible.sync="ifShow" @close="closeDialog">
    <template slot="title">
      <i class="fa fa-bed dialogTitleColor"></i>
      <span class="dialogTitleColor dialogTitle">{{dialogTitle}}</span>
    </template>
    <template>
      <el-form class="dialogForm" label-position="right" label-width="120px">
        <el-form-item label="床头卡推荐配置">
          <el-radio-group v-model="bedSizeRadio" @change="bedSizeChange">
            <el-radio :label="1">小分辨率</el-radio>
            <el-radio :label="2">中分辨率</el-radio>
            <el-radio :label="3">大分辨率</el-radio>
          </el-radio-group>
        </el-form-item> 
        <el-form-item label="床宽">
          <el-slider :value="bedSize.width" @input="updateBedWidth" :min="bedSize.minWidth" :max="bedSize.maxWidth"></el-slider>
        </el-form-item>
        <el-form-item label="详细信息高度">
          <el-slider :value="bedSize.infoHeight" @input="updateBedInfoHeight" :min="bedSize.minInfoHeight" :max="bedSize.maxInfoHeight"></el-slider>
        </el-form-item>         
        <el-form-item label="详细信息" v-show="false">
          <yl-select size="small" :value="infoSetting.detailInfo" @input="updateDetailInfo" :data="infoSetting.infoData" multiple filterable :filter-method="filterDetailInfo" disabled ref="detailInfoSelect">
            <el-option v-for="item in detailInfoFiltered" :key="item.key" :label="item.description" :disabled="['sex','age','medicareNo', 'illState', 'inHospDateTime', 'diagnosis', 'mainDoctor'].indexOf(item.key)>-1" :value="item.key"></el-option>
          </yl-select>
        </el-form-item>
        <el-form-item label="弹出框信息">
          <yl-select size="small" :value="infoSetting.popoverInfo" @input="updatePopoverInfo" :data="infoSetting.infoData" multiple filterable :filter-method="filterPopoverInfo" clearable ref="popoverInfoSelect">
            <el-option v-for="item in popoverInfoFiltered" :key="item.key" :label="item.description" :value="item.key"></el-option>
          </yl-select>
        </el-form-item>
      </el-form>
    </template>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import Select from "../../components/Select";
import pinyinUtil from "../../comm/pinyinUtil";

export default {
  name: "ComponentName",
  props: ["value", "dialogTitle"],
  data() {
    return {
      ifShow: false,
      detailInfoFiltered: [],
      popoverInfoFiltered: [],
      bedSizeRadio: 1
    };
  },
  watch: {
    value(value) {
      this.ifShow = value;
      if (value) {
        this.initBedSizeRadio();
      }
    }
  },
  mounted() {
    this.ifShow = true;
    this.detailInfoFiltered = this.infoSetting.infoData;
    this.popoverInfoFiltered = this.infoSetting.infoData;
  },
  computed: {
    ...mapGetters(["bedSize", "infoSetting"])
  },
  methods: {
    ...mapMutations(["updateBedSize", "updateInfoSetting"]),
    initBedSizeRadio() {
      if (this.bedSize.fontSize < 16) {
        this.bedSizeRadio = 1;
      } else if (this.bedSize.fontSize < 18) {
        this.bedSizeRadio = 2;
      } else {
        this.bedSizeRadio = 3;
      }
    },
    closeDialog() {
      this.ifShow = false;
      this.$emit("input", this.ifShow);
    },
    filterDetailInfo(query) {
      const queryStr = query.toUpperCase();
      this.detailInfoFiltered = this.$refs.detailInfoSelect.optionsData.filter(
        info =>
          info.description.indexOf(queryStr) > -1 ||
          info.key.toUpperCase().indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(info.description).indexOf(queryStr) > -1
      );
    },
    filterPopoverInfo(query) {
      const queryStr = query.toUpperCase();
      this.popoverInfoFiltered = this.$refs.popoverInfoSelect.optionsData.filter(
        info =>
          info.description.indexOf(queryStr) > -1 ||
          info.key.toUpperCase().indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(info.description).indexOf(queryStr) > -1
      );
    },
    updateDetailInfo(detailInfo) {
      this.updateInfoSetting({
        detailInfo
      });
    },
    updatePopoverInfo(popoverInfo) {
      this.updateInfoSetting({
        popoverInfo
      });
    },
    updateBedWidth(width) {
      this.updateBedSize({
        width
      });
    },
    updateBedHeight(height) {
      this.updateBedSize({
        height
      });
    },
    updateBedInfoHeight(infoHeight) {
      this.updateBedSize({
        infoHeight
      });
    },
    updateBedHeadHeight(headHeight) {
      this.updateBedSize({
        headHeight
      });
    },
    updateBedFontSize(fontSize) {
      this.updateBedSize({
        fontSize
      });
    },
    bedSizeChange(value) {
      switch (value) {
        case 1:
          this.updateBedWidth(181);
          this.updateBedInfoHeight(108);
          this.updateBedHeadHeight(24);
          this.updateBedFontSize(13);
          break;
        case 2:
          this.updateBedWidth(256);
          this.updateBedInfoHeight(184); // 220
          this.updateBedHeadHeight(36);
          this.updateBedFontSize(16);
          break;
        case 3:
          this.updateBedWidth(300);
          this.updateBedInfoHeight(216);
          this.updateBedHeadHeight(42);
          this.updateBedFontSize(18);
          break;
        default:
          this.updateBedWidth(181);
          this.updateBedInfoHeight(108);
          this.updateBedHeadHeight(24);
          this.updateBedFontSize(13);
      }
      console.log(value);
    }
  },
  components: {
    YlSelect: Select
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
  padding: 0 50px;
}
</style>
