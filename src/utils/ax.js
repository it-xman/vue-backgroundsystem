import Vue from 'vue'
import axios from 'axios'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.interceptors.request.use((config) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, (error) => {
  return Promise.reject(error)
}

)
Vue.prototype.$http = axios
