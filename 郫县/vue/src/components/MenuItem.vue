<template>
  <span class="menuItem" @click="onClick">
    {{text}}
  </span>
</template>
<script>
export default {
  name: 'MenuItem',
  props: ['text'],
  methods: {
    onClick() {
      this.$emit('click', this.text);
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import '../assets/main.css';
@b menuItem {
  display: block;
  padding: 5px 0 5px 10px;
  color: #5e5e5e;
  font-size: var(--mainFontSize);
  &:hover {
    background-color: #21ba45;
    color: #fff;
  }
}
</style>
