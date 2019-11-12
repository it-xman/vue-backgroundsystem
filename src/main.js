import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'

import '@/assets/css/global.css'
import axios from 'axios'
import '@/assets/iconfont/iconfont.css'

Vue.use(ElementUI)
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
