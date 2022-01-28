import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _469c9208 = () => interopDefault(import('../pages/changes.vue' /* webpackChunkName: "pages/changes" */))
const _bb244446 = () => interopDefault(import('../pages/datatable.vue' /* webpackChunkName: "pages/datatable" */))
const _3326e87e = () => interopDefault(import('../pages/ip.vue' /* webpackChunkName: "pages/ip" */))
const _bb60563c = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _539ffafe = () => interopDefault(import('../pages/profiles.vue' /* webpackChunkName: "pages/profiles" */))
const _db793272 = () => interopDefault(import('../pages/table.vue' /* webpackChunkName: "pages/table" */))
const _768feeed = () => interopDefault(import('../pages/service/select.vue' /* webpackChunkName: "pages/service/select" */))
const _4eaf9c6a = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/changes",
    component: _469c9208,
    name: "changes"
  }, {
    path: "/datatable",
    component: _bb244446,
    name: "datatable"
  }, {
    path: "/ip",
    component: _3326e87e,
    name: "ip"
  }, {
    path: "/login",
    component: _bb60563c,
    name: "login"
  }, {
    path: "/profiles",
    component: _539ffafe,
    name: "profiles"
  }, {
    path: "/table",
    component: _db793272,
    name: "table"
  }, {
    path: "/service/select",
    component: _768feeed,
    name: "service-select"
  }, {
    path: "/",
    component: _4eaf9c6a,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
