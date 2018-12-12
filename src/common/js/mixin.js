import { mapGetters } from "vuex";

export const playListMixin = {
  computed: {
    ...mapGetters(["playList"])
  },

  mounted() {
    this.handelPlayList(this.playList);
  },
  activeated() {
    this.handelPlayList(this.playList);
  },

  watch: {
    playList(newValue) {
      this.handelPlayList(newValue);
    }
  },
  methods: {
    handelPlayList() {
      throw new Error("组件必须实现这个方法");
    }
  }
};
