<template>
  <div class="arrowPanel">
    <span class="arrowPanel__arraow" :style="beforeStyle" />
    <span class="arrowPanel__arraow" :style="afterStyle" />
    <p class="arrowPanel__head" v-if="title">
      <span class="arrowPanel__title">{{title}}</span>
      <a class="arrowPanel__close" href="#" @click="closePanel">x</a>
    </p>
    <div class="arrowPanel__content" :style="contentStyle">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ArrowPanel',
  props: [
    'arrowSize',
    'arrowBorderWidth',
    'arrowColor',
    'arrowBorderColor',
    'center',
    'arrowLeft',
    'title',
  ],
  computed: {
    beforeStyle() {
      const size = this.arrowSize + this.arrowBorderWidth;
      const style = {
        borderWidth: `${size}px`,
        borderBottomColor: `${this.arrowBorderColor}`,
      };
      if (this.center) {
        style.left = '50%';
        style.marginLeft = `-${size}px`;
      } else {
        style.left = `${this.arrowLeft}px`;
      }
      return style;
    },
    afterStyle() {
      const style = {
        borderWidth: `${this.arrowSize}px`,
        borderBottomColor: `${this.arrowColor}`,
      };
      if (this.center) {
        style.left = '50%';
        style.marginLeft = `${-this.arrowSize}px`;
      } else {
        const left = this.arrowLeft + 1;
        style.left = `${left}px`;
      }
      return style;
    },
    contentStyle() {
      let contentTop = '33px';
      if (!this.title) {
        contentTop = '0';
      }
      const contentStyle = {
        top: contentTop,
      };
      return contentStyle;
    },
  },
  methods: {
    closePanel() {
      this.$emit('close');
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../assets/main.css';
@b arrowPanel {
  position: absolute;
  @e content {
    position: absolute;
    bottom: 0;
    width: 95%;
    padding: 0 2.5%;
    overflow: auto;
  }
  @e arraow {
    position: absolute;
    bottom: 100%;
    height: 0;
    width: 0;
    border: solid transparent;
  }
  @e head {
    line-height: 32px;
    width: 100%;
    height: 32px;
    border-bottom: 1px solid #cccccc;
    background-color: #f5f5f5;
    border-radius: 6px 6px 0 0;
  }
  @e title {
    float: left;
    padding-left: 10px;
  }
  @e close {
    float: right;
    vertical-align: middle;
    padding-right: 10px;
    padding-left: 10px;
  }
}
</style>
