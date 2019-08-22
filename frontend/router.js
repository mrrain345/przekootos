import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/ranking/:time?',
      name: 'ranking',
      component: () => import(/* webpackChunkName: "ranking" */ './views/Ranking.vue'),
      beforeEnter: (to, from, next) => {
        if (!to.params.time) return next('/ranking/day');
        if (['day', 'week', 'month', 'year', 'all'].includes(to.params.time)) {
          return next();
        }
        return next(`/not-found?u=${encodeURIComponent(to.path)}`);
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
    },
    {
      path: '/login/github',
      name: 'github',
      component: () => import(/* webpackChunkName: "github" */ './views/GitHub.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import(/* webpackChunkName: "logout" */ './views/Logout.vue'),
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import(/* webpackChunkName: "not-found" */ './views/NotFound.vue'),
    },
    {
      path: '*',
      component: () => import(/* webpackChunkName: "not-found" */ './views/NotFound.vue'),
      beforeEnter: (to, from, next) => {
        next(`/not-found?u=${encodeURIComponent(to.path)}`);
      },
    },
  ],
});
