import originJSONP from 'jsonp'

export default function jsonp(url,data,option){
    url+=(url.indexOf('?') < 0 ? '?' : '&') + param(data);
    return new Promise((resolve,reject)=>{
         //调用jsonp
         originJSONP(url,option,(err,data)=>{
                if(!err){
                    resolve(data)
                }else{
                    reject(err)
                }
         })
    })
}

export function param(data){
    let url='';
    //循环data
    for(var i in data){
        //如果data值不等于undefined 就把值附给value，否则把空字符串传递给value
        let value= data[i] !== undefined ? data[i] : '';
        //拼接
        url+=`&${i}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : ''
}
