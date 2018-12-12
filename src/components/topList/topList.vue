<template>
  <transition name="slide">
    <music-list :bg-image="bgImage" :title="title" :songs="songs" :rank="true"></music-list>
  </transition>
</template>

<script>
import musicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "api/rank";
import { ERR_OK } from "api/config";
import {creatSong} from 'common/js/song'
export default {
  created() {
    this._getMusicList();
  },
  computed: {
    ...mapGetters(["topList"]),
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if(this.songs.length){
          return this.songs[0].image
      }
      return "";
    }
  },
  data() {
    return {
      songs: []
    };
  },
  components: {
    musicList
  },
  methods: {
    _getMusicList() {
      //如果当前没有获得到id就跳转到父页面
      if(!this.topList.id){
          this.$router.push('/rank')
          return
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.songlist);
        }
      });
    },
    _normalizeSong(list){
        let ret = []
        list.forEach(item => {
            const musicData = item.data
            if(musicData.songid && musicData.albumid){
                ret.push(creatSong(musicData))
            }
        });
        return ret
    }
  }
};
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
