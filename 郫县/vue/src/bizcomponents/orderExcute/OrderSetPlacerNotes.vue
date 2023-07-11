<template>
  <div class="orderSetPlacerNotes">
    <PatInfoBanner :patInfo="order.patient" class="orderSetPlacerNotes__patInfo">
    </PatInfoBanner>
    <order-arcim-desc :order="order" class="orderSetPlacerNotes__arcimdesc" code="arcimDesc"></order-arcim-desc>
    <el-form status-icon ref="form" size="small" :rules="rules" :model="form" label-width="270px" class="orderSetPlacerNotes__form">
      </el-form-item>
      <el-form-item label="体温" v-if="order.arcimDesc.indexOf('血气')>-1" prop="temperature">
        <el-input v-model="form.temperature" placeholder="请录入采样时体温(℃)" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="氧流量" v-if="order.arcimDesc.indexOf('血气')>-1" prop="oxygen">
        <el-input v-model="form.oxygen" placeholder="请录入氧流量" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item label="24小时尿量(L)" v-if="order.arcimDesc.indexOf('血气')===-1" prop="urine">
        <el-input v-model="form.urine" placeholder="请录入24小时尿量(L)" style="width:220px"></el-input>
      </el-form-item>
      <el-form-item>
        <common-button @click="onSubmitBtnClick('form')">确认</common-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import CommonButton from '../../components/CommonButton';
import OrderArcimDesc from './OrderArcimDesc';
import PatInfoBanner from '../bedChart/PatInfoBanner';
import orderHandleApi from '../../store/api/orderHandle';

export default {
  name: 'OrderSetPlacerNotes',
  props: ['orders', 'func'],
  components: {
    CommonButton,
    PatInfoBanner,
    OrderArcimDesc,
  },
  data() {
    const form = {
      temperature: '',
      oxygen: '',
      urine: '',
    };
    const validatorTemperature = function(rule, value, callback) {
      const valueString = value.trim();
      const error = [];
      if (isNaN(valueString) || valueString === '') {
        error.push('体温值不能输入非数字数据');
        callback(error);
        return;
      }
      if (valueString > 50 || valueString < 30) {
        error.push('体温必须在30~50之间');
        callback(error);
        return;
      }
      callback();
    };
    const validatorOxygen = function(rule, value, callback) {
      const valueString = value.trim();
      const error = [];
      if (isNaN(valueString) || valueString === '') {
        error.push('氧流量值不能输入非数字数据');
        callback(error);
        return;
      }
      callback();
    };
    const validatorUrine = function(rule, value, callback) {
      const valueString = value.trim();
      const error = [];
      if (isNaN(valueString) || valueString === '') {
        error.push('尿量值不能输入非数字数据');
        callback(error);
        return;
      }
      if (valueString > 10 || valueString < 0) {
        error.push('尿量须在0~10之间');
        callback(error);
        return;
      }
      callback();
    };
    return {
      order: null,
      index: null,
      form,
      rules: {
        temperature: [
          {
            type: 'string',
            required: true,
            message: '请录入采样时体温(℃)',
            trigger: 'change',
          },
          { validator: validatorTemperature, trigger: 'change' },
        ],
        oxygen: [
          {
            type: 'string',
            required: true,
            message: '请录入氧流量',
            trigger: 'change',
          },
          { validator: validatorOxygen, trigger: 'change' },
        ],
        urine: [
          {
            type: 'string',
            required: true,
            message: '请录入24小时尿量(L)',
            trigger: 'change',
          },
          { validator: validatorUrine, trigger: 'change' },
        ],
      },
    };
  },
  beforeMount() {
    this.init();
  },
  watch: {
    orders(value) {
      if (value && value.length !== 0) {
        this.index = 0;
        this.order = value[this.index];
      }
    },
    index(value) {
      if (value !== 0 && value !== null) {
        this.order = this.orders[value];
      }
    },
  },
  methods: {
    init() {
      this.form = {
        temperature: '',
        oxygen: '',
        urine: '',
      };
      this.index = null;
      this.order = null;
      if (this.orders && this.orders.length !== 0) {
        this.index = 0;
        this.order = this.orders[this.index];
      }
      if (this.$refs && this.$refs.form && this.$refs.form.resetFields) {
        this.$refs.form.resetFields();
      }
    },
    onSubmitBtnClick(formName) {
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let notes = '';
          if (that.form.temperature) {
            notes = `体温:${that.form.temperature}℃`;
          }
          if (that.form.oxygen) {
            notes = `${notes},氧流量:${that.form.oxygen}`;
          }
          if (that.form.urine) {
            notes = `24小时尿量:${that.form.urine}L`;
          }
          if (
            that.order.execInfos &&
            that.order.execInfos[0] &&
            that.order.execInfos[0].ID
          ) {
            const loadingInstance = this.$loading({
              fullscreen: true,
              text: '后台处理中...',
            });
            orderHandleApi
              .setOrdPlaceNote(that.order.execInfos[0].ID, notes)
              .then(() => {
                that.$message.success('保存备注成功!');
                that.$nextTick(() => {
                  loadingInstance.close();
                });
                if (this.index < this.orders.length - 1) {
                  this.index = this.index + 1;
                } else {
                  that.$emit('close');
                  if (this.func && typeof this.func === 'function') {
                    this.func();
                  }
                }
              });
          }
        } else {
          return false;
        }
        return true;
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../../assets/main.css';
@b orderSetPlacerNotes {
  @e arcimdesc {
    left: 80px;
  }
}
</style>
