/**
 * 用于封装storage的相关操作
 */

import storage from "good-storage";

const SEARCH_KEY = "__search__";
const MAX_LENGTH = 15;

//插入
function insertArray(arr, val, compare, maxLen) {

  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

//删除一个
function deleteOne(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    //删除
    arr.splice(index, 1);
  }
}

/**
 *
 * 保存历史
 */
export function saveHistory(query) {
  let searches = storage.get(SEARCH_KEY, []);
  insertArray(
    searches,
    query,
    item => item === query,
    MAX_LENGTH
  );
  storage.set(SEARCH_KEY, searches);
  return searches;
}

/**
 * 删除指定的历史
 */
export function deleteHistoryByItem(query) {
  //获取存储
  let searches = storage.get(SEARCH_KEY, []);
  deleteOne(searches, item => item === query)
  storage.set(SEARCH_KEY, searches);
  return searches
}

/**
 * 删除全部历史
 */

 export function removeHistory(){
   //移出
   storage.remove(SEARCH_KEY)
   return []
 }

//查询存储中的历史
export function getHistory() {
  return storage.get(SEARCH_KEY, []);
}
