<template>
  <transition name="slide">
    <music-list :bgImage="this.bgImage" :title="this.title"></music-list>
  </transition>
</template>

<script>
import MusicList from "components/music-list/music-list";
import { getSongDecList } from "api/recommend";
import { ERR_OK } from "api/config";

export default {
  components: {
    MusicList
  },
  created() {
    this._getSonglist();
  },
  methods: {
    _getSonglist() {
        alert("这里的歌单没有获取到，因为接口被限制了")
    //   getSongDecList(this.disc.dissid).then((res) => {
    //     if (res.code === ERR_OK) {
    //         console.log(res);
    //     }
    //   });
    }
  }
};
</script>

<style lang="stylus" scoped>
.silde-enter-avtive, .slide-leave-active {
  transition: all 0.3s;
}

.slide-leave-to, .slide-enter {
  transform: translate3d(100%, 0, 0);
}
</style>

