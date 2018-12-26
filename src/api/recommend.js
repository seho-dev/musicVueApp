//导入jsonp
import jsonp from "common/js/jsonp";
//读取公共配置
import { commonParams, options } from "api/config";
import axios from "axios";

export function getrecommend() {
  //定义url接口
  const url =
    "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  //拼接url后的参数，用es6的语法assign塞进去
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    uin: 0,
    needNewCode: 1
  });
  return jsonp(url, data, options);
}

//获取歌单列表的接口
export function getDiscList() {
  //定义url接口
  //const url = "/api/getDiscList";
  const url = "./static/recommend/recommend.json";
  //拼接url后的参数，用es6的语法assign塞进去
  // const data = Object.assign({}, null, {
  //   g_tk: 5381,
  //   inCharset: 'utf8',
  //   outCharset: 'utf8',
  //   notice: 0,
  //   format: 'jsonp',
  //   '-': 'recom6462080004509907',
  //   loginUin: 0,
  //   platform: 'yqq.json',
  //   hostUin: 0,
  //   sin: 0,
  //   ein: 29,
  //   sortId: 5,
  //   needNewCode: 0,
  //   categoryId: 10000000,
  //   rnd: 0.5753448127404452,
  //   data: {"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":0}},"new_album":{"module":"music.web_album_library","method":"get_album_by_tags","param":{"area":1,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":40,"click_albumid":0}},"toplist":{"module":"music.web_toplist_svr","method":"get_toplist_index","param":{}},"focus":{"module":"QQMusic.MusichallServer","method":"GetFocus","param":{}}}
  // });
  return axios
    .get(url, {
      params: ""
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}

//获取推荐页面的歌曲列表
// export function getSongDecList(disstid) {
//   const url = "/api/getDecList";

//   const data = Object.assign({}, commonParams, {
//     disstid,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: "yqq",
//     hostUin: 0,
//     needNewCode: 0,
//     g_tk: 50689795
//   });

//   return axios.get(url,{
//       params:data
//   }).then(res => {
//       return Promise.resolve(res.data)
//   })
// }
