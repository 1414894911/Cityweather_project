//对axios进行简单的封装
import axios from "axios";
const request = axios.create({
  baseURL: "https://restapi.amap.com/v3",
  timeout: 5000,
});
request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default request;
