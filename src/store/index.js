import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './action'
import * as getters from './getter'
import state from './state'
import mutations from './mutations'
//引入vuex的报告
import creatLogger from 'vuex/dist/logger'

Vue.use(Vuex);
//创建debug，在开发环境下，因为如果在线上环境，会消耗资源，所以是在开发环境下
const debug=process.env.NODE_ENV !== 'production'

//引入
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict:debug,
    plugins: debug ? [creatLogger()] : []
})


