<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @queryChange="onQueryChange" placeHolder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-if="currentIndex===0">
            <div class="list-inner">
              <song-list :songs="playHistoryList" @selectItem="selectSong"></song-list>
            </div>
          </scroll>
          <!-- 搜索历史 -->
          <scroll
            ref="searchList"
            v-if="currentIndex===1"
            class="list-scroll"
            :data="searchHistory"
          >
            <div class="list-inner">
              <search-list @delete="deleteHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest
          :query="query"
          :showSinger="showSinger"
          @clickItem="selectSuggest"
          @scorllChange="blurInput"
        ></suggest>
      </div>
      <top-tip ref="topTip" :delay="delay">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import scroll from "base/scroll/scroll";
import switches from "base/switches/switches";
import searchBox from "base/search-box/search-box";
import suggest from "components/suggest/suggest";
import songList from "base/songList/songList";
import searchList from "base/search-list/search-list";
import { getSearchItem } from "api/search";
import { mapGetters, mapActions } from "vuex";
import Song from "common/js/song";
import { changeHistory } from "common/js/mixin";
import topTip from "base/top-tip/top-tip";
export default {
  mixins: [changeHistory],
  components: {
    scroll,
    switches,
    searchBox,
    suggest,
    songList,
    searchList,
    topTip
  },
  computed: {
    ...mapGetters(["playHistoryList", "searchHistory"])
  },
  data() {
    return {
      //默认选项卡
      currentIndex: 0,
      //选项
      switches: [
        {
          name: "最近播放"
        },
        {
          name: "搜索历史"
        }
      ],
      //搜索关键字
      query: "",
      showFlag: false,
      //搜索结果
      result: [],
      //是否显示歌手
      showSinger: true,
      //提示显示时间
      delay: 2000
    };
  },
  methods: {
    ...mapActions(["insertSong"]),
    selectSong(song, index) {
      if (index !== 0) {
        //插入歌曲到播放列表
        this.insertSong(new Song(song));
        this.$refs.topTip.show();
      }
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    //blur
    blurInput() {
      this.$refs.searchBox.blur();
    },
    //选择歌曲
    selectSuggest() {},
    onQueryChange(item) {
      this.query = item;
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;

      .list-scroll {
        height: 100%;
        overflow: hidden;

        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }

    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>