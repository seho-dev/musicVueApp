<template>
  <div class="player" v-show="playList.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currenSong.image">
        </div>
        <div class="top">
          <div class="back">
            <i class="icon-back" @click="closePlayer"></i>
          </div>
          <h1 class="title" v-html="currenSong.name"></h1>
          <h2 class="subtitle" v-html="currenSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middeltouchstart"
          @touchmove.prevent="middeltouchmove"
          @touchend="middeltouchend"
        >
          <div class="middle-l" ref="cddom">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdClas">
                <img class="image" :src="currenSong.image">
              </div>
            </div>
            <!-- 展示当前歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{currentLyricText}}</div>
            </div>
          </div>

          <!-- 歌词列表 -->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{'current': currentLineNum ===index}"
                  v-for="(line,index) in currentLyric.lines"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currenTime)}}</span>
            <div class="progress-bar-wrapper">
              <!-- 进度条组件 -->
              <Progress-bar :percent="_getpercent" @listenPercent="onProgressBarChange"></Progress-bar>
            </div>
            <span class="time time-r"></span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="changeIconMode"></i>
            </div>
            <div class="icon i-left" @click="prev">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="targetPlay">
              <i :class="changeIconPlaying"></i>
            </div>
            <div class="icon i-right" @click="next">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openPlayer">
        <div class="icon">
          <img width="40" height="40" :src="currenSong.image" :class="cdClas">
        </div>
        <div class="text">
          <h2 class="name" v-html="currenSong.name"></h2>
          <p class="desc" v-html="currenSong.singer"></p>
        </div>
        <div class="control">
          <prograss-circle :radius="radius" :percent="_getpercent">
            <i :class="changeMiniIconPlaying" @click.stop="targetPlay" class="icon-mini"></i>
          </prograss-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      src="./static/mp3/test.mp3"
      ref="audio"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
//导入第三方
import animations from "create-keyframe-animation";
import Lyric from "lyric-parser";
//导入prefix浏览器前缀封装
import { prefixStyle } from "common/js/dom";
//导入组件
import progress from "base/prograss-bar/prograss";
import prograssCircle from "base/prograss-circle/prograss-circle";
import scroll from "base/scroll/scroll";
//导入播放模式配置
import { model } from "common/js/config";
import { shuffle } from "common/js/util";

const transform = prefixStyle("transform");
const transformDuration = prefixStyle("transformDuration");

export default {
  name: "player",
  components: {
    ProgressBar: progress,
    prograssCircle,
    scroll
  },
  data() {
    return {
      //模拟歌曲准备状态
      songReady: false,
      //播放当前时间
      currenTime: 0,
      radius: 32,
      //Lyric实例对象
      currentLyric: null,
      currentLineNum: 0,
      //控制点的状态
      currentShow: "cd",
      //控制手势的对象
      touch: {},
      //当前播放的歌词
      currentLyricText: ""
    };
  },
  methods: {
    //关闭播放器全屏状态
    closePlayer() {
      this.setfullScreen(false);
    },
    openPlayer() {
      this.setfullScreen(true);
    },
    ...mapMutations({
      setfullScreen: "SET_FULLSCREEN",
      setPlayingStatas: "SET_PLAYING",
      setcurrenIndex: "SET_CURREN_INDEX",
      setMode: "SET_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    //动画的执行
    enter(el, done) {
      //利用数据解构从_getPosAndScale方法解构数据
      const { x, y, scale } = this._getPosAndScale();
      //定义动画内容
      let animation = {
        0: {
          transition: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transition: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transition: `translate3d(0,0,0) scale(1)`
        }
      };
      //注册动画,第三方库提供的api
      animations.registerAnimation({
        //动画名称
        name: "move",
        //动画配置对象
        animation,
        //动画其他设置
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      //运行动画,执行动画的对应dom，动画内容，和执行后的回调函数
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      //进入之后将移出动画
      //注销动画
      animations.unregisterAnimation("move");
      //容器中的动画内容设置为空
      this.$refs.cdWrapper.style.animation = "";
    },
    //离开的动画和开始的动画是相对的
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      //利用数据解构从_getPosAndScale方法解构数据
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      //监听动画结束，然后回调
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      //清空动画
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    //封装获取初始位置和初始大小
    _getPosAndScale() {
      //迷你播放器的图片宽度
      const targetWidth = 40;
      //迷你播放器和左边边距
      const paddingLeft = 40;
      //迷你播放器和下边边距
      const paddingBottom = 30;
      //普通播放器的上边距
      const paddingTop = 80;
      //普通播放器的宽度（是80%）
      const width = window.innerWidth * 0.8;
      //初始化x,y,scale数据,除2减去左边的边距就等于大播放器图片的
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      //计算放大的倍数，从小图片到大图片
      const scale = targetWidth / width;
      //返回一个对象
      return {
        x,
        y,
        scale
      };
    },
    targetPlay() {
      //更改播放状态
      this.setPlayingStatas(!this.playing);
      //歌词
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    end() {
      //当歌曲播放完毕之后，跳转到下一首歌
      if (this.mode === model.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      //把当前播放器设置进度设置为0
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    //点击上一首歌，和下一首歌
    next() {
      if (!this.songReady) {
        return;
      }
      //如果当前列表只有一首歌，就给他调用loop方法
      if (this.currenSong.length === 1) {
        this.loop();
      } else {
        let radio = this.$refs.audio;
        //通过vuex更改currentindex即可，因为当前歌曲是根据index计算得出的
        let index = this.currenIndex + 1;
        //如果超出播放列表长度，就给它变成第一个
        if (index === this.currenSong.length) {
          index = 0;
        }
        radio.currentTime = 0;
        this.setcurrenIndex(index);
        //点击下一首或者上一首，播放状态需要开启
        if (!this.playing) {
          this.targetPlay();
        }
      }
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.currenSong.length === 1) {
        this.loop();
      } else {
        let radio = this.$refs.audio;
        let index = this.currenIndex - 1;
        if (index === -1) {
          index = this.currenSong.length - 1;
        }
        radio.currentTime = 0;
        this.setcurrenIndex(index);
        if (!this.playing) {
          this.targetPlay();
        }
      }
    },
    //关于播放器的方法
    ready() {
      this.songReady = true;
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      //获取播放当前瞬时时间
      this.currenTime = e.target.currentTime;
    },
    //矫正时间格式
    format(interval) {
      //向下取整
      interval = interval | 0;
      //获取分秒
      let minute = (interval / 60) | 0;
      let second = this._insertZero(interval % 60);
      return `${minute}:${second}`;
    },
    //补0操作
    _insertZero(num, i = 2) {
      let len = num.toString().length;
      while (len < i) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    //点击改变播放模式
    changeMode() {
      //从vuex取mode模式，进行改变,(重点)
      let newMode = (this.mode + 1) % 3;
      //设置新的模式
      this.setMode(newMode);
      //更改顺序，如果当前是随机播放，就洗牌
      let list = null;
      if (this.mode === this.model.random) {
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
    //处理歌词
    getlyric() {
      this.currenSong
        .getLyric()
        .then(Response => {
          this.currentLyric = new Lyric(Response, this.handelLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          //处理边界操作,如果没有获取到歌词
          this.currentLyric = null;
          this.currentLineNum = 0;
        });
    },
    handelLyric({ lineNum, txt }) {
      //获得当前的行数和文案
      this.currentLineNum = lineNum;
      this.currentLyricText = txt;
      //scorll组件跟随移动,当歌词经过5句的时候，让scroll组件视口移动到开头，这样就可以保持歌到哪里，视口就跟着移动
      if (lineNum > 5) {
        this.$refs.lyricList.scrollToElement(
          this.$refs.lyricLine[lineNum - 5],
          1000
        );
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    },
    //滑动cd和歌词的手势
    middeltouchstart(e) {
      //初始化
      this.touch.initstatus = true;
      const touch = e.touches[0];
      //记录坐标x,y
      this.touch.moveX = touch.pageX;
      this.touch.moveY = touch.pageY;
    },
    middeltouchmove(e) {
      //判断手势状态是否为真
      if (!this.touch.initstatus) {
        return;
      }
      const touch = e.touches[0];
      //记录滑动的距离
      const detailX = touch.pageX - this.touch.moveX;
      const detailY = touch.pageY - this.touch.moveY;
      //不能让它向下滑动
      if (Math.abs(detailY) > Math.abs(detailX)) {
        return;
      }
      const left = this.currentShow == "cd" ? 0 : -window.innerWidth;
      //控制最大和最小移动的区间,不能大于0，不能小于整个屏幕的宽
      const offsetwidth = Math.min(
        0,
        Math.max(-window.innerWidth, detailX + left)
      );
      //计算滑动百分比
      this.touch.percent = Math.abs(offsetwidth / window.innerWidth);
      this.$refs.cddom.style.opacity = 1 - this.touch.percent;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetwidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transformDuration] = 0;
      this.$refs.cddom.style[transformDuration] = 0;
    },
    middeltouchend() {
      let offsetwidth;
      let opacity;
      //获取当前的移动宽度
      //如果当前是cd页面
      if (this.currentShow == "cd") {
        //滑动比例如果超过百分之10，就让它到歌词页面位置
        if (this.touch.percent > 0.1) {
          offsetwidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          //回到原始的地方
          offsetwidth = 0;
          opacity = 1;
        }
      } else {
        //如果是歌词页面，向左滑动
        if (this.touch.percent < 0.9) {
          offsetwidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetwidth = -window.innerWidth;
          opacity = 0;
        }
      }
      //移动位置
      const time = 600;
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetwidth}px,0,0)`;

      this.$refs.lyricList.$el.style[transformDuration] = `${time}ms`;
      this.$refs.cddom.style.opacity = opacity;
    },
    resetCurrenIndex(list) {
      //通过es6的函数，我们要找到当前歌曲所在的索引
      let index = list.findIndex(item => {
        return this.currenSong.id === item.id;
      });
      this.setcurrenIndex(index);
    },
    //拖拉按钮监听事件
    onProgressBarChange(item) {
      //通过百分比可以设置歌曲的百分比
      const percent = 5.36 * 60 * item;
      this.$refs.audio.currentTime = percent;
      //拖拉之后自动播放
      if (!this.playing) {
        this.targetPlay();
      }
      //歌词
      if (this.currentLyric) {
        this.currentLyric.seek(percent * 1000);
      }
    }
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playList",
      "currenSong",
      "playing",
      "currenIndex",
      "mode",
      "sequenceList"
    ]),
    //更改暂停和播放的图标
    changeIconPlaying() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    changeMiniIconPlaying() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    //改变播放状态的类名图标
    changeIconMode() {
      return this.mode === model.sequence
        ? "icon-sequence"
        : this.mode === model.loop
        ? "icon-loop"
        : "icon-random";
    },
    cdClas() {
      return this.playing ? "play" : "play pause";
    },
    _getpercent() {
      let percent = this.currenTime / (5.36 * 60);
      //返回当前播放的进度占总的百分比
      return percent;
    }
  },
  watch: {
    currenSong(newItem, oldItem) {
      if (newItem.id === oldItem.id) {
        return;
      }
      //歌词获取之前，先把当前的歌词对象清除掉
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      this.$nextTick(() => {
        this.$refs.audio.play();
        //处理歌词
        this.getlyric();
      });
    },
    playing(item) {
      let audio = this.$refs.audio;
      //判断playing的值，如果为真就给他播放，为假就暂停
      item ? audio.play() : audio.pause();
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
