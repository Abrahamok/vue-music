<template>
  <svg class='svg-wrapper' ref="svg" viewBox="0 0 100 100" :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern :id="id" patternUnits="userSpaceOnUse" width="100" height="100">
        <image  class='svg-image' x="0" y="0" width="100" height="100" :xlink:href="imgUrl">
          <animateTransform attributeName="transform" begin="0s" :dur="duration"  type="rotate" :from="from" :to="to" repeatCount="indefinite"/>
        </image>
      </pattern>
    </defs>
    <circle cx="50%" cy="50%" r="50%" :fill="fill"></circle>
  </svg>
</template>
<script>
  export default {
    props: {
      width: {
        type: String,
        default: 50
      },
      height: {
        type: String,
        default: 50
      },
      imgUrl: {
        type: String
      },
      duration: {
        type: String,
        default: '10s'
      },
      id: {
        type: String,
        default () {
          // 如果页面加载多个svg-rotate组件，会造成id相同,所以取个随机数
          return `image${Math.random()}`
        }
      }
    },
    data () {
      return {
      }
    },
    methods: {
      play () { // 向外暴露的方法,播放svg动画
        this.$refs.svg.unpauseAnimations()
      },
      pause () { // 向外暴露的方法,暂停svg动画
        this.$refs.svg.pauseAnimations()
      }
    },
    computed: {
      from () {
        return `0 50 50`
      },
      to () {
        return `360 50 50`
      },
      fill () {
        return `url(#${this.id})`
      }
    }
  }
</script>
