/**
 * 常用工具类
 */

//随机取0-1中间值(包括0和1)
export function getRandomNumber(min,max){
    return Math.floor(Math.random() * (max-min+1));
}

 //洗牌数组
 export function shuffle(arr){
     const _arr = arr.slice()
     for(let i =0 ; i < _arr.length ; i++){
         //调用
         let j = getRandomNumber(0,i);
         let t = _arr[i];
         _arr[i] = _arr[j];
         _arr[j] = t
     }
     return _arr
 }