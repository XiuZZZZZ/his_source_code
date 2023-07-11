/**
 * @description 封装组件相关配置及获取 菜单配置的组件名字的方法
 */
import mainStore from '../store/mainStore';

export const getComponent = function(componentName) {
  const viewName = `${componentName}View`;
  return function(resolve) {
    const pormiseComponent = import(`../views/${componentName}`);
    const pormiseStore = import(`../store/modules/${componentName}Store`);
    pormiseStore
      .then(store => {
        mainStore.registerModule(viewName, store.default);
        pormiseComponent.then(modules => {
          resolve(modules);
        });
      })
      .catch(() => {
        pormiseComponent.then(modules => {
          resolve(modules);
        });
      });
  };
};
// export default components = {
//   BedChartView(resolve) {
//     require.ensure([], (require) => {
//       const module = require('../store/modules/BedChart");
//       mainStore.registerModule('BedChartView', module.default);
//       resolve(require("../views/BedChart"));
//     }, 'BedChartView');
//   }
// };
export const getConfigViewName = function() {
  /*  global session:true */
  return session.ViewName;
};
