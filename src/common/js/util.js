let Util = {}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 洗牌函数
 * 修改的是arr的副本，对本数组不做影响
 * @param {array} arr arr
 */
Util.shuffle = (arr) => {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

/**
 * 节流函数
 * @param {*} func 函数体
 * @param {*} delay 延时
 */
Util.debounce = (func, delay) => {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export default Util
