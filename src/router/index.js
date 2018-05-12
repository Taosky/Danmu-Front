import Vue from 'vue'
import Router from 'vue-router'
import Danmu from '../components/Danmu.vue'
import About from '../components/About.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/danmu'
    },
    {
      path: '/danmu',
      name: 'Danmu',
      component: Danmu
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
