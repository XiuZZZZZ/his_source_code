<template>
  <div class="commonInput" :style="{width:width}">
    <input class="commonInput__input" type="text" :style="{width:width}" :placeholder="placeholder">
    </input>
    <i class="commonInput__icon" v-if="iconClass" :class="iconClass" />
  </div>
</template>
<script>
export default {
  name: 'CommonInput',
  props: ['data', 'placeholder', 'width', 'iconClass'],
};
</script>
<style >
@import '../assets/main.css';
@b commonInput {
  position: relative;
  @e input {
    box-sizing: border-box;
    border: 1px solid var(--mainColor);
    height: 26px;
    padding: 5px 24px 5px 5px;
    outline: none;
    font-size: var(--mainFontSize);
  }
  @e icon {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 1px;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    display: inline-block;
    /*background-color: #378ec4;*/
    background-color: var(--mainColor);
    width: 24px;
    height: 26px;
    color: #ffffff;
    vertical-align: bottom;
    cursor: pointer;
  }
}
</style>
