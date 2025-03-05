import axios from "axios";
import { message } from "antd";
const Axios = axios.create({
  timeout: 20000,
  headers: {
    Authorization: localStorage.getItem("auth") || "",
  },
});

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code === 200) {
        return response;
      } else if (response.data.code === 401) {
        message.info(response.data.msg || "请登录");
        return Promise.reject(response);
      } else {
        message.warning(response.data.msg || "请求失败");
        return Promise.reject(response);
      }
    } else {
      message.error(response.data.msg || "请求失败");
      return Promise.reject(response);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Axios;
