// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index'
import VueApexCharts from 'vue-apexcharts'
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)
Vue.use(VueApexCharts)
Vue.component("apexchart", VueApexCharts);
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

global.vm = vm