import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookie from 'js-cookie'
import Favico from 'favico.js'
import App from './App'
import router from 'router'
import emitter from 'common/emitter'
// import {HOSTS} from 'config'
import 'assets/icons/iconfont.js'

Vue.config.productionTip = false
Vue.use(ElementUI)

const getLoginUrl = () => {
  return '/'
  // const ENV = process.env.ENV
  // if (ENV !== 'production') {
  //   return `${HOSTS.LOGIN}/login?system_id=discovery&return_url=${encodeURIComponent(window.location.href)}`
  // } else {
  //   return `${HOSTS.LOGIN}/login?system_id=discovery&safe_login=true&return_url=${encodeURIComponent(window.location.href)}`
  // }
}

const redirect = query => {
  if (router.currentRoute && router.currentRoute.name === 'RedirectPortal') {
    return
  }
  router.push({
    name: 'RedirectPortal',
    query: {
      redirect: getLoginUrl(),
      ...query
    }
  })
}

const redirectLogin = () => {
  window.location.href = getLoginUrl()
}

window._emitter = emitter
emitter.on('FAIL', () => {})
emitter.on('NO_LOGIN', () => {
  if (router.currentRoute.meta.auth) {
    redirectLogin()
  }
})
emitter.on('DISABLE', () => redirect({
  title: 'Account disabled',
  subTitle: 'Please contact to your administrator'
}))
emitter.on('EXPIRE', () => redirect({
  title: 'Login expired',
  subTitle: 'Please login again'
}))
emitter.on('NO_PRIVILEGE', () => redirect({
  title: 'No privilege',
  subTitle: 'You do not have privilege to access XCompass'
}))

router.beforeEach((to, from, next) => {
  let {
    title,
    auth
  } = to.meta

  if (auth && !Cookie('token')) {
    redirectLogin()
    return
  }
  if (typeof title === 'function') {
    title = title(to)
  }
  document.title = title || 'XCompass'
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    supervisor: {},
    ip: '',
    user: {}
  }
})

const {
  ENV,
  NODE_ENV
} = process.env

let favicoOptions
if (NODE_ENV !== 'production') {
  favicoOptions = {
    animation: 'none',
    // position: 'up',
    // type: 'rectangle',
    // bgColor: '#5CB85C',
    // textColor: '#ff0',
    badge: ' \u25B6'
  }
} else if (ENV === 'beta') {
  favicoOptions = {
    animation: 'none',
    // position: 'up',
    type: 'rectangle',
    // bgColor: '#5CB85C',
    // textColor: '#ff0',
    badge: 'dev'
  }
}

if (favicoOptions) {
  let favicon = new Favico(favicoOptions)
  // favicon.badge(ENV || '\f0a2')
  favicon.badge(favicoOptions.badge)
}
