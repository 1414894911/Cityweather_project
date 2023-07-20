<template>
  <header class="shadow-header">
    <nav class="text-w flex items-center justify-center gap-4 text-w py-6">
      <a href="#" class="text-w">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-sun text-2xl"></i>
          <p class="text-2xl">新中地天气</p>
        </div>
      </a>
      <div class="flex gap-4 items-center">
        <h4 class="text-lg">{{ curIPweather.city }}</h4>
        <span class="text-sm"
          >实时天气：{{ curIPweather.weather }}
          {{ curIPweather.temperature }}℃</span
        >
        <span class="text-sm"
          >{{ curIPweather.winddirection }}风{{ curIPweather.windpower }}级
        </span>
      </div>
      <div class="app-info flex gap-3 flex-1 justify-end">
        <i
          class="fa-solid fa-circle-info text-xl hover:text-weather-secondary cursor-pointer duration-1000"
          @click="openMsgAbout"
        ></i>
        <transition name="fade">
          <div class="msg-about" v-if="isshow">
            <div class="p-4 bg-white self-start mt-32 max-w-screen-md">
              <h2>关于:</h2>
              <p class="text-xs mb-4">
                这个应用可以用来追踪你选择城市的当前天气
              </p>
              <h2>如何使用:</h2>
              <p class="text-xs mb-4">
                1.点击搜索框输入你希望追踪的城市<br />
                2.在搜索结果中选中一个城市，你将获取当地最新的天气<br />
                3.点击右侧的＋号可以将追踪城市的天气情况保存在首页
              </p>
              <h2>移除城市:</h2>
              <p class="text-xs">
                如果你不想在首页关注某个城市,可以通过底部的按钮删<br />除它
              </p>
              <button
                class="text-w mt-8 bg-weather-primary py-2 px-6 text-xs"
                @click="closeMsgAbout"
              >
                关闭
              </button>
            </div>
          </div>
        </transition>
      </div>
    </nav>
  </header>
</template>

<script>
import { querycitycode, queryLiveWeather } from "@/request/request.js";

export default {
  data() {
    return {
      curCityCode: "",
      curIPweather: {},
      isshow: false,
    };
  },
  mounted() {
    querycitycode().then((res) => {
      this.curCityCode = res.adcode;
      queryLiveWeather(this.curCityCode).then((res) => {
        this.curIPweather = res.lives[0];
      });
    });
  },
  methods: {
    closeMsgAbout() {
      this.isshow = false;
    },
    openMsgAbout() {
      this.isshow = true;
    },
  },
};
</script>

<style scoped lang="scss">
header {
  padding-left: 120px;
  height: 80px;
  background-color: rgb(0 102 138);
  z-index: 99;
  position: sticky;
  top: 0px;
  nav {
    width: 90%;
    h4 {
      font-size: 1.125rem;
      line-height: 1.75rem;
      font-weight: light;
    }
    .fa-circle-info {
      font-size: 1.25rem;
      line-height: 1.75rem;
    }
  }
  .msg-about {
    --tw-text-opacity: 1;
    color: rgb(0 0 0 / var(--tw-text-opacity));
    padding-left: 2rem;
    padding-right: 2rem;
    --tw-bg-opacity: 0.3;
    background-color: rgb(0 0 0 / var(--tw-bg-opacity));
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;
    z-index: 20;
    left: 0px;
    top: 0px;
    position: fixed;
    button {
      cursor: pointer;
      background-color: #00668a;
    }
    h2 {
      font-size: 16px;
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
