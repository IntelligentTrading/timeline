import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login";
import Home from "@/components/Home";
import Overview from "@/components/Overview";
import auth from "./auth";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
      beforeEnter: (to, from, next) => {
        return auth.isAuth() ? next() : next("/");
      }
    },
    {
      path: "/overview",
      name: "Overview",
      component: Overview,
      beforeEnter: (to, from, next) => {
        return auth.isAuth() ? next() : next("/");
      }
    }
  ]
});
