//具体请求方法
import request from "./axios.js";
//返回实况天气
export const queryLiveWeather = (citycode) => {
  return request.get(
    `/weather/weatherInfo?key=430a5036a13930cc070401eab503f7b7&city=${citycode}&extensions=base`
  );
};
// 返回预报天气
export const queryCastsWeather = (citycode) => {
  return request.get(
    `/weather/weatherInfo?key=430a5036a13930cc070401eab503f7b7&city=${citycode}&extensions=all`
  );
};

//通过ip获取到城市编码
export const querycitycode = () => {
  return request.get(`/ip?key=430a5036a13930cc070401eab503f7b7`);
};

// 通过城市名字返回城市编码
export const queryCode = (cityname) => {
  return request.get(
    `config/district?keywords=${cityname}&key=430a5036a13930cc070401eab503f7b7`
  );
};
