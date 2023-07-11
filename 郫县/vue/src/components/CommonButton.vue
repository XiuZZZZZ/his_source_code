<template>
  <a class="commonButton"
     :class="{'is-hover':hover ,'is-common':!hover}"
     href="#"
     @click.stop="clickButton"
     @blur="blur"
     :style="getStyle">
    <span class="commonButton__iconWraper"
          v-if="iconClass"
          :style="getIconStyle">
      <i class="commonButton__icon"
         :class="iconClass" />
    </span>
    <slot/>
    <i class="commonButton__whiteLine"
       v-if="hover" />
    <div class="commonButton__hoverContent">
      <slot name="hoverContent" />
    </div>
  </a>
</template>
<script>
export default {
  name: 'CommonButton',
  props: [
    'data',
    'width',
    'color',
    'border',
    'iconColor',
    'iconBorderRight',
    'backgroundColor',
    'iconClass',
    'iconBackgroundColor',
    'hover',
  ],
  computed: {
    getStyle() {
      const style = {};
      style.backgroundColor = '#ffffff';
      style.border = '1px solid #509de1';
      style.color = '#000000';
      if (!this.iconClass) {
        style.paddingLeft = '8px';
      }
      if (this.width) {
        style.width = `${this.width - 18}px`;
      }
      if (this.backgroundColor) {
        style.backgroundColor = this.backgroundColor;
      }
      if (this.color) {
        style.color = this.color;
      }
      if (this.border) {
        style.border = this.border;
      }
      return style;
    },
    getIconStyle() {
      const style = {};
      style.backgroundColor = '#378ec4';
      style.color = '#ffffff';
      if (this.iconBackgroundColor) {
        style.backgroundColor = this.iconBackgroundColor;
      }
      if (this.iconColor) {
        style.color = this.iconColor;
      }
      if (this.iconBorderRight) {
        style.borderRight = this.iconBorderRight;
      }
      return style;
    },
  },
  methods: {
    clickButton() {
      this.$emit('click', this);
    },
    blur() {
      this.$emit('blur', this);
    },
    mouseover() {
      this.$emit('mouseover', this);
    },
    mouseout() {
      this.$emit('mouseout', this);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../assets/main.css';
@b commonButton {
  position: relative;
  display: inline-block;
  font-size: var(--mainFontSize);
  line-height: 28px;
  padding: 0 8px 0 0;
  min-width: 80px;
  text-align: center;
  /*background-color: #40a2de;*/
  background-color: #ffffff;
  color: #000000;
  text-align: center;
  @when common {
    &:hover {
      color: #ffffff !important;
      background-color: var(--mainColor) !important;
      box-shadow: 0px 0px 8px #bdbcbc;
    }
  }
  @when hover {
    &:hover {
      color: #000;
      background-color: #fff !important;
      box-shadow: 0px 0px 8px #bdbcbc;
    }
  }
  @e iconWraper {
    font-size: 20px;
    text-align: center;
    line-height: 31px;
    display: inline-block;
    /*background-color: #378ec4;*/
    margin-right: 4px;
    width: 30px;
    vertical-align: sub;
  }
  @e icon {
    @nest .commonButton.is-hover:hover & {
      transform: rotate(-180deg);
    }
    @nest .commonButton.is-hover & {
      transform: rotate(-360deg);
      transition-timing-function: ease;
      transition-duration: 0.8s;
      transition-property: all;
    }
  }
  @e hoverContent {
    @nest .commonButton.is-hover & {
      visibility: hidden;
      position: absolute;
      opacity: 0;
      right: -1px;
      z-index: 0;
      pointer-events: none;
      transform: translateY(-10px);
      transition-duration: 0.8s;
      transition-property: all;
      transition-timing-function: ease;
      box-shadow: 0 0 5px 2px #bdbcbc;
    }
    @nest .commonButton.is-hover:hover & {
      visibility: visible;
      pointer-events: auto;
      opacity: 1;
      z-index: auto;
      transform: translateY(-3px);
    }
  }
  @e whiteLine {
    @nest .commonButton.is-hover:hover & {
      display: block;
      position: absolute;
      background-color: #ffffff;
      top: 23px;
      width: 100%;
      height: 8px;
      z-index: 2;
    }
  }
}
</style>
