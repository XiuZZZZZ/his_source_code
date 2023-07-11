
<template>
  <ul class="toolBar">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'toolBar',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../assets/main.css';
@b toolBar {
  padding: 4px 0 5px 0;
  & li {
    display: inline-block;
  }
}
</style>
