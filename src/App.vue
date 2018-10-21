<template>
  <div id="app">
    <index-header></index-header>
    <index-tab></index-tab>
    <router-view></router-view>
  </div>
</template>

<script>
import indexHeader from 'components/index/header/header'
import indexTab from 'components/index/tab/tab'
export default {
  name: 'App',
  components:{
     indexHeader,
     indexTab
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '~common/stylus/variable'
    #app
     color $color-theme
</style>
