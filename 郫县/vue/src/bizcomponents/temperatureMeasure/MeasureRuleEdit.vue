<template>
  <div class="measureRuleEdit">
    <el-form
      status-icon
      ref="form"
      :rules="rules"
      :model="form"
      label-width="140px"
      class="measureRuleEdit__form"
    >
      <el-form-item label="code" prop="code" key="measureRuleEditCode">
        <el-input class="measureRuleEdit__input" v-model="form.code" align="right"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc" key="measureRuleEditDesc">
        <el-input class="measureRuleEdit__input" v-model="form.desc" align="right"></el-input>
      </el-form-item>
      <el-form-item label="需测体征项" prop="measureItems" key="measureRuleEditMeasureItems">
        <yl-select
          v-model="form.measureItems"
          class="measureRuleEdit__select"
          @update:data="value=>measureItems=value"
          clearable
          filterable
          multiple
          :multiple-limit="(form.type==='SIGNS')?1:0"
          :runServerMethodStr="measureItemsQuery"
        >
          <el-option
            v-for="item in measureItems"
            :key="item.ID"
            :label="item.desc"
            :value="item.ID"
          ></el-option>
        </yl-select>
      </el-form-item>
      <el-form-item label="类型" prop="type" key="measureRuleEditMeasureType">
        <yl-select
          v-model="form.type"
          class="measureRuleEdit__select"
          @update:data="value=>types=value"
          @change="onTypeChange"
          filterable
          clearable
          :runServerMethodStr="`${temperatureMeasureRuleApi.className}:${temperatureMeasureRuleApi.findType}`"
          ref="docSelect"
        >
          <el-option v-for="item in types" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </yl-select>
      </el-form-item>
      <template v-if="form.type&&form.type!==''">
        <el-form-item
          :label="displayItemsLabel"
          v-if="(form.type==='ORDER')||(form.type==='SIGNS')||(form.type==='EVENT')||(form.type==='MUTIPLY')"
          prop="items"
          key="measureRuleEditMeasureItemss"
        >
          <yl-select
            v-model="form.items"
            class="measureRuleEdit__select"
            @update:data="value=>items=value"
            clearable
            :filterable="form.type==='ORDER'"
            :remote="form.type==='ORDER'"
            :remoteMethod="itemsRemoteMethod"
            multiple
            :multiple-limit="(form.type==='SIGNS'||form.type==='MUTIPLY')?1:0"
            :runServerMethodStr="itemsQuery"
          >
            <el-option v-for="item in items" :key="item.ID" :label="item.desc" :value="item.ID"></el-option>
          </yl-select>
        </el-form-item>
        <el-form-item
          label="医嘱"
          v-if="form.type==='MUTIPLY'"
          prop="secondItems"
          key="measureRuleEditMeasuresecondItemss"
        >
          <yl-select
            v-model="form.secondItems"
            class="measureRuleEdit__select"
            @update:data="value=>secondItems=value"
            clearable
            filterable
            remote
            multiple
            :multiple-limit="1"
            :remoteMethod="secondItemsRemoteMethod"
            :runServerMethodStr="secondItemsQuery"
          >
            <el-option
              v-for="item in secondItems"
              :key="item.ID"
              :label="item.desc"
              :value="item.ID"
            ></el-option>
          </yl-select>
        </el-form-item>
        <el-form-item
          label="生效公式"
          v-if="(form.type==='SIGNS')||(form.type==='SPECIAL')"
          prop="condition"
          key="measureRuleEditMeasurecondition"
        >
          <el-input class="measureRuleEdit__input" v-model="form.condition" align="right"></el-input>
        </el-form-item>
        <el-form-item
          label="生效当天需测时间"
          prop="measureTimesToday"
          key="measureRuleEditMeasuremeasureTimesToday"
        >
          <yl-select
            v-model="form.measureTimesToday"
            class="measureRuleEdit__select"
            @update:data="value=>measureTimeItems=value"
            clearable
            filterable
            multiple
            :runServerMethodStr="measureItemTimesQuery"
          >
            <el-option
              v-for="item in measureTimeItems"
              :key="item.desc"
              :label="item.desc"
              :value="item.desc"
            ></el-option>
          </yl-select>
        </el-form-item>
        <el-form-item
          label="非当天需测时间"
          v-if="(form.type!=='NORMAL')"
          prop="measureTimes"
          key="measureRuleEditMeasuremeasureTimes"
        >
          <yl-select
            v-model="form.measureTimes"
            class="measureRuleEdit__select"
            @update:data="value=>measureTimeItems=value"
            clearable
            filterable
            multiple
            :runServerMethodStr="measureItemTimesQuery"
          >
            <el-option
              v-for="item in measureTimeItems"
              :key="item.desc"
              :label="item.desc"
              :value="item.desc"
            ></el-option>
          </yl-select>
        </el-form-item>
        <el-form-item label="持续周期" v-if="(form.type!=='NORMAL')&&(form.type!=='SIGNS')">
          <el-col :span="18">
            <el-form-item prop="measureSustain" key="measureRuleEditMeasuremeasureSustain">
              <el-input-number v-model="form.measureSustain" :min="0" :max="10"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="measureSustainUnit" key="measureRuleEditmeasureSustainUnit">
              <el-select
                v-model="form.measureSustainUnit"
                :disabled="form.type!=='SIGNS'"
                placeholder=" "
              >
                <el-option
                  v-for="item in units"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="正常值生效公式"
          v-if="(form.type==='SIGNS')"
          prop="normalCondition"
          key="measureRuleEditnormalCondition"
        >
          <el-input class="measureRuleEdit__input" v-model="form.normalCondition" align="right"></el-input>
        </el-form-item>
        <el-form-item label="持续周期" v-if="(form.type==='SIGNS')">
          <el-col :span="18">
            <el-form-item prop="normalSustain" key="measureRuleEditnormalSustain">
              <el-input-number v-model="form.normalSustain" :min="0" :max="10"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="normalSustainUnit" key="measureRuleEditnormalSustainUnit">
              <el-select v-model="form.normalSustainUnit" placeholder=" ">
                <el-option
                  v-for="item in units"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="正常后需测时间点"
          v-if="(form.type==='SIGNS')"
          prop="continueMeasureTimes"
          key="continueMeasureTimes"
        >
          <yl-select
            v-model="form.continueMeasureTimes"
            class="measureRuleEdit__select"
            @update:data="value=>measureTimeItems=value"
            clearable
            filterable
            multiple
            :runServerMethodStr="measureItemTimesQuery"
          >
            <el-option
              v-for="item in measureTimeItems"
              :key="item.desc"
              :label="item.desc"
              :value="item.desc"
            ></el-option>
          </yl-select>
        </el-form-item>
        <el-form-item label="持续周期" v-if="(form.type==='SIGNS')">
          <el-col :span="18">
            <el-form-item prop="continueMeasureSustain" key="continueMeasureSustain">
              <el-input-number v-model="form.continueMeasureSustain" :min="0" :max="10"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="continueMeasureSustainUnit" key="continueMeasureSustainUnit">
              <el-select v-model="form.continueMeasureSustainUnit" placeholder=" ">
                <el-option
                  v-for="item in units"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="生效科室" prop="locs" key="sssslocs">
          <el-tooltip effect="light" placement="right">
            <div slot="content">默认全部科室生效,有值时只针对选中科室生效</div>
            <yl-select
              v-model="form.locs"
              ref="locSelect"
              class="measureRuleEdit__select"
              @update:data="value=>locItems=value"
              clearable
              filterable
              :filter-method="filterLocs"
              multiple
              placeholder="默认全院生效"
              :runServerMethodStr="locItemsQuery"
            >
              <el-option
                v-for="item in locItems"
                :key="item.ID"
                :label="item.desc"
                :value="item.ID"
              ></el-option>
            </yl-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="无效科室" prop="invalidLocs" key="invalidLocs">
          <el-tooltip effect="light" placement="right">
            <div slot="content">有值时规则对选中的科室无效</div>
            <yl-select
              v-model="form.invalidLocs"
              ref="invalidLocSelect"
              class="measureRuleEdit__select"
              @update:data="value=>invalidLocItems=value"
              clearable
              filterable
              placeholder="需要屏蔽的科室"
              :filter-method="filterInvalidLocs"
              multiple
              :runServerMethodStr="locItemsQuery"
            >
              <el-option
                v-for="item in invalidLocItems"
                :key="item.ID"
                :label="item.desc"
                :value="item.ID"
              ></el-option>
            </yl-select>
          </el-tooltip>
        </el-form-item>
      </template>
      <el-form-item>
        <common-button @click="onSubmitBtnClick('form')">保存</common-button>
        <common-button @click="onCloseBtnClick">取消</common-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CommonButton from "../../components/CommonButton";
import Select from "../../components/Select";
import temperatureMeasureRuleApi from "../../store/api/temperatureMeasureRule";
import orderApi from "../../store/api/order";
import temperatureApi from "../../store/api/temperature";
import locApi from "../../store/api/loc";
import pinyinUtil from "../../comm/pinyinUtil";

export default {
  name: "MeasureRuleEdit",
  props: ["value"],
  data() {
    const that = this;
    const form = {};
    const rules = {
      code: [
        {
          type: "string",
          required: true,
          message: "请输入code!",
          trigger: "blur"
        },
        {
          validator(rule, value, callback) {
            const error = [];
            temperatureMeasureRuleApi.getID(value).then(ID => {
              if (
                !(String(ID) === String(that.form.ID) || String(ID) === "0")
              ) {
                error.push("code已经存在!");
              }
              callback(error);
            });
          },
          trigger: "change"
        }
      ],
      desc: [
        {
          type: "string",
          required: true,
          message: "请输入描述!",
          trigger: "blur"
        }
      ],
      measureItems: [
        {
          type: "array",
          required: true,
          message: "请选择需测体征项!",
          trigger: "blur"
        }
      ],
      type: [
        {
          type: "string",
          required: true,
          message: "请选择类型!",
          trigger: "blur"
        }
      ],
      items: [
        { type: "array", required: true, message: "此项必填!", trigger: "blur" }
      ],
      condition: [
        {
          type: "string",
          required: true,
          message: "请填写体征规则生效公式!",
          trigger: "blur"
        }
      ],
      secondItems: [
        { type: "array", required: true, message: "此项必填!", trigger: "blur" }
      ],
      measureTimesToday: [
        {
          type: "array",
          required: true,
          message: "请选择时间点!",
          trigger: "blur"
        }
      ],
      measureTimes: [
        {
          type: "array",
          message: "请选择时间点",
          trigger: "blur"
        },
        {
          validator(rule, value, callback) {
            const error = [];
            if (value.length === 0 && that.form.measureSustain > 0) {
              error.push("请选择时间点!");
            }
            callback(error);
          }
        }
      ],
      // measureSustain(rule, value, callback) {
      //   const error = [];
      //   if (that.form.measureTimes.length > 0 && (value === 0)) {
      //     error.push('请选择大于0的天数!');
      //   }
      //   callback(error);
      // },
      normalCondition: [
        {
          type: "string",
          required: true,
          message: "请选择正常值生效的条件公式!",
          trigger: "blur"
        }
      ],
      normalSustain: [
        {
          type: "number",
          required: true,
          message: "请选择正常值生效的周期!",
          trigger: "blur"
        }
      ],
      continueMeasureTimes: [
        {
          type: "array",
          message: "请选择时间点",
          trigger: "blur"
        },
        {
          validator(rule, value, callback) {
            const error = [];
            if (value.length === 0 && that.form.continueMeasureSustain > 0) {
              error.push("请选择时间点!");
            }
            callback(error);
          }
        }
      ],
      continueMeasureSustain: [
        {
          type: "number",
          message: "请选择大于0的天数!",
          trigger: "blur"
        },
        {
          validator(rule, value, callback) {
            const error = [];
            if (that.form.continueMeasureTimes.length > 0 && value === 0) {
              error.push("请选择大于0的天数!");
            }
            callback(error);
          }
        }
      ]
    };
    return {
      form,
      rules,
      types: [],
      items: [],
      secondItems: [],
      measureItems: [],
      measureTimeItems: [],
      locItems: [],
      invalidLocItems: [],
      itemsQueryString: "",
      secondItemsQueryString: "",
      // locQueryString: '',
      // invalidLocQueryString: '',
      temperatureMeasureRuleApi,
      units: [
        {
          value: "DAY",
          label: "天"
        },
        {
          value: "TIME",
          label: "次"
        }
      ]
    };
  },
  components: {
    CommonButton,
    YlSelect: Select
  },
  created() {
    this.init();
    if (this.value) {
      this.initValue();
    }
  },
  watch: {
    value() {
      this.initValue();
    }
  },
  methods: {
    init() {
      this.form = {
        ID: "",
        code: "",
        desc: "",
        measureItems: [],
        type: "",
        items: [],
        secondItems: [],
        condition: "",
        measureTimesToday: [],
        measureTimes: [],
        measureSustain: 0,
        measureSustainUnit: "DAY",
        normalCondition: "",
        normalSustain: 0,
        normalSustainUnit: "DAY",
        continueMeasureTimes: [],
        continueMeasureSustain: 0,
        continueMeasureSustainUnit: "DAY",
        locs: [],
        invalidLocs: []
      };
      if (this.$refs && this.$refs.form && this.$refs.form.resetFields) {
        this.$refs.form.resetFields();
      }
    },
    initValue() {
      Object.keys(this.value).forEach(key => {
        if (key === "type") {
          this.form[key] = this.value[key].code;
        } else if (
          key === "items" ||
          key === "secondItems" ||
          key === "measureItems" ||
          key === "locs" ||
          key === "invalidLocs"
        ) {
          this.form[key] = Array.isArray(this.value[key])
            ? this.value[key].map(value => value.ID)
            : this.value[key];
          if (
            key === "items" &&
            Array.isArray(this.value[key]) &&
            (this.value.type.code === "ORDER" ||
              this.value.type.code === "MUTIPLY")
          ) {
            this.$nextTick(() => {
              this.items = [].concat(this.value[key]);
            });
          }
          if (key === "secondItems" && Array.isArray(this.value[key])) {
            this.$nextTick(() => {
              this.secondItems = [].concat(this.value[key]);
            });
          }
        } else if (Array.isArray(this.value[key])) {
          // 时间点
          this.form[key] = this.value[key];
        } else {
          this.form[key] = String(this.value[key]);
        }
      });
    },
    onTypeChange() {
      if (this.form.items && this.form.items.length) {
        this.form.items.splice(0, this.form.items.length);
      }
      this.itemsQueryString = "";
      this.secondItemsQueryString = "";
    },
    onSubmitBtnClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const valueObject = {};
          const fields = this.$refs[formName].fields;
          fields.forEach(field => {
            if (Array.isArray(this.form[field.prop])) {
              this.form[field.prop].sort();
            }
            valueObject[field.prop] = this.form[field.prop];
          });
          if (this.form.ID) {
            valueObject.ID = this.form.ID;
          }
          temperatureMeasureRuleApi.save(valueObject).then(result => {
            const resultStr = String(result);
            if (resultStr !== "0") {
              this.$message.error(resultStr);
            } else {
              this.$message.success("保存成功");
              this.$emit("saved");
            }
          });
        }
      });
    },
    onCloseBtnClick() {
      this.$emit("close");
    },
    filterLocs(query) {
      const queryStr = query.toUpperCase();
      this.locItems = this.$refs.locSelect.optionsData.filter(
        loc =>
          String(loc.desc).indexOf(queryStr) > -1 ||
          String(loc.code).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(loc.desc).indexOf(queryStr) > -1
      );
    },
    filterInvalidLocs(query) {
      const queryStr = query.toUpperCase();
      this.invalidLocItems = this.$refs.invalidLocSelect.optionsData.filter(
        loc =>
          String(loc.desc).indexOf(queryStr) > -1 ||
          String(loc.code).indexOf(queryStr) > -1 ||
          pinyinUtil.getFirstLetter(loc.desc).indexOf(queryStr) > -1
      );
    },
    itemsRemoteMethod(queryString) {
      this.itemsQueryString = queryString;
    },
    secondItemsRemoteMethod(queryString) {
      this.secondItemsQueryString = queryString;
    }
    // locsRemoteMethod(queryString) {
    //   this.locQueryString = queryString;
    // },
    // invalidLocsRemoteMethod(queryString) {
    //   this.invalidLocQueryString = queryString;
    // },
  },
  computed: {
    displayItemsLabel() {
      const { type } = this.form;
      let label = "";
      switch (type) {
        case "ORDER":
          label = "医嘱";
          break;
        case "SIGNS":
          label = "体征项";
          break;
        case "EVENT":
          label = "事件";
          break;
        case "MUTIPLY":
          label = "事件";
          break;
        default:
          break;
      }
      return label;
    },
    measureItemTimesQuery() {
      return `${temperatureApi.className}:${temperatureApi.findTime}`;
    },
    measureItemsQuery() {
      return `${temperatureApi.className}:${temperatureApi.findItem}`;
    },
    itemsQuery() {
      const { type } = this.form;
      let query = "";
      switch (type) {
        case "ORDER":
          query = `${orderApi.className}:${orderApi.findMasterItem}.20`;
          break;
        case "SIGNS":
          query = `${temperatureApi.className}:${temperatureApi.findItem}`;
          break;
        case "EVENT":
          query = `${temperatureApi.className}:${temperatureApi.findEventType}`;
          break;
        case "MUTIPLY":
          query = `${temperatureApi.className}:${temperatureApi.findEventType}`;
          break;
        default:
          break;
      }
      return `${query}:${this.itemsQueryString}`;
    },
    secondItemsQuery() {
      const query = `${orderApi.className}:${orderApi.findMasterItem}.20`;
      return `${query}:${this.secondItemsQueryString}`;
    },
    locItemsQuery() {
      return `${locApi.className}:${locApi.getLocs}:W`;
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
@b measureRuleEdit {
  margin: 0 auto;
  width: 400px;
  @e select {
    width: 100%;
  }
  @e form {
    max-height: 500px;
  }
}
</style>
