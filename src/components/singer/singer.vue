<template>
  <div class="singer">
    <listview :data="singerList" @detail="listenDetail" ref="listview"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import scroll from "base/scroll/scroll";
import { getsingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import listview from "base/ListView/listView";
import { mapMutations } from "vuex";
const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
export default {
  name: "singer",
  data() {
    return {
      singerList: []
    };
  },
  components: {
    listview,
    scroll
  },
  created() {
    getsingerList().then(value => {
      if (value.code === ERR_OK) {
        setTimeout(() => {
          this.singerList = this.nomalList(value.data.list);
          this.$refs.listview.refresh();
        }, 20);
      }
    });
  },
  methods: {
    listenDetail(item) {
      //利用编程式路由跳转路由
      this.$router.push({
        path: `/singer/${item.id}`
      });
      this.setSinger(item);
    },
    nomalList(list) {
      //定义map
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          );
        }
        //获取歌手索引字母
        const key = item.Findex;
        if (!map[key]) {
          //如果没有这个数组，我们就创建这个数组
          map[key] = {
            title: key,
            items: []
          };
        }
        //给字母表中添加歌手item数据
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });

      //为了得到有序的列表，我们需要转换
      let hot = [];
      let ret = [];
      for (let key in map) {
        let value = map[key];
        if (value.title.match(/[a-zA-Z]/)) {
          ret.push(value);
        } else if (value.title === HOT_NAME) {
          hot.push(value);
        }
      }
      //转换成列表之后，我们给字母排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style>
</style>
