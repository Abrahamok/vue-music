// Action 提交的是 mutation，而不是直接变更状态,更改状态还是要mutation去做
// 说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行
import * as types from './mutation-types'
import Util from 'common/js/util'
import {Config} from 'common/js/config'

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
    commit(types.SET_FLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
 // 提交播放列表
    commit(types.SET_FLAYLIST, list)
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
  commit(types.SET_FLAYLIST, randomList)
  // 提交当前播放index
  commit(types.SET_CURRENT_INDEX, 0)
   // 提交播放状态为true
  commit(types.SET_PLAYING_STATE, true)
   // 提交全屏播放为true
  commit(types.SET_FULL_SCREEN, true)
}
