/**
 * 用于添加dom的公用js
 */

export function addClassName(el,className){
        //如果有这个class
        if(hasClassName(el,className)){
            //什么都不做
            return
        }
        let newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
}

//判断是否有class的方法
export function hasClassName(el,className){
    //创建正则表达式
    let reg=new RegExp('(^|\\s)'+className+'(\\s|$)');
    return reg.test(el.className);
}

export function getData(el,name,val){
    const prefix='data-';
    name=prefix+name;
    if(val){
        return el.setAttribute(name,val);
    }else{
        return el.getAttribute(name);
    }
}



let element = document.createElement("div").style

//立即执行函数
let ventor = (()=>{
   let transformName = {
        webkit:'webkitTransform',
        Moz:'MozTransform',
        O:'OTransform',
        ms:'msTransform',
        standred:'transform'
    }
    for(let key in transformName){
        if(element[transformName[key]] !== undefined){
            return key
        }
    }
    return false;
})()

export function prefixStyle(style){
    if(ventor===false){
        return false
    }
    if(ventor==="standred"){
        return style
    }
    return ventor + style.charAt(0).toUpperCase()+ style.substr(1);
}








 