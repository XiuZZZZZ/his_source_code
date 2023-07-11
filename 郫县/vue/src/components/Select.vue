<script>
import Vue from 'vue';
import { runServerMethodStr } from '../store/api/runServerMethod';

export default {
  name: 'Select',
  mixins: [Vue.component('ElSelect')],
  props: ['runServerMethodStr', 'data'],
  watch: {
    runServerMethodStr() {
      this.initData();
    },
  },
  data() {
    return {
      optionsData: [],
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.optionsData = this.data;
      this.$emit('update:data', []);
      if (this.runServerMethodStr) {
        runServerMethodStr(this.runServerMethodStr).then(data => {
          if (typeof data === 'object') {
            this.optionsData = data;
            this.$emit('update:data', data);
          }
        });
      }
    },
  },
};
</script>
