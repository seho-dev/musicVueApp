<template>
  <scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore"
    :beforeScroll="true"
    @beforeScroll="scorllChange"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item,index) in result"
        :key="index"
        @click="handelClickItem(item)"
      >
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading title v-show="haveItem"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!haveItem && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import { getSearchItem } from "api/search";
import { ERR_OK } from "api/config";
import scroll from "base/scroll/scroll";
import { creatSong } from "common/js/song";
import loading from "base/loading/loading";
import Singer from "common/js/singer";
import { mapMutations, mapActions ,mapGetters} from "vuex";
import NoResult from 'base/no-result/no-result'

//定义常量
const SINGER_TYPE = "singer";
//定义返回json字符串的前缀长度
const PREFIX_LENGTH = 9;
//定义下拉加载的条数
const PER_PAGE = 20;
//定义mini播放器的高度
export default {
  components: {
    scroll,
    loading,
    NoResult,
  },
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      //是否开启下拉加载
      pullup: true,
      //下拉是否有内容
      haveItem: true,
      //播放队列是否有歌曲
      playList:true
    };
  },
  watch: {
    query() {
      //请求服务端
      this._getSearchItem();
    }
  },
  methods: {
    //刷新scorll方法暴漏给父组件
    refresh(){
      this.$refs.suggest.refresh();
    },
    //向外触发suggest被滑动
    scorllChange(){
      this.$emit('scorllChange')
    },
    //点击搜索列表的方法
    handelClickItem(item) {
      //如果是歌手
      if (item.type === SINGER_TYPE) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        //利用变成导航跳转
        this.$router.push({
          path: `/search/${item.singermid}`
        });
        //给vuex传入值进入歌手详情页面
        this.setsinger(singer);
      } else {
        this.insertSong(item);
      }
      
      //被点击的时候向外触发事件
      this.$emit("clickItem")
    },
    getDisplayName(item) {
      if (item.type === SINGER_TYPE) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    getIconClass(item) {
      if (item.type === SINGER_TYPE) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    _getSearchItem() {
      this.haveItem = true;
      getSearchItem(this.query, this.page, this.showSinger, PER_PAGE).then(
        res => {
          // //截取字符串
          res = JSON.parse(res.substring(PREFIX_LENGTH, res.length - 1));
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data);
            //调用检查剩余条数的方法
            this.checkSearch(res.data);
          }
        }
      );
    },
    //转换格式
    _genResult(list) {
      let ret = [];
      if (list.zhida && list.zhida.singerid) {
        //如果结果有zhida就给push进数组
        ret.push({ ...list.zhida, ...{ type: SINGER_TYPE } });
      }
      if (list.song) {
        ret = ret.concat(this._normalSong(list.song.list));
      }
      return ret;
    },
    //转换song类型的格式
    _normalSong(list) {
      let ret = [];
      list.forEach(item => {
        if (item.songid && item.albumid) {
          ret.push(creatSong(item));
        }
      });
      return ret;
    },
    searchMore() {
      //调用search方法加载
      if (this.haveItem) {
        //加一页
        this.page++;
        getSearchItem(this.query, this.page, this.showSinger, PER_PAGE).then(
          res => {
            // //截取字符串
            res = JSON.parse(res.substring(PREFIX_LENGTH, res.length - 1));
            if (res.code === ERR_OK) {
              //加载不能直接附值，要用数组拼接
              this.result = this.result.concat(this._genResult(res.data));
              //调用检查剩余条数的方法
              this.checkSearch(res.data);
            }
          }
        );
      }
    },
    //检查是否有数据
    checkSearch(val) {
      const song = val.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * PER_PAGE > song.totalnum
      ) {
        //当前的列表歌曲没有歌曲或者下一次加载的时候没有内容，把变量变成false
        this.haveItem = false;
      }
    },
    ...mapMutations({
      setsinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>