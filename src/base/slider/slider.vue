<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item,index) in dot" :key="index" :class="{active:pageIndex===index}"></span>
        </div>
    </div>
</template>
<script>
import BScrool from 'better-scroll'
import {addClassName} from 'common/js/dom'
export default {
    data(){
        return{
            dot:[],
            //定义当前图片的index
            pageIndex:0
        }
    },
    //定义轮播图的数据
    props:{
        loop:{
            type:Boolean,
            default:true
        },
        autoPlay:{
            type:Boolean,
            default:true
        },
        interval:{
            type:Number,
            default:4000
        }
    },
    mounted(){
        setTimeout(()=>{
            this._setSliderWidth()
            this._initDots()
            this._initSlider()
             //自动播放
             if(this.autoPlay){
                this._autoPlay()
             }
        },20)

        //监听视口宽度
        window.addEventListener('resize',()=>{
            //如果slider还没被初始化，就返回掉
            if(!this.slider){
                return
            }
            this._setSliderWidth(false)
        })
    },
    methods:{
        _setSliderWidth(resize){
            //设置轮播图的宽
            //获取子元素对象
            this.children=this.$refs.sliderGroup.children
            //设置宽度
            let width=0;
            //获取父级的宽度
            let sliderWidth=this.$refs.slider.clientWidth;
            for(let i=0;i<this.children.length;i++){
                //给每个元素添加class类名
                let childDom=this.children[i];
                //调用公共dom方法
                addClassName(childDom,"slider-item");
                //设置宽度
                childDom.style.width = sliderWidth + 'px';
                //父级窗口随着递增
                width+=sliderWidth;
            }
            //如果是loop循环，为了切换效果，需要2倍宽度
                if(this.loop && !resize){
                    width += 2*sliderWidth;
                }
            this.$refs.sliderGroup.style.width=width + 'px'
        },
        //初始化dots
        _initDots(){
              console.log(this.children.length);
              this.dot=new Array(this.children.length);
        },
        //初始化轮播图
        _initSlider(){
            //轮播图初始化
            this.slider=new BScrool(this.$refs.slider,{
                //传递参数配置
                //横向滚动
                scrollX:true,
                scrollY:false,
                //惯性
                momentum:false,
                snap:true,
                snapLoop:this.loop,
                snapThreshold:0.3,
                snapSpeed:400,
                click:true
            })
            //派发事件：让当前页pageIndex变化
            //这个事件派发的时机是在即将进入下一页的时候
            this.slider.on('scrollEnd',()=>{
                //pageX是横向滚动的索引
                let ApageIndex = this.slider.getCurrentPage().pageX
                if(this.loop){
                    //因为自动会给第一个拷贝到最后一个形成轮播图，所以这里要减一
                    ApageIndex -= 1
                }
                this.pageIndex=ApageIndex
                if(this.autoPlay){
                    clearTimeout(this.timer)
                    this._autoPlay();
                }
            })
        },
        //自动播放的方法
        _autoPlay(){
            let pageIndex = this.pageIndex+1;
            if(this.loop){
                pageIndex += 1
            }
            this.timer = setTimeout(()=>{
                this.slider.goToPage(pageIndex , 0 ,400)
            },this.interval)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
        .slider
         min-height 1px
         .slider-group
          position: relative
          overflow: hidden
          white-space: nowrap
          .slider-item
           float: left
           box-sizing: border-box
           overflow: hidden
           text-align: center
           a
           display: block
           width: 100%
           overflow: hidden
           text-decoration: none
           img
            display: block
            width: 100%
         .dots
          position: absolute
          right: 0
          left: 0
          bottom: 12px
          text-align: center
          font-size: 0
          .dot
           display: inline-block
           margin: 0 4px
           width: 8px
           height: 8px
           border-radius: 50%
           background: $color-text-l
           &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
</style>
