import 'babel-polyfill'
import 'common/js/hack'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

import {
  Style,
  IndexList,
  Scroll,
  Slide,
  createAPI
} from 'cube-ui'

import Confirm from 'base/confirm/confirm.vue'

Vue.use(IndexList)
Vue.use(Scroll)
Vue.use(Slide)

createAPI(Vue, Confirm, ['confirm', 'click'], true)

import 'common/stylus/index.styl'

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
