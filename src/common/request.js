import axios from "axios";
export function request(config) {

    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8000/api/', // 通过/api别名指定后端路由
        timeout: 5000,
        headers: {},
    })
    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

// 添加响应拦截器
    instance.interceptors.response.use(function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        return response;
    }, function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        if(error.response){
            if(error.response==500){
                alert('服务器发生错误')
            }
        }
        return Promise.reject(error);
    });

    //发送一个真正的请求
    return instance(config)
}