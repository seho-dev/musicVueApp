<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="backgrounsImg" ref="bgImg">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="this.songs.length>0 && randomDom" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scorll
      :data="songs"
      class="list"
      ref="list"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scorll"
    >
      <div class="song-list-wrapper">
        <songList :songs="songs" @selectItem="selectItem" :rank="rank"></songList>
      </div>
    </scorll>
  </div>
</template>

<script>
import Loading from "base/loading/loading";
import Scorll from "base/scroll/scroll";
import SongList from "base/songList/songList";
import { prefixStyle } from "common/js/dom";
import { mapActions } from "vuex";
import {playListMixin} from 'common/js/mixin'

const transform = prefixStyle("transform");
const backdropfilter = prefixStyle("backdrop-filter");

export default {
  name: "music-list",
  mixins:[playListMixin],
  data() {
    return {
      scorllY: 0,
      randomDom:true
    };
  },
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ""
    },
    rank:{
      type:Boolean,
      default:false
    } 

  },
  mounted() {
    //获取歌手图的高度给imgHeight
    this.imgHeight = `${this.$refs.bgImg.clientHeight}`;
    //把偏移单位附给minTransLateY,是负数，因为是往上偏移
    this.minTransLateY = -this.imgHeight;
    this.$refs.list.$el.style.top = `${this.imgHeight}px`;
  },
  created() {
    this.probeType = 3;
    //监听scorll组件
    this.listenScroll = true;
  },
  components: {
    Scorll,
    SongList,
    Loading
  },
  computed: {
    backgrounsImg() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  methods: {
    //mixin定义的方法设置scorll的底部
    handelPlayList(playlist){
      const bottom = playlist.length >=1 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      //刷新
      this.$refs.list.refresh();
    },
    back() {
      //返回歌手列表
      //利用编程式导航
      this.$router.back();
    },
    scorll(pos) {
      this.scorllY = pos.y;
    },
    selectItem(song, item) {
      //给action附参数
      this.selectSong({
        list: this.songs,
        index: item
      });
    },
    random() {
      //随机播放,发起随机action
      this.randomSong({
        list: this.songs
      });
    },
    ...mapActions(["selectSong", "randomSong"])
  },
  watch: {
    scorllY(item) {
      //利用max方法，可以把item滚动的数值与图片的高度（负值）进行比较
      //哪个值大就附给translateY;可以出现的效果就是layer层最多覆盖图片层原来的位置，如果继续滑动，minTransLateY是永远比滑动的像素大
      //就可以实现我们的滑动的下限分配
      let translateY = Math.max(this.minTransLateY, item);
      if(translateY<-287){
        this.randomDom = false
      }else{
        this.randomDom = true
      }
      this.$refs.layer.style[transform] = `translate3d(0,${translateY +
        40}px,0)`;
      //避免滑动到顶部，列表文字盖住图片，所以要动态设置图片的层级关系
      let zindex = 0;
      let scale = 1;
      //高斯模糊
      let blur = 0;
      //定义算法precent,取绝对值
      let precent = Math.abs(item / this.imgHeight);
      //图片放大
      if (item > 0) {
        scale = 1 + precent;
        zindex = 10;
      } else {
        blur = Math.min(20 * precent, 20);
      }
      //处理模糊
      this.$refs.filter.style[backdropfilter] = `blur(${blur}px)`;
      if (item < this.minTransLateY) {
        zindex = 10;
        this.$refs.bgImg.style.paddingTop = 0;
        this.$refs.bgImg.style.height = `40px`;
      } else {
        this.$refs.bgImg.style.paddingTop = "70%";
        this.$refs.bgImg.style.height = 0;
      }
      this.$refs.bgImg.style.zIndex = zindex;
      this.$refs.bgImg.style[transform] = `scale(${scale})`;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
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
