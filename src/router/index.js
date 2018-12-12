import Vue from 'vue'
import Router from 'vue-router'
import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import search from 'components/search/search'
import singer from 'components/singer/singer'
import singerDetail from 'components/singerDetail/singerDetail'
import disc from 'components/disc/disc'
import topList from 'components/topList/topList'
Vue.use(Router)

export default new Router({
  routes: [
      {
          path: '/',
          redirect: '/recommend'
      },
      {
        path:'/rank',
        component:rank,
        children:[
          {
            path:':id',
            component:topList
          }
        ]
      },{
        path:'/recommend',
        component:recommend,
        children:[{
          path:':id',
          component:disc
        }]
      },{
        path:'/singer',
        component:singer,
        children:[
          {
            path:':id',
            component:singerDetail
          }
        ]
      },{
        path:'/search',
        component:search
      }
  ]
})
