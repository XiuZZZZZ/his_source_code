const bus = {};
bus.install = function (Vue) {
  const eventBus = new Vue();
  Vue.prototype.$eventBus = eventBus;
};
export default bus;
