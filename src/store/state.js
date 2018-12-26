
import { model } from 'common/js/config.js'
import {getHistory,queryfavouite,searchplaylist} from 'common/js/cache'

const state = {
    singer: {},
    //音乐播放状态
    playing: false,
    //音乐界面全屏
    fullScreen: false,
    playList: [],
    //顺序播放列表
    sequenceList: [],
    mode: model.sequence,
    currenIndex: -1,
    disc:{},
    topList :{},
    searchHistory: getHistory(),
    playHistory :searchplaylist(),
    favouriteList :queryfavouite()
}

export default state