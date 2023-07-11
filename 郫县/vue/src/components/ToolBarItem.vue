<template>
  <li class="toolBarItem" @click="clickToolBarItem">
    <a class="toolBarItem__body" href="#">
      <p>
        <img class="toolBarItem__img" :src="img">
      </p>
      <p class="toolBarItem__text">
        <slot></slot>
      </p>
    </a>
  </li>
</template>
<script>
export default {
  name: "toolBarItem",
  props: ["img"],
  methods: {
    clickToolBarItem() {
      this.$emit("clickToolBarItem", this);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../assets/main.css";
@b toolBarItem {
  height: 62px;
  border-right: 1px solid #cccccc;
  padding: 0px 21px;
  &:last-child {
    border-right-width: 0px;
  }
  @e body {
    &:visited {
      color: #000;
    }
    @nest .toolBarItem:hover & {
      color: var(--mainColor);
    }
  }
  &:hover {
    background-color: #f7f7f7;
    color: var(--mainColor);
  }
  @e img {
    height: 28px;
    width: 28px;
    margin: 5px 0;
  }
  @e text {
    line-height: 24px;
    font-size: var(--mainFontSize);
    text-align: center;
  }
}
</style>
