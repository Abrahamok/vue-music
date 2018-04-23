<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    // 给slider组件几个初始值
    props: {
      loop: { // 是否可以轮播
        type: Boolean,
        default: true
      },
      autoPlay: { // 自动轮播
        type: Boolean,
        default: true
      },
      interval: { // 自动录播间隔
        type: Number,
        default: 4000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth() // 横向滚动，要先设置slider的宽度
        this._initDots() // 就那个小点,因为是自动轮播，BScroll会自动在前后加一个sliderGroup，为了保持数量一直，要在BScroll之前初始化
        this._initSlider() // 初始化BetterScroll在mounted里，等dom已经ready的时候

        if (this.autoPlay) {
          this._play() // 自动播放
        }
      }, 20) // 浏览器的刷新通常是17毫秒一次，初始化操作放在20毫秒后，比较保险

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        // 宽度变化，重新计算
        this.slider.refresh()
      })
    },
    methods: {
      /**
       * 设置slider的宽度
       */
      _setSliderWidth(isResize) {
        // 获取sliderGroup下children的dom,注意作用域是本组件this
        this.children = this.$refs.sliderGroup.children
        console.log(this.children.length)

        let sliderWidth = 0
        // 轮播图宽度是一屏，slider的宽度=所有轮播图宽度之和
        let clientWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          // 轮播组件设置样式，让img自适应宽度
          addClass(child, 'slider-item')

          child.style.width = clientWidth + 'px'
          sliderWidth += clientWidth
        }

        // 如果自动轮播，初始增加两个宽度
        if (this.loop && !isResize) {
          sliderWidth += 2 * clientWidth
        }
        this.$refs.sliderGroup.style.width = sliderWidth + 'px'
      },
      /**
       * 初始化better-scroll
       */
      _initSlider() {
        this.slider = new BetterScroll(this.$refs.slider, {
          scrollX: true, // 横向滚动
          scrollY: false, // 不允许纵向滚动
          momentum: false, // 当快速滑动时是否开启滑动惯性
          snap: true, // 专门给slider配置应用
          snapLoop: this.loop, // 是否可以无缝循环轮播
          snapThreshold: 0.3, // 手动切换时的阈值
          snapSpeed: 400
        })

        // 每次轮播图滚动完毕的时候触发
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots() {
        this.dots = new Array(this.children.length) // 一个长度为5的空数组
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400) // 0 横向 400 间隔
        }, this.interval)
      }
    },
    destroyed() {
      // 如果有定时器之类的，手动销毁一下
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
