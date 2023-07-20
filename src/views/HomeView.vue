<template>
  <div>
    <!-- 头部组件 -->
    <HeaderView />
    <router-view />
    <main text-w>
      <div class="serach">
        <input
          type="text"
          placeholder="请输入城市信息"
          class="text-w focus:border-weather-secondary focus:outline-none focus:shadow-md"
          @keyup.enter="ToDetail"
          v-model="inputcity"
        />
        <div v-if="searchResult" class="result" @click="ToDetail">
          {{ searchResult }}
        </div>
      </div>
      <div v-if="favorlists.length" class="listbox">
        <div
          class="text-w bg-weather-secondary flex justify-between cursor-pointer duration-300 favorlist"
          v-for="item in favorlists"
          :key="item.cityCode"
        >
          <h3>{{ item.city }}</h3>
          <span>{{ item.livetemp }}度</span>
          <div class="flex mb-4 gap-2 view-btn">
            <button class="bg-yellow-500 text-center" @click="check(item.city)">
              查看
            </button>
            <button class="bg-yellow-500 text-center" @click="dele(item.city)">
              删除
            </button>
          </div>
        </div>
      </div>
      <h2 class="text-w" v-else>
        暂时没有保存过城市天气信息，请查询后点击右上角"+"号保存。
      </h2>
      <p class="text-w title-msg">近期天气</p>
      <div class="weather-content text-w bg-weather-content">
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
    </main>
  </div>
</template>

<script>
import {
  queryCastsWeather,
  querycitycode,
  queryLiveWeather,
} from "@/request/request.js";
import HeaderView from "@/components/HeaderView.vue";
import axios from "axios";
export default {
  components: { HeaderView },
  data() {
    return {
      searchResult: "",
      option: {},
      favorlists: [],
      castLists: [],
      curDayWeather: {},
      Day2Weather: {},
      Day3Weather: {},
      Day4Weather: {},
      curdate: "",
      Day2date: "",
      Day3date: "",
      Day4date: "",
      curCityCode: "",
      inputcity: "",
      searchcity: "",
    };
  },
  watch: {
    inputcity(newVal) {
      console.log(123);
      console.log(this.searchResult);
      clearTimeout(this.timer); // 清除之前的定时器
      this.timer = setTimeout(() => {
        this.fetchCityName(newVal);
      }, 500); // 等待500ms后触发请求
    },
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
  mounted() {
    querycitycode().then((res) => {
      this.curCityCode = res.adcode;

      queryCastsWeather(this.curCityCode).then((res) => {
        let daytemps = [];
        let nighttemps = [];
        // console.log(res.forecasts[0]);
        res.forecasts[0].casts.forEach((item) => {
          daytemps.push(+item.daytemp);
          nighttemps.push(+item.nighttemp);
        });
        this.initOption(daytemps, nighttemps);
        this.curDayWeather = res.forecasts[0].casts[0];
        this.Day2Weather = res.forecasts[0].casts[1];
        this.Day3Weather = res.forecasts[0].casts[2];
        this.Day4Weather = res.forecasts[0].casts[3];
        // 将数字转化成对应星期
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
    //本地存储数据访问
    const storedData = JSON.parse(localStorage.getItem("cityData"));
    if (storedData) {
      // 在这里可以使用存储的数据进行相应的操作
      this.favorlists = storedData;
      const promises = this.favorlists.map((item) => {
        return queryLiveWeather(item.cityCode).then((res) => {
          // 将 livetemp 添加到每个 item 对象中
          item.livetemp = res.lives[0].temperature;
          // console.log(item.livetemp);
        });
      });
      // 等待所有异步请求完成,不然添加不进去
      Promise.all(promises).then(() => {
        // 所有异步请求完成后的后续操作
        // console.log(this.favorlists);
      });
    }
  },
  methods: {
    ToDetail() {
      this.$router.push({
        name: "CityDetail",
        params: { city: this.searchcity, favorlists: this.favorlists },
      });
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
    check(city) {
      this.$router.push({
        name: "CityDetail",
        params: { city: city },
      });
    },
    dele(city) {
      // 找到对应的数据项索引
      const index = this.favorlists.findIndex((item) => item.city === city);

      // 如果找到了对应的数据项索引，则进行删除
      if (index !== -1) {
        this.favorlists.splice(index, 1);
      }
      // 更新 LocalStorage 中的数据
      localStorage.setItem("cityData", JSON.stringify(this.favorlists));
      console.log(city);
    },
    fetchCityName(newVal) {
      axios
        .get(
          `https://restapi.amap.com/v3/config/district?keywords=${newVal}&key=430a5036a13930cc070401eab503f7b7`
        )
        .then((response) => {
          const data = response.data;
          console.log(data);
          if (
            data.status === "1" &&
            data.count !== "0" &&
            data.districts[0].adcode
          ) {
            const cityName = data.districts[0].name;
            this.searchcity = data.districts[0].name;
            // 请求成功，更新请求结果
            this.searchResult = cityName;
          } else {
            // 请求失败或未找到城市，更新请求结果为未找到城市的文本
            this.searchResult = "似乎没有找到你查找的城市";
          }
        })
        .catch((error) => {
          // 请求失败，更新请求结果为未找到城市的文本
          this.searchResult = "似乎没有找到你查找的城市";
          console.error(error);
        });
    },
  },
};
</script>

<style scoped lang="scss">
main {
  width: 1536px;
  margin: 20px auto;
  margin-right: auto;
  margin-left: auto;
  padding-right: 10rem;
  padding-left: 10rem;
  .serach {
    padding-top: 1rem;
    margin-bottom: 2rem;
  }
  .result {
    width: 100%;
    height: 50px;
    background-color: #004e71;
    color: #fff;
    margin-top: 15px;
    line-height: 50px;
    padding-left: 10px;
    cursor: pointer;
    border-radius: 5px;
  }
  input {
    width: 100%;
    background-color: transparent;
    border-bottom-width: 1px;
    padding: 8px 4px;
    outline: none;
    font-size: 100%;
    border-bottom: 1px solid white;
    text-indent: 0px;
    text-shadow: none;
    text-align: start;
  }
  input::placeholder {
    color: #9c969c;
  }

  .favorlist {
    position: relative;
    padding: 8px 16px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 1s;
  }
  .favorlist:hover {
    width: 80%;
    margin-right: 300px;
  }
  .view-btn {
    position: absolute;
    top: 50%;
    transform: translate(160%, -50%);
    right: 0;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 1s;
    button {
      padding: 10px 15px;
      cursor: pointer;
      margin-left: 10px;
      color: white;
      font-size: 16px;
    }
  }

  .favorlist:hover .view-btn {
    opacity: 1;
  }
  h2 {
    transition-duration: 0.5s;
    text-align: center;
    font-size: 16px;
    font-weight: normal;
  }
  .title-msg {
    margin-top: 1.5rem;
  }
  .weather-content {
    padding-top: 2.5rem;
    padding-left: 3rem;
    padding-right: 3rem;
    border-radius: 0.25rem;
    margin-top: 0.5rem;
  }
  .weather-msg {
    margin-bottom: 20px;
  }
  .weather-canvas {
    width: 1100px;
    height: 260px;
  }
}
</style>
