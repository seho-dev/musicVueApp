//导入jsonp
import jsonp from 'common/js/jsonp'
//读取公共配置
import {commonParams,options} from 'api/config'

export function getrecommend(){
    //定义url接口
    const url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    //拼接url后的参数，用es6的语法assign塞进去
    const data=Object.assign({},commonParams,{
        platform: 'h5',
        uin : 0,
        needNewCode : 1
    })
    return jsonp(url,data,options);
}