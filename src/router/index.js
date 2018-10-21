import Vue from 'vue'
import Router from 'vue-router'
import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import search from 'components/search/search'
import singer from 'components/singer/singer'
Vue.use(Router)

export default new Router({
  routes: [
      {
          path: '/',
          redirect: '/recommend'
      },
      {
        path:'/rank',
        component:rank
      },{
        path:'/recommend',
        component:recommend
      },{
        path:'/singer',
        component:singer
      },{
        path:'/search',
        component:search
      }
  ]
})
