import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/catch'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  // 提交mutations
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) { // 当点击歌曲列表时 如果当前的播放模式为随机播放
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有要添加的歌曲
  let fpIndex = findIndex(playList, song)
  // 插入歌曲索引+1
  currentIndex++
  // 插入歌曲
  playList.splice(currentIndex, 0, song)
  // 如果已经包含该歌曲
  if (fpIndex > -1) {
    // 如果当前要插入的索引大于原来的索引
    if (currentIndex > fpIndex) {
      // 删掉原来的歌曲
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      playList.splice(fsIndex, 1)
      currentSIndex--
    } else {
      playList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  // 实现将结果保存到localstorage中的方法
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_FULL_SCREEN, false)

  const playingState = playList.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_FULL_SCREEN, false)
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
