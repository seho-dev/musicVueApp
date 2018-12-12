<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="rankList">
      <ul>
        <li class="item" v-for="(item,index) in this.rankList" :key="index" @click="selectItems(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- <div class="loading-container">
        <loading></loading>
      </div>-->
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
//导入组件
import loading from "base/loading/loading";
import scroll from "base/scroll/scroll";
import { getRankList } from "api/rank";
import { ERR_OK } from "api/config";
import { playListMixin } from "common/js/mixin";
import {mapMutations} from 'vuex'
export default {
  mixins: [playListMixin],
  data() {
    return {
      rankList: []
    };
  },
  created() {
    //获取列表
    this._getTodoList();
  },
  methods: {
    _getTodoList() {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList;
        }
      });
    },
    //mixin
    handelPlayList(list){
        //定义bottom
        const bottom = list.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        //刷新scorll
        this.$refs.toplist.refresh();
    },
    //跳转
    selectItems(item){
        //利用编程式导航跳转
        this.$router.push({
            path:`/rank/${item.id}`
        })
        //把数据存储到vuex
        this.setTopList(item)
    },
    ...mapMutations({
        setTopList : 'SET_TOP_LIST'
    })
  },
  components: {
    scroll,
    loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  background: $color-background;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
