import { mapGetters, mapMutations, mapActions } from "vuex";
import { model } from "common/js/config";
import { shuffle } from "common/js/util";
//引入vuex

export const playListMixin = {
  computed: {
    ...mapGetters(["playList"])
  },

  mounted() {
    this.handelPlayList(this.playList);
  },
  activeated() {
    this.handelPlayList(this.playList);
  },

  watch: {
    playList(newValue) {
      this.handelPlayList(newValue);
    }
  },
  methods: {
    handelPlayList() {
      throw new Error("组件必须实现这个方法");
    }
  }
};

//对播放历史的操作
export const changeHistory = {
  methods: {
    ...mapActions(["deleteHistory"]),
    addQuery(item) {
      //给组件调用方法
      this.$refs.searchBox.setQuery(item);
    }
  }
};

//播放模式切换
export const changeMode = {
  computed: {
    ...mapGetters([
      "playList",
      "currenSong",
      "mode",
      "sequenceList",
      "favouriteList"
    ]),
    //改变播放状态的类名图标
    changeIconMode() {
      return this.mode === model.sequence
        ? "icon-sequence"
        : this.mode === model.loop
        ? "icon-loop"
        : "icon-random";
    }
  },
  methods: {
    ...mapMutations({
      setPlayingStatas: "SET_PLAYING",
      setcurrenIndex: "SET_CURREN_INDEX",
      setMode: "SET_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions(["addfavouriteList", "removefavouriteList"]),
    //点击改变播放模式
    changeMode() {
      //从vuex取mode模式，进行改变,(重点)
      let newMode = (this.mode + 1) % 3;
      //设置新的模式
      this.setMode(newMode);
      //更改顺序，如果当前是随机播放，就洗牌
      let list = null;
      if (this.mode === model.random) {
        //打乱顺序
        list = shuffle(this.sequenceList);
      } else {
        //不打乱
        list = this.sequenceList;
      }
      //当我们改变随机模式的时候，因为当前歌曲是根据列表和索引来计算的，我们需要重新设置一下索引，避免切换随机的时候换歌
      this.resetCurrenIndex(list);
      //vuex传入新的list
      this.setPlayList(list);
    },
    resetCurrenIndex(list) {
      //通过es6的函数，我们要找到当前歌曲所在的索引
      let index = list.findIndex(item => {
        return this.currenSong.id === item.id;
      });
      this.setcurrenIndex(index);
    },

    //点击我喜欢的样式
    clickLove(song) {
      let index = this.HaveLove(song);
      if (index > -1) {
        //说明已经找到这首歌
        return "icon-favorite";
      } else {
        return "icon-not-favorite";
      }
    },
    toogleLove(song) {
      if (this.HaveLove(song) > -1) {
        //删除
        this.removefavouriteList(song);
      } else {
        this.addfavouriteList(song);
      }
    },
    HaveLove(song) {
      let index = this.favouriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index;
    }
  }
};
