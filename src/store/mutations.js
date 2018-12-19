import * as types from './mutations-type'

const mutations ={
    //通过type来获取常量，
    [types.SET_SINGER](state,singer){
        //给仓库中的singer对象附对象（组件中的singer对象给仓库存储起来）
        state.singer=singer
    },
    [types.SET_PLAYING](state,flag){
        state.playing = flag
    },
    [types.SET_FULLSCREEN](state,flag){
        state.fullScreen = flag
    },
    [types.SET_PLAYLIST](state,list){
        state.playList=list
    },
    [types.SET_SEQUENCE_LIST](state,list){
        state.sequenceList=list
    },
    [types.SET_MODE](state,mode){
        state.mode = mode
    },
    [types.SET_CURREN_INDEX](state,index){
        state.currenIndex = index
    },
    [types.SET_DISC](state,disc){
        state.disc = disc
    },
    [types.SET_TOP_LIST](state,topList){
        state.topList = topList
    },
    [types.SET_SEARCH_HISTORY](state,history){
        state.searchHistory = history
    }
}

export default mutations;