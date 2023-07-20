import Vue from "vue";
import Vuex from "vuex";
// import { queryCastsWeather,querycitycode,queryLiveWeather } from "@/request/request.js";
Vue.use(Vuex);

export default new Vuex.Store({
  //存放初始状态
  state: {
    favorlists: [],
  },

  mutations: {},
  //处理异步的  actions本身是不能直接修改状态的,但是通过触发mutations来实现
  actions: {},
});
