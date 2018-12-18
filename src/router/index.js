import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Overview from '@/components/Overview'
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
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/overview/:symbol',
      name: 'Overview',
      component: Overview,
      props: true
    },
    {
      path: '/timeline',
      name: 'SignalLine',
      component: SignalLine
    }
  ]
})
