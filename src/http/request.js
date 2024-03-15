import axios from 'axios'
import store from "@/store/store";
import {Message} from "element-ui";

const serverUrl = "https://www.aixlab.cn"   // 生产环境
const testUrl = "https://test.aixlab.cn"    // 测试环境
const localUrl = "http://localhost"         // 本地开发环境

const request = axios.create({
//    baseURL: serverUrl
//    baseURL: testUrl
//    baseURL: localUrl
    baseURL: ''
})

request.pageSize = 15;

request.interceptors.request.use((config) => {
    console.log("token:", store.getters.token)
    config.headers.Authorization = store.getters.token
    return config
}, (error => {
    return Promise.reject(error);
}));

request.interceptors.response.use((response => {
    if (response.status === 200) {
        console.log("访问成功")
        console.log(response.request.responseURL,response)
        let data = response.data;
        if (data.state === 403) {
            window.location.href = '/#/login';
            Message.error('登陆后访问');
            store.commit("saveToken",'')
            return Promise.reject(response);
        }
        return Promise.resolve(response.data);
    } else {
        return Promise.reject(response);
    }
}), (error => {
    console.log('error',error)
    Message.error('若有问题联系管理员');
    return Promise.reject(error);
}));

export default request;