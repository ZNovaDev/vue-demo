import axios, { type AxiosInstance } from 'axios'

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,              // 配合 vite proxy
  timeout: 10000
})


// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = 'Bearer ' + localStorage.getItem('token')

  if (token) config.headers!.Authorization = token

  // 设置请求头
  // if (!config.headers["content-type"]) { // 如果没有设置请求头
  //   if (config.method === 'post') {
  //     config.headers["content-type"] = "application/x-www-form-urlencoded"; // post 请求
  //     config.data = JSON.stringify(config.data); // 序列化,比如表单数据
  //   } else {
  //     config.headers["content-type"] = "application/json"; // 默认类型
  //   }
  // }
  // console.log("请求配置", config);
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {

  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // console.log("响应", response);
  return response.data;
}, function (error) : Promise<any> {

  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // console.error("响应错误", error.response?.data);

  return Promise.reject(error);
});
