import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


/**
 * 路由异步加载
 */

 const recommend = ((resolve)=>{
   import('components/recommend/recommend').then((mod)=>{
     resolve(mod)
   })
 })

 const search = ((resolve)=>{
  import('components/search/search').then((mod)=>{
    resolve(mod)
  })
})

const rank = ((resolve)=>{
  import('components/rank/rank').then((mod)=>{
    resolve(mod)
  })
})

const singer = ((resolve)=>{
  import('components/singer/singer').then((mod)=>{
    resolve(mod)
  })
})

const singerDetail = ((resolve)=>{
  import('components/singerDetail/singerDetail').then((mod)=>{
    resolve(mod)
  })
})

const disc = ((resolve)=>{
  import('components/disc/disc').then((mod)=>{
    resolve(mod)
  })
})

const topList = ((resolve)=>{
  import('components/topList/topList').then((mod)=>{
    resolve(mod)
  })
})

const usercenter = ((resolve)=>{
  import('components/user-center/user-center').then((mod)=>{
    resolve(mod)
  })
})

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
        component:search,
        children:[
          {
            path:':id',
            component:singerDetail
          }
        ]
      },
      {
        path:'/user',
        component:usercenter
      }
  ]
})
