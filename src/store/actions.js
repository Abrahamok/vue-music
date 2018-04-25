// Action 提交的是 mutation，而不是直接变更状态,更改状态还是要mutation去做
// 说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行
import * as types from './mutation-types'
import Util from 'common/js/util'
import {Config} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch} from 'common/js/cache'

function findIndex(list, song) {
  let index = list.findIndex((item) => {
    return item.id === song.id
  })
  return index
}
// 选择播放
export const selectPlay = ({commit, state}, {list, index}) => {
  // 提交顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === Config.playMode.random) {
    // 提交随机的播放列表
    let randomList = Util.shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
 // 提交播放列表
    commit(types.SET_PLAYLIST, list)
  }
  // 提交当前播放index
  commit(types.SET_CURRENT_INDEX, index)
  // 提交播放状态为true
  commit(types.SET_PLAYING_STATE, true)
  // 提交全屏播放为true
  commit(types.SET_FULL_SCREEN, true)
}

// 随机播放
export const randomPlay = ({commit, state}, {list}) => {
  // 提交播放模式为随机播放
  commit(types.SET_PLAY_MODE, Config.playMode.random)
  // 提交顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 提交随机的播放列表
  let randomList = Util.shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  // 提交当前播放index
  commit(types.SET_CURRENT_INDEX, 0)
   // 提交播放状态为true
  commit(types.SET_PLAYING_STATE, true)
   // 提交全屏播放为true
  commit(types.SET_FULL_SCREEN, true)
}

// 从搜索结果中插入数据到播放列表
export const insertSong = function ({commit, state}, song) {
  // 这里这个slice是精华，下面操作playlist是在非mutation提交的情况下修改state，会报错，这里用slice制作了一个副本，最后才调用commit去提交mutation
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

