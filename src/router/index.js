import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import SignalLine from '@/components/SignalLine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/timeline',
      name: 'SignalLine',
      component: SignalLine
    }
  ]
})
