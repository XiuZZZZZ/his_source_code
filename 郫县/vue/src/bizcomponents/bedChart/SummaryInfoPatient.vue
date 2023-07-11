<template>
  <div class="summaryInfoPatient">
    <span v-if="data.bedCode"
          class="summaryInfoPatient__bedCode">{{data.bedCode}} 床</span>
    <span class="summaryInfoPatient__name">{{data.name}}</span>
    <!--<span class="summaryInfoPatient__info">有需处理医嘱</span>-->
    <common-button class="summaryInfoPatient__btn"
                   @click="clickDealWithOrderButton">处理医嘱</common-button>
  </div>
</template>
<script>
import CommonButton from "../../components/CommonButton";

export default {
  name: "summaryInfoPatient",
  props: ["data"],
  components: {
    CommonButton
  },
  methods: {
    clickDealWithOrderButton() {
      /* global window */
      window.open(
        `dhc.nurse.vue.mainentry.csp?EpisodeID=${
          this.data.episodeID
        }&ViewName=OrderExcute`,
        "护士执行",
        `top=0,left=0,width=${window.screen.availWidth - 10},height=${window
          .screen.availHeight - 10}`
      );
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../assets/main.css";
:root {
  --columnStyle: {
    width: 46px;
    padding-left: 15px;
  }
}

@b summaryInfoPatient {
  text-align: left;
  line-height: 45px;
  border-bottom: 1px dotted #cccccc;
  white-space: nowrap;
  & span {
    display: inline-block;
  }
  @e bedCode {
    @apply --columnStyle;
  }
  @e name {
    @apply --columnStyle;
    padding-left: 45px;
  }
  @e info {
    @apply --columnStyle;
    width: 84px;
  }
  @e btn {
    float: right;
    margin: 8px 8px 0 0;
  }
}
</style>
