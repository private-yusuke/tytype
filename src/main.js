// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './App'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueCodemirror)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
