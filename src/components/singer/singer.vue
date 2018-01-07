<template>
  <div class="singer" ref="singer">
    <cube-index-list :data="singers" ref="list">
      <cube-index-list-group v-for="(group, index) in singers" :key="index" :group="group" class="list-group">
        <cube-index-list-item v-for="(item, index) in group.items" :key="index" :item="item" @select="selectSinger"
                              class="list-group-item">
          <img class="avatar" v-lazy="item.avatar">
          <span class="name">{{item.name}}</span>
        </cube-index-list-item>
      </cube-index-list-group>
    </cube-index-list>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import { mapMutations } from 'vuex'
  import { playlistMixin } from 'common/js/mixin'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            name: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              name: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.name.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.name === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.name.charCodeAt(0) - b.name.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .cube-index-list-anchor
      padding: 8px 0 8px 20px
    .list-group
      padding-bottom: 30px
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        background: $color-background
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
</style>
