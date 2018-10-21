<template>
    <div class="recommend">
        <div class="recommend-context">
            <div v-if="recommend.length" class="slider-warpper">
                <slider>
                    <div v-for="(item,key) in recommend" :key=key>
                        <!-- 可点击的a标签 -->
                        <a :href="item.linkUrl">
                            <img :src="item.picUrl" alt="" class="itemImg">
                        </a>
                    </div>
                </slider>
            </div>
            <div class="recommend-list">
                <h1 class="recommend-title">热门歌单推荐</h1>
                <ul></ul>
            </div>
        </div>
    </div>
</template>

<script>
import {getrecommend} from 'api/recommend'
import {ERR_OK} from 'api/config'
import slider from 'base/slider/slider'
export default {
    name:'recommend',
    data(){
        return{
            recommend:[]
        }
    },
    components:{
        slider
    },
    created(){
        //加载执行方法
        this._getData();
    },
    methods:{
        _getData(){
            getrecommend().then((val) => {
                if(val.code===ERR_OK){
                   this.recommend=val.data.slider;
                }       
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
        .recommend
         position fixed
         width 100%
         top 1.7rem
         bottom 0
         background $color-background
         .recommend-context
          height 100%
          overflow hidden
          .slider-warpper
            position: relative
            width: 100%
            overflow: hidden
          .recommend-list
            .recommend-title
             height 65px
             line-height 65px
             text-align center
             font-size $font-size-medium  
</style>
