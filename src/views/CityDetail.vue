<template>
  <div>
    <header class="shadow-header">
      <nav class="text-w flex items-center justify-center gap-4 text-w py-6">
        <a href="#" class="text-w" @click="toHome">
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
          ><span class="text-sm"
            >{{ curIPweather.winddirection }}风{{
              curIPweather.windpower
            }}级</span
          >
        </div>
        <div class="app-info flex gap-3 flex-1 justify-end">
          <i
            class="fa-solid fa-circle-info text-xl hover:text-weather-secondary cursor-pointer duration-1000"
            @click="openMsgAbout"
          ></i>
          <i
            class="fa-solid fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer items-center"
            @click="addCity"
            v-if="isappear"
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
    <div class="container bg-base text-w">
      <div class="flex justify-center bg-weather-content tip-msg">
        <template v-if="isadded">
          你正在预览{{
            chooseCity
          }}的天气信息，可以通过右上角的"+"号按钮保存起来
        </template>
        <template v-else>你正在预览{{ chooseCity }}的天气信息</template>
      </div>
      <div class="liveweather container flex flex-col text-center mt-6 gap-4">
        <p>当日气温是: {{ curcityLive.temperature }}摄氏度</p>
        <p>当日天气是: {{ curcityLive.weather }}</p>
        <p>当日风向是: {{ curcityLive.winddirection }}风</p>
        <p>当日风力是：{{ curcityLive.windpower }}级</p>
      </div>
      <div class="weather-content text-w bg-weather-content castmsg rounded">
        <div class="weather-msg flex gap-6">
          <div class="flex flex-col flex-1 text-center gap-4">
            <span>今天</span>
            <span>{{ curdate }}</span>
            <span>{{ curDayWeather.dayweather }}</span>
            <span>风力{{ curDayWeather.nightpower }}级</span>
          </div>
          <div class="flex flex-col flex-1 text-center gap-4">
            <span>明天</span>
            <span>{{ Day2date }}</span>
            <span>{{ Day2Weather.dayweather }}</span>
            <span>风力{{ Day2Weather.nightpower }}级</span>
          </div>
          <div class="flex flex-col flex-1 text-center gap-4">
            <span>周{{ Day3Weather.week }}</span>
            <span>{{ Day3date }}</span>
            <span>{{ Day3Weather.dayweather }}</span>
            <span>风力{{ Day3Weather.nightpower }}级</span>
          </div>
          <div class="flex flex-col flex-1 text-center gap-4">
            <span>周{{ Day4Weather.week }}</span>
            <span>{{ Day4date }}</span>
            <span>{{ Day4Weather.dayweather }}</span>
            <span>风力{{ Day4Weather.nightpower }}级</span>
          </div>
        </div>
        <div class="weather-canvas">
          <v-chart class="weather-canvas" :option="option"></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryCode,
  queryLiveWeather,
  queryCastsWeather,
  querycitycode,
} from "@/request/request.js";
export default {
  data() {
    return {
      option: {},
      curCityCode: "",
      chooseCitycode: "",
      curcityLive: {},
      curDayWeather: {},
      Day2Weather: {},
      Day3Weather: {},
      Day4Weather: {},
      curdate: "",
      Day2date: "",
      Day3date: "",
      Day4date: "",
      dialogVisible: false,
      curIPweather: {},
      isshow: false,
      isappear: true,
      chooseCity: "",
      isadded: true,
    };
  },
  props: ["city"],
  mounted() {
    // 加载页面前 ,先置为显示状态
    this.isappear = true;
    // 从本地存储中获取已有的数据
    const storedData = JSON.parse(localStorage.getItem("cityData")) || [];
    console.log(storedData, 666);
    // 检查是否已存在相同的城市数据
    const existingCity = storedData.find((item) => item.city === this.city);
    console.log(existingCity, 666666666666);
    if (existingCity) {
      this.isappear = false; //不显示添加按钮
      this.isadded = false; //不显示提示信息
    }

    queryCode(this.city).then((res) => {
      this.chooseCitycode = res.districts[0].adcode;
      this.chooseCity = res.districts[0].name;
      queryLiveWeather(this.chooseCitycode).then((res) => {
        this.curcityLive = res.lives[0];
        // console.log(this.curcityLive, 6666666);
        //如果请求城市的没有返回温度,判断为没有该城市 , 就弹窗返回
        if (!this.curcityLive.temperature) {
          alert("没有该城市,请重新查询!");
          this.$router.push({
            name: "home",
          });
        }
      });
      queryCastsWeather(this.chooseCitycode).then((res) => {
        let daytemps = [];
        let nighttemps = [];
        console.log(this.chooseCitycode);
        // console.log(res.forecasts[0].casts, 666);
        res.forecasts[0].casts.forEach((item) => {
          daytemps.push(+item.daytemp);
          nighttemps.push(+item.nighttemp);
        });
        // console.log(daytemps, nighttemps);
        this.initOption(daytemps, nighttemps);
        this.curDayWeather = res.forecasts[0].casts[0];
        this.Day2Weather = res.forecasts[0].casts[1];
        this.Day3Weather = res.forecasts[0].casts[2];
        this.Day4Weather = res.forecasts[0].casts[3];
        // console.log(res.forecasts[0].casts, 6666666666);
        const weekMap = {
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六",
          7: "日",
        };

        res.forecasts[0].casts.forEach((item) => {
          const weekNumber = item.week;
          if (weekMap[weekNumber]) {
            item.week = weekMap[weekNumber];
          }
        });
      });
    });
    //通过ip返回城市编码
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
    toHome() {
      this.$router.push({
        name: "home",
      });
    },
    addCity() {
      console.log("添加" + this.city + this.chooseCitycode);
      // 从本地存储中获取已有的数据
      const storedData = JSON.parse(localStorage.getItem("cityData")) || [];
      // 创建新的城市对象
      const newCity = {
        city: this.city,
        cityCode: this.chooseCitycode,
      };
      this.isappear = false;
      this.$notify({
        title: "成功",
        message: "收藏好了 !",
        type: "success",
      });

      // 将新城市对象添加到存储数组中
      storedData.push(newCity);
      // 将更新后的存储数组重新存储到本地存储中
      localStorage.setItem("cityData", JSON.stringify(storedData));
    },
    initOption(data1, data2) {
      // console.log(data1, data2);
      this.option = {
        grid: {
          left: "0%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          show: false,
          boundaryGap: 30,
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            type: "line",
            data: data2,
            smooth: true,
            stack: "Total",
            label: {
              color: "white", // 标签文本颜色
              fontSize: 15, // 标签文本字体大小
              fontWeight: "light",
              show: true,
              position: "top",
              formatter: "晚{c}℃", // 显示数据值
            },
          },
          {
            type: "line",
            data: data1,
            smooth: true,
            stack: "Total",
            label: {
              color: "white", // 标签文本颜色
              fontSize: 15, // 标签文本字体大小
              fontWeight: "light",
              show: true,
              position: "top",
              formatter: "白{c}℃", // 显示数据值
            },
          },
        ],
      };
    },
  },
  watch: {
    curDayWeather(newvalue) {
      this.curdate = newvalue.date.slice(5);
      // console.log(this.curdate);
    },
    Day2Weather(newval) {
      this.Day2date = newval.date.slice(5);
      // console.log(this.Day2date);
    },
    Day3Weather(newval) {
      this.Day3date = newval.date.slice(5);
      // console.log(this.Day3date);
    },
    Day4Weather(newval) {
      this.Day4date = newval.date.slice(5);
      // console.log(this.Day4date);
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
}
.container {
  .weather-content {
    margin-top: 15px;
  }
  .tip-msg {
    padding: 0.5rem;
  }
  .liveweather {
    padding-bottom: 30px;
    border-bottom: 0.5px solid rgba(169, 169, 169, 0.5);
  }
  .castmsg {
    margin: 30px auto;
    width: 80%;
    padding: 50px 80px;
  }
  .weather-canvas {
    margin-top: 30px;
    width: 1100px;
    height: 160px;
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























const addList = (e) => {
  if (input.value === '') {
    ElMessage({
      message: '请输入有效内容!',
      type: 'warning',
    })
    return
  }
  input.value = ''
  const isDuplicate = allLists.value.some(item => {
    if (item.thing === e) {
      ElMessage({
        message: '数据重复!',
        type: 'warning',
      })
      return true
    }
  })
  if (!isDuplicate) {
    allLists.value.push({ id: new Date().getTime(), isDone: false, thing: e })
    storedData[0] = allLists.value;
    storedData[1] = allDoneLists.value;
    localStorage.setItem("list", JSON.stringify(storedData));
  }
}









