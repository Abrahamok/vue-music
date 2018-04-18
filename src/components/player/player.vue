<template>
  <div class="player" v-show="playList.length>0">
    <!-- 展开的player -->
    <transition name="normal"
    >
    <!--
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    -->
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
            <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 上 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" >
                <img class="image" :class="cdClass" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <scroll class="middle-r" >
            <div class="lyric-wrapper">
              <div>
                <p class="text"></p>
              </div>
              <div class="pure-music">
                <p></p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 下 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" ></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <!-- 进度条 -->
              <progress-bar ref="progressBar" :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" >
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite" ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 收起的player -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper">
          <img width="40" height="40" :class="cdClass" :src="currentSong.image">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <!-- 当做插槽，要做一个绝对定位，让元素跟圆重合 -->
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 当currentSong发生变化时，开始播放 -->
    <!-- 当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件 -->
    <!-- timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。 -->
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations} from 'vuex'
import Scroll from 'base/scroll/scroll'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'

export default {
  data () {
    return {
      songReady: false, // 歌曲加载完毕再播放
      currentTime: null, // 当前播放事件
      radius: 32 // 圆的直径
    }
  },
  computed: {
    // 播放按钮切换
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // mini播放按钮切换
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // cd转圈
    cdClass() {
      return this.playing ? 'play' : 'play pause'
    },
    // 如果歌曲还没准备好，那么按钮先别点呢 ^_^
    disableClass() {
      return this.songReady ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playList',
      'currentSong',
      'playing',
      'currentIndex'
    ])
  },
  watch: {
    // 当前歌曲信息加载就开始播放
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    // state中playing的状态变更，执行audio的相关方法
    playing(status) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        status ? audio.play() : audio.pause()
      })
    },
    //     原因：当播放器最小化的时候，progress-bar 仍然在监听 percent 的变化，所以在不断计算进度条的位置，然而这个时候由于播放器隐藏，进度条的宽度 this.$refs.progressBar.clientWidth 计算为0，因此计算出来的 offset 也是不对的，导致再次最大化播放器的时候，由于播放器是暂停状态， percent 并不会变化，也不会重新计算这个 offset ，导致如图的 Bug。
    // 解决方案：当播放器最大化的时候，手动去计算一次 offset，确保进度条的位置正确。
    fullScreen(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.progressBar.setProgressOffset(this.percent)
        }, 20)
      }
    }
  },
  methods: {
    back() {
      // 更改state数据，要用提交mutation
      this.setFullScreen(false)
    },
    // 全屏播放
    open() {
      this.setFullScreen(true)
    },
    // 切换播放状态
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      // 当前播放的相反状态
      this.setPlayingState(!this.playing)
    },
    // 上一首
    prev() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      // 最后一首
      if (index === -1) {
        index = this.playList.length
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    // 下一首
    next() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      // 第一首
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    // audio的canplay事件
    ready() {
      // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
      this.songReady = true
    },
    // audio error事件，歌曲加载失败也要让点上一首下一首啊
    error() {
      this.songReady = true
    },
    // timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
    updateTime(event) {
      this.currentTime = event.target.currentTime
    },
    // 进度条组件派发出来的百分比改变事件
    onProgressBarChange(persent) {
      this.$refs.audio.currentTime = this.currentSong.duration * persent
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    // 0:21
    format(interval) {
      // 向下取整
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = (interval % 60).toString().padStart(2, '0')
      return `${minute}:${second}`
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            .cd
              width: 100%
              height: 100%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
              .pause
                animation-play-state: paused
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused  // 动画暂停
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>

