<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll'

  export default {
    props: {
      probeType: { // 如果需要知道滚动的位置
        type: Number,
        default: 1
      },
      click: { // 手动派发点击事件
        type: Boolean,
        default: true
      },
      data: { // 传进来的数据
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20) // 浏览器的刷新通常是17毫秒一次，初始化操作放在20毫秒后，比较保险
    },
    methods: {
      _initScroll() {
        // 如果初始化参数是undefined，直接return
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BetterScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        // 是否监听滑动事件
        if (this.listenScroll) {
          let me = this
          // pos:{Object} {x, y} 滚动的实时坐标
          this.scroll.on('scroll', (pos) => {
            // 派发一个scroll事件
            me.$emit('scroll', pos)
          })
        }
      },
      /**
       * 代理better-scroll的方法
       * 启用 better-scroll, 默认 开启。
       */
      enable() {
        this.scroll && this.scroll.enable()
      },
      /**
       * 启用 better-scroll, 默认 开启。
       */
      disable() {
        this.scroll && this.scroll.disable()
      },
      /**
       * 重新计算 better-scroll，
       * 当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
       */
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      /**
       * 滑动到指定位置
       */
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      /**
       * 滚动到指定的目标元素
       */
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      // data发生变化就refresh
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

