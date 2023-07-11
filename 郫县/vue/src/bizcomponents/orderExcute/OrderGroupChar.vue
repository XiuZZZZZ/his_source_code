<template>
  <td class="orderItem__td orderGroupChar" style="position:relative">
    <template v-if="num>0">
      <i class="orderGroupChar__groupChart" v-for="i of groupChartNum"></i>
    </template>
  </td>
</template>
<script>
export default {
  name: "OrderGroupChar",
  props: ["num", "childs"],
  computed: {
    groupChartNum() {
      let groupNum = this.num;
      this.childs.forEach(child => {
        if (String(child.orcatDesc).indexOf("草药") > -1) {
          groupNum -= 1;
        }
      });
      return groupNum;
    }
  }
};
</script>
<style >
@import "../../assets/main.css";
@b orderGroupChar {
  @e groupChart {
    border-color: #ccc;
    border-width: 2px;
    border-bottom-style: none;
    display: block;
    width: 15px;
    height: calc(var(--orderItemInterval) + 19px);
    border-left-style: solid;
    &:first-child {
      margin-top: 10px;
      border-top-style: solid;
    }
    &:last-child {
      border-bottom-style: solid;
    }
  }
}
</style>
