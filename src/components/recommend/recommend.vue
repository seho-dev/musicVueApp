<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" @load="listenImg">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              v-for="(item,index) in discList"
              class="item"
              :key="index"
              @click="handelGoDesc(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <!-- 加载页面 -->
        <div class="loading" v-show="!this.discList.length">
          <loading></loading>
        </div>
        <!-- 弹框 -->
        
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getrecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import slider from "base/slider/slider";
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import { playListMixin } from "common/js/mixin";
import { mapMutations } from "vuex";
import { MessageBox } from 'mint-ui';

export default {
  name: "recommend",
  mixins: [playListMixin],
  data() {
    return {
      recommends: [],
      discList: [],
      popupVisible:false
    };
  },
  components: {
    slider,
    scroll,
    loading
  },
  created() {
    //加载执行方法
    this._getData();
    //加载歌单
    this._getDiscList();
  },
  methods: {
    ...mapMutations({
      setdisc: "SET_DISC"
    }),
    //mixin定义的方法设置scorll的底部
    handelPlayList(playlist) {
      const bottom = playlist.length >= 1 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      //刷新
      this.$refs.scroll.refresh();
    },
    handelGoDesc(item) {
      //利用编程式路由进行跳转
      // this.$router.push({
      //     path:`/recommend/${item.dissid}`
      // })
      MessageBox({
        title:'错误提示',
        message:'没有获取到官方的歌单链接'
      });
      this.setdisc(item);
    },
    _getData() {
      getrecommend().then(val => {
        if (val.code === ERR_OK) {
          this.recommends = val.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(val => {
        if (val.code === ERR_OK) {
          this.discList = val.data.list;
        }
      });
    },
    listenImg() {
      if (!this.middle) {
        this.$refs.scroll.refresh();
        this.middle = true;
      }
    }
  }
};
</script>
<style lang="stylus"  rel="stylesheet/stylus" scoped  >
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  background: $color-background;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
