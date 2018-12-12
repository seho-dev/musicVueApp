// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import imglazy from 'vue-lazyload'
import store from './store'
import 'common/stylus/index.styl'
import 'style/reset.css'
import 'mint-ui/lib/style.css'; 


Vue.config.productionTip = false
//图片懒加载处理
Vue.use(imglazy, {
  loading: require('common/image/default.png')
})

fastclick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
