<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll'

  export default {
    props: {
      // 有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件。
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
      listenScroll: { // 要不要监听滚动事件
        type: Boolean,
        default: false
      },
      pullup: { // 是否开启上拉加载
        type: Boolean,
        default: false
      },
      beforeScroll: {
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
          let self = this
          // pos:{Object} {x, y} 滚动的实时坐标
          this.scroll.on('scroll', (pos) => {
            // 派发一个scroll事件
            self.$emit('scroll', pos)
          })
        }

        // 如果允许上拉加载
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
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

