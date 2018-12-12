/**
 * 批量修改动作
 */

import * as type from './mutations-type'
import { shuffle } from 'common/js/util'
import { model } from 'common/js/config'


//寻找索引下标
function getArrIndex(arr, song) {
    return arr.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectSong = function ({ commit, state }, { list, index }) {
    //修改顺序列表
    commit(type.SET_SEQUENCE_LIST, list)
    //判断当前顺序如果是随机播放，就让它先播放点击的歌
    if (state.SET_MODE === model.random) {
        //重新洗牌
        list = shuffle(list);
        //寻找点击的那首歌在打乱之后的索引
        index = getArrIndex(randomList, list[index])
    } else {
        //修改播放列表
        commit(type.SET_PLAYLIST, list)
    }
    commit(type.SET_PLAYLIST, list);
    //修改当前索引
    commit(type.SET_CURREN_INDEX, index)
    //修改全屏状态
    commit(type.SET_FULLSCREEN, true)
    //修改播放状态
    commit(type.SET_PLAYING, true)
}

//随机播放
export const randomSong = function ({ commit }, { list }) {
    commit(type.SET_MODE, model.random)
    commit(type.SET_SEQUENCE_LIST, list)
    //打乱数组
    let randomList = shuffle(list);
    commit(type.SET_PLAYLIST, randomList);
    //修改当前索引
    commit(type.SET_CURREN_INDEX, 0)
    //修改全屏状态
    commit(type.SET_FULLSCREEN, true)
    //修改播放状态
    commit(type.SET_PLAYING, true)
}
