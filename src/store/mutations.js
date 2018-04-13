import * as types from './mutation-types'

const matutions = {
  // es6的属性书写方式
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default matutions
