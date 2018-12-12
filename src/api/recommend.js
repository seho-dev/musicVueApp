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
  const url = "/api/getDiscList";
  //拼接url后的参数，用es6的语法assign塞进去
  const data = Object.assign({}, commonParams, {
    platform: "yqq",
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: "json"
  });
  return axios
    .get(url, {
      params: data
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
