import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./main.css";
//引入v-chart
import vcharts from "vue-echarts";
Vue.component("VChart", vcharts); //注册一个全局组件 组件名称 v-chart
import * as echarts from "echarts"; //引入echarts
Vue.prototype.$echarts = echarts; //如果希望在所有的组件身上使用echarts
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
