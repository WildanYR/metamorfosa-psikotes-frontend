import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './index.css'
import 'vue-select/dist/vue-select.css'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
