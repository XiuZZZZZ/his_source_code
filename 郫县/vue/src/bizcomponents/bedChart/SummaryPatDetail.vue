<template>
  <div>
    <span class="bedCode">{{data.bedCode}} 床</span>
    <span class="patName">{{data.name}}</span>
    <span class="text">有需处理医嘱</span>
    <common-button class="rightButton" @clickButton="clickDealWithOrderButton">处理医嘱</common-button>
  </div>
</template>
<script>
import CommonButton from '../../components/CommonButton';

export default {
  name: 'SummaryPatDetail',
  props: ['data'],
  components: {
    CommonButton,
  },
  methods: {
    clickDealWithOrderButton() {
      console.log(this.data.episodeID);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
@import '../../assets/main.css';
div {
  text-align: left;
  line-height: 45px;
  border-bottom: 1px dotted #cccccc;
  white-space: nowrap;
}

div span {
  display: inline-block;
}

span.bedCode {
  width: 46px;
  padding-left: 30px;
}

span.patName {
  width: 48px;
  padding-left: 30px;
}

span.text {
  width: 84px;
  padding-left: 30px;
}

.rightButton {
  float: right;
  margin: 8px 8px 0 0;
}
</style>
