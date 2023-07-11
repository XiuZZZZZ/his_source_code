<template>
  <div class="patInfo">
    <p class="patInfo__item"
       v-for="{desc,key} of popoverInfo"
       :key="key">
      {{desc +' : '}}<span v-html="split(data[key])">{{split(data[key])}}</span>
    </p>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "PatInfo",
  props: ["data"],
  computed: {
    ...mapGetters(["infoSetting"]),
    popoverInfo() {
      const infos = [];
      this.infoSetting.popoverInfo.forEach(key => {
        if (this.data[key]) {
          infos.push({
            desc: this.infoSetting.infoData.find(info => info.key === key)
              .description,
            key
          });
        }
      });
      return infos;
    }
  },
  methods: {
    split(content) {
      const splitLen = 19;
      let conentChunks = "";
      const len = Math.ceil(content.length / splitLen);
      let contentSubs = content;
      if (len > 1) {
        for (let i = 0; i < len; i += 1) {
          if (contentSubs.length >= splitLen) {
            const strCut = contentSubs.substring(0, splitLen);
            if (conentChunks === "") {
              conentChunks += `${strCut}<br/>`;
            } else {
              conentChunks += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${strCut}<br/>`;
            }
            contentSubs = contentSubs.substring(splitLen);
          } else {
            conentChunks += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${contentSubs}`;
          }
        }
      } else {
        conentChunks = content;
      }
      return conentChunks;
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../assets/main.css";
@b patInfo {
  background-color: #4c4c4c;
  color: #fff;
  padding: 2px 8px 2px 8px;
  border-radius: 4px;
  overflow: hidden;
  @e item {
    width: 120px;
    font-size: var(--mainFontSize);
    line-height: 26px;
    white-space: nowrap;
  }
}
</style>
