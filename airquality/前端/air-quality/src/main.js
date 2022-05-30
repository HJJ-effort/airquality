import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import * as echarts from 'echarts'
import 'echarts-gl'
Vue.prototype.$echarts = echarts


import './plugins/element.js'

import './assets/css/global.css'

import './assets/font/iconfont.css'

import axios from 'axios'
Vue.prototype.$axios = axios;


// 配置请求根路径
axios.defaults.baseURL = 'http://localhost:8888/'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')