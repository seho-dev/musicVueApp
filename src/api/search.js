import jsonp from "common/js/jsonp";
import { commonParams, options } from "./config";
import axios from 'axios'

//热门搜索内容
export function getHotKey() {
  const url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg";
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    needNewCode: 1
  });

  return jsonp(url, data, options);
}

//请求搜索结果
export function getSearchItem(query, page, zhida,perpage) {
  //https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
  const url = "/api/getSearchItem";
  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    n:perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: "utf-8",
    sem: 1,
    aggr: 0,
    remoteplace: "txt.mqq.all",
    uin: 0,
    needNewCode: 1,
    platform: "h5"
  });

  //返回nodejs
  return axios.get(url,{
      params:data
  }).then(res =>{
      return Promise.resolve(res.data)
  })
}
