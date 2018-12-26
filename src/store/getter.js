//箭头函数的简写,把仓库中的singer对象返回给singer常量
export const singer = state => state.singer;

/*----以下是有关于歌曲播放页面的常量----- */

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currenIndex = state => state.currenIndex;

export const currenSong = state => {
  //通过列表的索引下标来返回具体的歌曲，如果是空就返回一个对象
  return state.playList[state.currenIndex] || {};
};

export const disc = state => state.disc;

export const topList = state => state.topList;

export const searchHistory = state => state.searchHistory;

export const playHistoryList = state => state.playHistory;

export const favouriteList = state => state.favouriteList;
