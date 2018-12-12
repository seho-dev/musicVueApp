<template>
  <div id="app">
    <index-header></index-header>
    <index-tab></index-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import indexHeader from "components/index/header/header";
import indexTab from "components/index/tab/tab";
import player from "components/player/player";
export default {
  name: "App",
  components: {
    indexHeader,
    indexTab,
    player
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable';

#app {
  color: $color-theme;
}
</style>
