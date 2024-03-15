import Vue from 'vue'
import App from './App.vue'
import store from "@/store/store";
import ElementUI from 'element-ui';
import uploader from 'vue-simple-uploader'
import 'element-ui/lib/theme-chalk/index.css';
import router from "@/router/route";
Vue.use(ElementUI)
Vue.use(uploader)

Vue.config.productionTip = false

import { Message } from 'element-ui';
//定义一个新的Message方法，多传入一个offset参数
const $message = options => {
  return Message({
    ...options,
    offset: 300,
    duration:1000
  });
};

//重写一遍success的方法,将offset写入options
['success', 'warning', 'info', 'error'].forEach(type => {
  $message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        offset: 300,
        duration:1000
      };
    }
    options.type = type;
    return Message(options);
  };
});
//将$message挂载到this上
Vue.prototype.$message = $message;

Vue.prototype.$alertDialog = function alertDialog(message){
  return this.$confirm(message, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  });
}

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
