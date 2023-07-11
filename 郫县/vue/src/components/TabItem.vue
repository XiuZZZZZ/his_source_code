<template>
  <li class="tabItem"
      :class="{'is-selected':ifSelected }"
      @click="selectTab"
      :style="getLiStyle">
    <sup class="tabItem__badge"
         v-if="data.badge">
    </sup>
    <a class="tabItem__link"
       href="#"
       :style="getAStyle">{{data.name}}</a>
  </li>
</template>
<script>
export default {
  name: 'tabItem',
  props: ['data', 'lineBorder', 'color'],
  computed: {
    ifSelected() {
      return this.$parent.selectedTabIndex !== null
        ? this.$parent.selectedTabIndex === this.data.index
        : this.$parent.defaultSelectedTabIndex === this.data.index;
    },
    getLiStyle() {
      const style = {
        borderRight: this.lineBorder,
      };
      return style;
    },
    getAStyle() {
      const style = {
        color: !this.ifSelected ? this.color : '',
      };
      return style;
    },
  },
  methods: {
    selectTab() {
      this.$emit('selectTab', this.data.index);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../assets/main.css';
@b tabItem {
  padding: 0px 12px;
  display: inline-block;
  /* float: left; */
  position: relative;
  top: -3px;
  @when selected {
    position: relative;
    top: -1px;
    height: 43px;
    line-height: 0;
    border-top: 3px solid var(--mainColor);
    background-color: #ffffff;
    color: var(--mainColor);
    pointer-events: none;
  }
  &:last-child {
    border-right-width: 0px;
  }
  @e badge {
    position: absolute;
    display: inline-block;
    height: 10px;
    width: 10px;
    background-color: #ee4f38;
    text-align: center;
    color: #fff;
    transform: translateY(-50%) translateX(100%);
    font-size: 14px;
    line-height: 18px;
    border: 1px solid transparent;
    border-radius: 10px;
    top: 0;
    right: 10px;
  }
  @e link {
    line-height: 44px;
    font-size: var(--navFontSize);
    text-align: center;
    color: #a5a5a5;
    &:hover {
      color: var(--mainColor);
    }
    &:visited {
      color: #000;
    }
    @nest .tabItem:hover {
      color: var(--mainColor);
    }
    @nest .tabItem.is-selected & {
      color: var(--mainColor);
    }
  }
}
</style>
