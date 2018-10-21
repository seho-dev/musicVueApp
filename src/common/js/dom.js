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
        console.log("22"+newClass);
        newClass.push(className)
        el.className = newClass.join(' ')
}
//判断是否有class的方法
export function hasClassName(el,className){
    //创建正则表达式
    let reg=new RegExp('(^|\\s)'+className+'(\\s|$)');
    return reg.test(el.className);
}

 