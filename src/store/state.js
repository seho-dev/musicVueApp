
import { model } from 'common/js/config.js'

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
    topList :{}
}

export default state