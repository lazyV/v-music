// 处理操作localstorage相关逻辑
import storage from 'good-storage'

const SEARCH_KEY = '_search_' // 定义内部式key
const SEARCH_MAX_LENGTH = 15 // 定义存储空间 最大只能存储15条数据

const PLAY_KEY = '_play_' // 定义内部式key
const PLAY_MAX_LENGTH = 200 // 定义存储空间 最大只能存储200条数据

const FAVORITE_KEY = '_favorite_' // 定义内部式key
const FAVORITE_MAX_LENGTH = 200

// 封装插入搜索项的方法（实现：每次插入的数据放在数组的最前面，如果有重复的数据就删除对应的条目）
function insertArray(arr, val, compare, maxlen) { // compare比较函数用于查找当前arr中是否有val
  const index = arr.findIndex(compare) // findIndex为数组的ES6语法
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
// 删除的逻辑
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 获取localStorage中的searchHistory
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches) // 保存数组
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

// 存储播放历史
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item === song
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

// 读播放记录 (在state初始值上有用到)
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

//
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
// 获取初始值
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
