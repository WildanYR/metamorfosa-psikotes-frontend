import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '../App.vue'
import Playground from '../views/Playground.vue'

import AuthRoute from './auth'
import AdminRoute from './admin'
import TesRoute from './tes'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: '',
    component: App,
    children: [AuthRoute, AdminRoute, TesRoute]
  },
  {
    path: '/playground',
    component: Playground
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
