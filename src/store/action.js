/**
 * 批量修改动作
 */

import * as type from "./mutations-type";
import { shuffle } from "common/js/util";
import { model } from "common/js/config";
import {
  saveHistory,
  deleteHistoryByItem,
  removeHistory,
  addplaylist,
  addfavouite,
  removefavouite
} from "common/js/cache";

//寻找索引下标
function getArrIndex(arr, song) {
  return arr.findIndex(item => {
    return item.id === song.id;
  });
}

export const selectSong = function({ commit, state }, { list, index }) {
  //修改顺序列表
  commit(type.SET_SEQUENCE_LIST, list);
  //判断当前顺序如果是随机播放，就让它先播放点击的歌
  if (state.SET_MODE === model.random) {
    //重新洗牌
    list = shuffle(list);
    //寻找点击的那首歌在打乱之后的索引
    index = getArrIndex(randomList, list[index]);
  } else {
    //修改播放列表
    commit(type.SET_PLAYLIST, list);
  }
  commit(type.SET_PLAYLIST, list);
  //修改当前索引
  commit(type.SET_CURREN_INDEX, index);
  //修改全屏状态
  commit(type.SET_FULLSCREEN, true);
  //修改播放状态
  commit(type.SET_PLAYING, true);
};

//随机播放
export const randomSong = function({ commit }, { list }) {
  commit(type.SET_MODE, model.random);
  commit(type.SET_SEQUENCE_LIST, list);
  //打乱数组
  let randomList = shuffle(list);
  commit(type.SET_PLAYLIST, randomList);
  //修改当前索引
  commit(type.SET_CURREN_INDEX, 0);
  //修改全屏状态
  commit(type.SET_FULLSCREEN, true);
  //修改播放状态
  commit(type.SET_PLAYING, true);
};

//搜索组件的点击歌曲播放（插入列表一首歌曲）
export const insertSong = function({ commit, state }, song) {
  //先获取几个必要的内容的副本
  let playlist = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currenIndex = state.currenIndex;

  //记录当前播放的歌曲
  const currentSong = playlist[currenIndex];
  //寻找传入的歌曲，在当前列表的索引（有就是有歌曲，没有就是没有歌曲）
  const fqindex = getArrIndex(playlist, song);
  //当前的播放的索引加一
  currenIndex++;
  //插入此歌曲到这个索引上
  playlist.splice(currenIndex, 0, song);
  //判断当前播放队列有无传值的歌曲对象
  if (fqindex > -1) {
    //如果找到了，有2种情况
    if (currenIndex > fqindex) {
      //删除fqindex所在的数据
      playlist.splice(fqindex, 1);
      //当前播放的索引因为之前队列歌曲被删除，所以我们的索引也要减一
      currenIndex--;
    } else {
      //如果插入的索引后面还有一个相同的数据
      //删除之后的数据
      playlist.splice(fqindex + 1, 1);
    }
  }

  //操作顺序播放列表(同上)
  //寻找需要插入的位置在顺序播放的列表上
  let seqCurrentIndex = getArrIndex(sequenceList, currentSong) + 1;
  const sefqindex = getArrIndex(playlist, song);
  if (sefqindex > -1) {
    if (seqCurrentIndex > sefqindex) {
      playlist.splice(sefqindex, 1);
    } else {
      playlist.splice(sefqindex + 1, 1);
    }
  }

  //提交
  commit(type.SET_PLAYLIST, playlist);
  //修改当前索引
  commit(type.SET_CURREN_INDEX, currenIndex);
  //修改全屏状态
  commit(type.SET_FULLSCREEN, true);
  //修改播放状态
  commit(type.SET_PLAYING, true);
  commit(type.SET_SEQUENCE_LIST, sequenceList);
};

//关于搜索结果历史存储的action
export const saveSearchHistory = function({ commit }, query) {
  commit(type.SET_SEARCH_HISTORY, saveHistory(query));
};

//删除一个历史记录
export const deleteHistory = function({ commit }, query) {
  commit(type.SET_SEARCH_HISTORY, deleteHistoryByItem(query));
};

//删除全部历史记录
export const removeHis = function({ commit }) {
  commit(type.SET_SEARCH_HISTORY, removeHistory());
};

//删除一首歌
export const deleteSong = function({ commit, state }, song) {
  //先获取几个必要的内容的副本
  let playlist = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currenIndex = state.currenIndex;

  let pIndex = getArrIndex(playlist, song);
  playlist.splice(pIndex, 1);
  let sIndex = getArrIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);

  //判断，当前播放索引大于删除的歌曲的索引或者删除末尾歌曲，要把index--
  if (currenIndex > pIndex || currenIndex === playlist.length) {
    currenIndex--;
  }
  commit(type.SET_PLAYLIST, playlist);
  commit(type.SET_SEQUENCE_LIST, sequenceList);
  commit(type.SET_CURREN_INDEX, currenIndex);

  //如果播放列表没有歌曲
  let status = playlist.length > 0;
  commit(type.SET_PLAYING, status);
};

//删除播放列表
export const cleanSongList = function({ commit, status }) {
  commit(type.SET_PLAYLIST, []);
  commit(type.SET_SEQUENCE_LIST, []);
  commit(type.SET_CURREN_INDEX, -1);
};

//新增播放历史
export const addPlayList = function({commit,status},song){
  commit(type.SET_PLAY_HISTORY, addplaylist(song));
}

//增加我喜欢的列表
export const addfavouriteList = function ({commit,status},song){
  commit(type.SET_FAVOURITE_LIST,addfavouite(song))
}

//删除我喜欢的列表
export const removefavouriteList = function({commit,status},song){
  commit(type.SET_FAVOURITE_LIST,removefavouite(song))
}



