<template>
        <transition name="slide">
            <music-list :songs="song" :title="title" :bgImage="bgImage"></music-list>
        </transition>
</template>

<script>
import {mapGetters} from 'vuex' 
import {getsingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {creatSong} from 'common/js/song'
import musicList from 'components/music-list/music-list'
export default {
    name:'singerDetail',
    data(){
        return{
            song:[]
        }
    },
    components:{
        musicList
    },
    computed:{
        ...mapGetters([
            'singer'
        ]),
        title(){
            return this.singer.name
        },
        bgImage(){
            return this.singer.avatar
        }
    },
    created(){
        this.getSingerDetail();
    },
    methods:{
        getSingerDetail(){
            //如果没有获取到这个id就给他返回到列表页面
            if(!this.singer.id){
                setTimeout(()=>{
                    this.$router.push("/singer")
                },200);
                return
            }
            getsingerDetail(this.singer.id).then((val)=>{
                if(val.code === ERR_OK){
                   this.song = this.nomalSongList(val.data.list);
                }
            })
        },
        nomalSongList(songlist){
            //该方法参数为通过json爬出来的集合数据
            let ret = []
            //循环这个集合
            songlist.forEach((item) => {
                //用变量解构把item对象中的musicData对象解构出来
                let {musicData} = item
                //判断这个对象中有没有获取到songid和albummid
                //如果有调用公共方法，
                if(musicData.songid && musicData.albummid){
                    ret.push(creatSong(musicData))
                }
            });
            //返回的是一个对象数组
            return ret;
        }
    }
}
</script>

<style lang="stylus" scoped>
    @import '~common/stylus/variable';

    .slide-enter-active,.slide-leave-active
     transition all .3s
    .slide-enter,.slide-leave
     transform translate3d(100%,0,0)
</style>
