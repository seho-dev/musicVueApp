<template>
    <div>
        <scroll :data="data" class="listview" ref="listview">
            <div>
                <ul>
                    <li v-for="(group,number) in data" :key="number" class="list-group" ref="listGroup">
                        <h2 class="list-group-title">{{group.title}}</h2>
                        <ul>
                            <li @click="handelclickSingerDetail(item)" class="list-group-item" v-for="(item,index) in group.items" :key="index">
                                <img class="avatar" v-lazy="item.avatar">
                                <span class="name">{{item.name}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
            @touchend.stop >
                    <ul>
                        <li v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{item:true,current:index==changecolor}" >{{item}}</li>
                    </ul>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script>
import scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
const MOVE_NUMBER = 18;
export default {
        name:'listView',
        created(){
            this.touch={}
        },
        data(){
            return {
                //点击变色
                changecolor:0
            }
        },
        props:{
            data:{
                type:Array,
                default:[],
            }
        },
        components:{
            scroll
        },
        computed:{
            shortcutList(){
                return this.data.map((val) => {
                    return val.title.substr(0,1)
                })
            }
        },
        methods:{
            handelclickSingerDetail(item){
                this.$emit("detail",item);
            },
            onShortcutTouchStart(e){
               //获取歌手索引group，通过调用封装dom方法
               let anchorIndex = getData(e.target, 'index');
                //获取点击对象
               let firstTouch = e.touches[0];
               //获取点击对象的y轴距离附给touch对象的y1
               this.touch.y1=firstTouch.pageY;
               //把当前的触摸索引附给touch对象的anchorIndex
               this.touch.anchorIndex=anchorIndex;
               //点击更换颜色
               this.changecolor=anchorIndex
               //到指定的group
               this._ScorollTo(anchorIndex);
            },
            onShortcutTouchMove(e){
                //获取触摸对象
                let firstTouch = e.touches[0];
                //获取触摸对象的y轴距离附给touch对象的y2
                this.touch.y2=firstTouch.pageY;
                //通过计算差来求出当点击第一下的时候的距离，高度是18，然后向下取整，就可以拿到触摸到第几个元素
                let dlate = (this.touch.y2 - this.touch.y1) / MOVE_NUMBER | 0
                //因为anchorIndex是从data-index上取得，是字符串类型，所以这边要转换int类型来进行运算
                let anchorIndex = parseInt(this.touch.anchorIndex) + dlate;
                this.changecolor=anchorIndex
                this._ScorollTo(anchorIndex);
            },
            _ScorollTo(index){
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
            }
        }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: fixed
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
</style>
