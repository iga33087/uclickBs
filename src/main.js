import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-TW'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/css/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import api from './assets/js/api.js'
import $global from './assets/js/global.js'
 
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(ElementUI, { locale });
Vue.use(new VueSocketIO({
  debug: true,
  autoConnect: false,
  connection: 'https://resumeback.herokuapp.com',  //http://localhost:3000,https://resumeback.herokuapp.com
  vuex: {
    store,
  }
}))

Vue.prototype.$global=$global 
Vue.prototype.$api=api
Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  if(to.path!="/login"&&!localStorage.token) {
    next({path:"/login"})
  }
  else {
    document.title=to.meta.title
    if(!store.state.userInfo) {
      let userInfo=await api.getUserInfoByToken()
      store.dispatch('userInfo',userInfo.data)
      console.log(userInfo)
    }
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
