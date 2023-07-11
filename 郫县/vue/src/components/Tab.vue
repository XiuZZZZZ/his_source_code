<template>
  <div class="tab">
    <!--<span class="tab__rightSlot">
      <slot name="rightHeadSlot" />
    </span>-->
    <div class="tab__wrapper"
         :style="getColorStyle"
         ref="wrapper">
      <el-dropdown class="tab__menu"
                   placement="bottom-start"
                   @command="handleCommand"
                   v-if="ifShowScroll">
        <el-button class="tab__menuButton"
                   :style="getColorStyle"
                   >
          {{lastTabName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item of menuItems"
                            :command="item.index"
                            :key="item.index">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <ul class="tab__body"
          :style="getBodyStyle"
          ref="body">
        <TabItem @selectTab="selectTab"
                 v-for="tabData of data"
                 :key="tabData.index"
                 :lineBorder="lineBorder"
                 :color="color"
                 :data="tabData"
                 ref="tabItem">
        </TabItem>
        <!--<div class="tab__leftSlot">
                <slot name="leftHeadSlot" />
              </div>-->
      </ul>
    </div>
    <slot name="contentSlot" />
  </div>
</template>
<script>
import TabItem from "./TabItem";

export default {
  name: "Tab",
  props: [
    "data",
    "defaultSelectedTabIndex",
    "border",
    "backgroundColor",
    "fontColor",
    "color",
    "lineBorder"
  ],
  data() {
    return {
      menuItems: [],
      ifShowScroll: false,
      selectedTabIndex: null,
      lastTabName: "更多"
    };
  },
  watch: {
    data() {
      this.$nextTick(() => {
        const width = this.$refs.wrapper.clientWidth;
        const bodyWidth = this.$refs.body.clientWidth;
        this.menuItems = [];
        this.$refs.tabItem.forEach(tabItemVue => {
          if (tabItemVue.$el.offsetLeft + 100 > width) {
            this.menuItems.push(tabItemVue.data);
          }
        });
        this.ifShowScroll = width < bodyWidth;
        if (bodyWidth < width && !this.$refs.body.style.width) {
          this.$refs.body.style.width = `${this.$refs.wrapper.clientWidth}px`;
        }
      });
    }
  },
  methods: {
    selectTab(index) {
      const oldSelectedTabIndex = this.selectedTabIndex;
      this.selectedTabIndex = index;
      if (oldSelectedTabIndex !== index) {
        this.$emit("selectTab", index);
      }
    },
    handleCommand(index) {
      const oldSelectedTabIndex = this.selectedTabIndex;
      this.selectedTabIndex = index;
      if (oldSelectedTabIndex !== index) {
        const menu = this.menuItems.find(menuItem => {
          if (menuItem.index === index) {
            return menuItem;
          }
          return null;
        });
        if (menu) {
          this.lastTabName = menu.name;
        }
        this.$emit("selectTab", index);
      }
    }
  },
  computed: {
    getColorStyle() {
      const style = {
        backgroundColor: this.backgroundColor
      };
      return style;
    },
    getBodyStyle() {
      const style = {
        borderBottom: this.border
      };
      return style;
    }
  },
  components: {
    TabItem
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scope>
@import "../assets/main.css";
@b tab {
  overflow: hidden;
  /* position: relative;*/
  @e wrapper {
    overflow: hidden;
    position: relative;
  }
  @e menu {
    position: absolute;
    top: -1px;
    right: 85px;
    display: block;
    height: 40px;
    width: 5px;
    z-index: 201;
  }
  @e menuButton {
    padding: 15px;
    border-radius: 0;
    width: 100px;
    &:hover {
      /* color: black; */
      border-color: #ccc;
      /* background-color: #ccc; */
    }
    &:focus {
      /* color: black; */
      border-color: #ccc;
      /* background-color: #ccc; */
    }
  }
  @e body {
    /* display: inline-block; */
    white-space: nowrap;
    float: left;
    height: 0;
    padding: 0 0 44px 0;
    line-height: 44px;
    z-index: 200;
  }
  @e rightSlot {
    position: absolute;
    top: 0;
    right: 2px;
    line-height: 42px;
    margin: 0 9px 0 0;
    z-index: 200;
  }
  @e leftSlot {
    width: 200px;
    height: 44px;
    float: left;
    margin: 5px 20px;
  }
}
.el-dropdown-menu.el-popper .popper__arrow {
  display: none;
}
</style>
