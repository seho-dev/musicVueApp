<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryChange="queryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scorll class="shortcut" ref="shortcut" :data="this.shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                class="item"
                v-for="(item,index) in result"
                :key="index"
                @click="addQuery(item.k)"
              >
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="handelClickConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteHistory"></search-list>
          </div>
        </div>
      </scorll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @scorllChange="boxBlur" @clickItem="setHistory" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" @confirm="removeHis" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import searchBox from "base/search-box/search-box";
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";
import suggest from "components/suggest/suggest";
import SearchList from "base/search-list/search-list";
import { mapActions, mapGetters } from "vuex";
import Scorll from "base/scroll/scroll";
import Confirm from "base/confirm/confirm";
//引入mixxin
import { playListMixin } from "common/js/mixin";
export default {
  mixins: [playListMixin],
  components: {
    searchBox,
    suggest,
    SearchList,
    Scorll,
    Confirm
  },
  computed: {
    ...mapGetters(["searchHistory"]),
    shortcut() {
      return this.result.concat(this.searchHistory);
    }
  },
  data() {
    return {
      result: [],
      query: "",
      //搜索历史的结果集
      // historyResult :[]
      //延迟刷新scorll组件的时间
      refreshDelay: 200
    };
  },
  created() {
    //获取热门搜索内容
    this._getHotKey();
  },
  methods: {
    //弹出对话框
    handelClickConfirm() {
      this.$refs.confirm.show();
    },
    //迷你播放器设置底部
    handelPlayList(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      //设置bottom
      this.$refs.shortcutWrapper.style.bottom = bottom;
      //刷新scorll
      this.$refs.shortcut.refresh();

      this.$refs.searchResult.style.bottom = bottom;
      //刷新
      this.$refs.suggest.refresh();
    },
    //设置搜索历史
    setHistory() {
      this.saveSearchHistory(this.query);
    },
    //调用box方法，失去焦点
    boxBlur() {
      this.$refs.searchBox.blur();
    },
    queryChange(val) {
      this.query = val;
    },
    addQuery(item) {
      //给组件调用方法
      this.$refs.searchBox.setQuery(item);
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.result = res.data.hotkey.slice(0, 10);
        }
      });
    },
    //vuex
    ...mapActions(["saveSearchHistory", "deleteHistory", "removeHis"])
  },
  //监听query的变化，如果从有到无，说明是从suggest切换回来的，在这个时候刷新scorll
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          //手动刷新
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  background: $color-background;

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    z-index: 2;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
    z-index: 1;
  }
}
</style>