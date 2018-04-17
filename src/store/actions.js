// Action 提交的是 mutation，而不是直接变更状态,更改状态还是要mutation去做
// 说到底只是一个函数，你在里面想干嘛都可以，只要最后触发 mutation 就行
import * as types from './mutation-types'

// 选择播放
export const selectPlay = ({commit, state}, {list, index}) => {
  // 提交顺序播放列表
  commit(types.SET_SEQUENCE_LIST, list)
  // 提交播放列表
  commit(types.SET_FLAYLIST, list)
  // 提交当前播放index
  commit(types.SET_CURRENT_INDEX, index)
  // 提交播放状态为true
  commit(types.SET_PLAYING_STATE, true)
  // 提交全屏播放为true
  commit(types.SET_FULL_SCREEN, true)
}
