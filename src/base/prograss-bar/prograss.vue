<template>
  <div class="progress-bar" ref="progressBar" @click="handleClickPrograss">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div
          class="progress-btn"
          @touchstart.prevent="prograsStart"
          @touchmove.prevent="prograssMove"
          @touchend="prograssEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/dom"

//小球的宽度
const prograssBtnWidth = 16
const transform = prefixStyle("transform")

export default {
    name:'prograss',
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    created(){
        this.touch={}
    },
    methods:{
        prograsStart(e){
            //初始化开始记录
            this.touch.initstate = true
            //获取x偏移量
            this.touch.startx = e.touches[0].pageX
            //获取初始经过的进度条的长度
            this.touch.left = this.$refs.progress.clientWidth
        },
        prograssMove(e){
            //判断状态是否是开启的
            if(!this.touch.initstate){
                return 
            }
            //当正在移动的时候，获取偏移量
            let moveX =  e.touches[0].pageX - this.touch.startx
            let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - prograssBtnWidth, Math.max(0,this.touch.left+moveX))
            console.log("跨度："+offsetWidth)
            this._offsetMoveX(offsetWidth)
        },
        prograssEnd(){
            //首先把状态更改为结束
            this.touch.initstate = false;
            this._triggerPercent();
        },
        //定义统一移动的方法
        _offsetMoveX(offsetWidth){
            //移动小球和黄色进度条
            //黄色进度条变宽
            this.$refs.progress.style.width = `${offsetWidth}px`
            //小球移动开始
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        },
        //计算偏移百分比量
        _triggerPercent(){
          const percentStep=  this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - prograssBtnWidth);
          this.$emit("listenPercent",percentStep)
        },
        //当我们点击的时候进度条要跳到指定的位置
        handleClickPrograss(e){
            //这里获取父进度条距离左边的距离
            const rect = this.$refs.progressBar.getBoundingClientRect;
            const offsetWidth = e.pageX - rect.left
            this._offsetMoveX(offsetWidth)
            //this._offsetMoveX(e.offsetX);
            //通知父组件
            this._triggerPercent();
        }
    },
    watch:{
        percent(Item){
            if(Item >= 0 && !this.touch.initstate){
                //获取总拉杆长
                let prograssBarWidth = this.$refs.progressBar.clientWidth - prograssBtnWidth;
                //移动的距离
                let offset = Item * prograssBarWidth
                //console.log(offset)
                this._offsetMoveX(offset)
            }
        }
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
