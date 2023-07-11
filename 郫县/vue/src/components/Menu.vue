<template>
  <transition name="fade">
    <div class="menu" v-if="show" :style="getStyle">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
export default {
  name: "Menu",
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    show(value) {
      if (value) {
        document.onclick = () => {
          this.$emit("blur");
        };
      } else {
        document.onclick = null;
      }
    }
  },
  computed: {
    getStyle() {
      const left = this.x;
      let top = this.y;
      const bodyHeight = document.body.clientHeight - 160;
      if (top > bodyHeight) {
        top = bodyHeight;
      }
      return {
        left: `${left}px`,
        top: `${top}px`
      };
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
@b menu {
  position: fixed;
  border: 1px solid #d1dbe5;
  border-radius: 2px;
  background: #fff;
  min-width: 100px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  z-index: 1000;
}
</style>
