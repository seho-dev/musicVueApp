<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="changeIconMode" @click="changeMode"></i>
            <span class="text">{{ModeText}}</span>
            <span class="clear" @click="clean">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList">
          <transition-group ref="list" name="list" tag="ul">
            <li
              :key="item.id"
              class="item"
              v-for="(item,index) in sequenceList"
              @click="selectItem(item,index)"
              ref="itemList"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toogleLove(item)">
                <i :class="clickLove(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text" @click="addSong">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from "vuex";
import scroll from "base/scroll/scroll";
import { model } from "common/js/config";
import confirm from "base/confirm/confirm";
import { changeMode } from "common/js/mixin";
import addSong from "components/add-song/add-song";
import Song from 'common/js/song'


export default {
  mixins: [changeMode],
  data() {
    return {
      showFlag: false
    };
  },
  computed: {
    ModeText() {
      return this.mode === model.random
        ? "随机播放"
        : this.mode === model.sequence
        ? "顺序播放"
        : "单曲循环";
    }
  },
  components: {
    scroll,
    confirm,
    addSong
  },
  methods: {
    addSong() {
      this.$refs.addSong.show();
    },
    show() {
      this.showFlag = true;
      //刷新scorll
      setTimeout(() => {
        this.$refs.listContent.refresh();
        //调用scorll视口
        this.scrollTo(this.currenSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      if (this.currenSong.id === item.id) {
        return "icon-play";
      }
      return "";
    },
    //选择歌曲播放(bug)
    selectItem(item, index) {
      //如果播放模式是随机播放
      if (this.mode === model.random) {
        index = this.playList.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setcurrenIndex(index);
      //播放状态
      this.setplaying(true);
    },
    //当前播放歌曲总是在列表最上方
    //思路：当前播放的歌曲在列表中是第几个，就移动到哪里
    scrollTo(item) {
      let index = this.sequenceList.findIndex(song => {
        return item.id === song.id;
      });
      if (index !== -1) {
        this.$refs.listContent.scrollToElement(this.$refs.itemList[index], 300);
      }
    },
    //删除
    deleteItem(item) {
      this.deleteSong(item);
    },
    //清空
    clean() {
      //弹出对话框
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.cleanSongList();
      //关闭对话框
      this.$refs.confirm.hide();
    },
    ...mapMutations({
      setcurrenIndex: "SET_CURREN_INDEX",
      setplaying: "SET_PLAYLIST"
    }),
    ...mapActions(["deleteSong", "cleanSongList"])
  },
  watch: {
    currenSong(newSong, oldSong) {
      //如果发生变化
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      this.scrollTo(newSong);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>