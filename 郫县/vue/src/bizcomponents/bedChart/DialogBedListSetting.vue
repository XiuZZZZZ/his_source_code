<template>
  <el-dialog class="dilagBedListSetting" :visible.sync="ifShow" size="tiny" @close="closeDialog">
    <template slot="title">
      <i class="dilagBedListSetting__icon fa fa-bed "></i>
      <span class="dilagBedListSetting__title">{{dialogTitle}}</span>
    </template>
    <el-form class="dilagBedListSetting__form" label-position="right" label-width="90px">
      <el-form-item label="显示列">
        <yl-select size="large" :value="bedListSetting.bedListColumns" @input="updateBedListColumn" :data="infoSetting.infoData" multiple filterable :filter-method="filterColumnInfo" clearable ref="bedListColumnSelect">
          <el-option v-for="item in bedListColumnFiltered" :key="item.key" :label="item.description" :value="item.key"></el-option>
        </yl-select>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import Select from '../../components/Select';
import pinyinUtil from '../../comm/pinyinUtil';

export default {
  name: 'ComponentName',
  props: ['value', 'dialogTitle'],
  data() {
    return {
      ifShow: false,
      bedListColumnFiltered: [],
    };
  },
  watch: {
    value(value) {
      this.ifShow = value;
    },
  },
  mounted() {
    this.ifShow = true;
    this.bedListColumnFiltered = this.infoSetting.infoData;
  },
  computed: {
    ...mapGetters(['infoSetting', 'bedListSetting']),
  },
  methods: {
    ...mapMutations(['updateBedListSetting']),
    closeDialog() {
      this.ifShow = false;
      this.$emit('input', this.ifShow);
    },
    filterColumnInfo(query) {
      const queryStr = query.toUpperCase();
      this.bedListColumnFiltered = this.$refs.bedListColumnSelect.optionsData.filter(
        info =>
          info.description.indexOf(queryStr) > -1 ||
          info.key.toUpperCase().indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(info.description).indexOf(queryStr) > -1,
      );
    },
    updateBedListColumn(bedListColumns) {
      this.updateBedListSetting({
        bedListColumns,
      });
    },
  },
  components: {
    YlSelect: Select,
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../../assets/main.css';
@b dilagBedListSetting {
  @e title {
    padding: 0 0 0 7px;
    font-size: var(--navFontSize);
    color: white;
  }
  @e form {
    padding: 0 50px;
  }
  @e icon {
    color: white;
  }
}
</style>
