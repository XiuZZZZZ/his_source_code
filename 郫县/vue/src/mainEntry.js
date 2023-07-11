import "babel-polyfill";
import Vue from "vue";
import ELEMENT from "element-ui";
import axios from "axios";
import eventBus from "./eventBus";
import mainStore from "./store/mainStore";
import { getComponent, getConfigViewName } from "./config/components";
import "./assets/reset.css";
import "./assets/common.css";
import "./assets/font-awesome-4.7.0/css/font-awesome.min.css";
import { getSession, initSession } from "./store/api/session";
/* eslint-disable no-new */
(function () {
  const init = function (entryName) {
    Vue.use(eventBus);
    Vue.use(ELEMENT);
    /* global window */
    window.axios = window.axios || axios;
    const componentName =
      entryName !== undefined ? entryName : getConfigViewName();
    const viewName = `${componentName}View`;
    try {
      Vue.component(viewName, getComponent(componentName));
    } catch (e) {
      Vue.$message.error(e.message);
    }
    const template = `<${viewName}/>`;
    // Vue.directive('print', {
    //   bind(el, binding, node) {
    //     console.log('bind');
    //     console.log(el);
    //     console.log(binding);
    //     console.log(node);
    //   },
    //   inserted() {
    //     console.log('inserted');l
    //   update() {
    //     console.log('update');
    //   },
    //   componentUpdated() {
    //     console.log('componentUpdated');
    //   },
    //   unbind() {
    //     console.log('unbind');
    //   },
    // });
    new Vue({
      el: "#app",
      store: mainStore,
      template
      // components,
    });
  };
  if (Vue.config.devtools) {
    getSession().then(() => {
      // init('TemperatureMeasureMutiply');  // 成人体温单多人录入界面
      init("TemperatureMeasureSingle"); // 成人体温单单人人录入界面
      // init('TemperatureBabyMeasureMutiply');  // 婴儿体温单多人录入界面
      // init('TemperatureBabyMeasureSingle');   // 婴儿体温单单人人录入界面
      // init("BedChart"); // 床位图
      // init("OrderExcute"); // 护士执行
      // init('TemperatureMeasureRuleConfig');  // 需测体温维护规则
      // init('Delivery');  // 分娩
      // init('AppointPatOrderExcute');  // 预约患者院前医嘱执行
      // init('PatInfo');
    });
  } else {
    initSession();
    init();
  }
})();
