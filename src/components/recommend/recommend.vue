<template>
  <div class="recommend" ref="recomend">
      <scroll class="recommend-content" :data="discList" ref="scroll">
        <div>
          <div  v-if="recommends.length" class="slider-wrapper">
            <slider>
              <div v-for="item in recommends">
                <a v-bind:href="item.linkUrl">
                  <img class="needsclick" @load="loadImage" v-bind:src="item.picUrl" alt="">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" v-for="item in discList" class="item">
                <div class="icon">
                  <img v-lazy="item.imgurl" alt="" width="60px" height="60px">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
  </div>
</template>

<script>
    import Slider from 'base/slider/slider'
    import Scroll from 'base/scroll/scroll'
    import {getRecommend, getDiscList} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import Loading from 'base/loading/loading'
    import {playlistMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'

    export default{
      mixins: [playlistMixin],
      data: function () {
        return {
          recommends: [],
          discList: []
        }
      },
      created () {
        this._getRecommend()
        setTimeout(() => {
          this._getDiscList()
        }, 1000)
      },
      methods: {
        // mixin
        handlePlaylist(playList) {
          const bottom = playList.length > 0 ? '60px' : ''
          this.$refs.recomend.style.bottom = bottom
          this.$refs.scroll.refresh()
        },
        selectItem(item) {
          // console.log(item)
          this.$router.push({
            path: `/recommend/${item.dissid}`
          })
          this.setDisc(item)
        },
        _getRecommend() {
          getRecommend().then((res) => {
            if (res.code === ERR_OK) {
            //   console.log(res.data.slider)
              this.recommends = res.data.slider
            }
          })
        },
        _getDiscList() {
          getDiscList().then((res) => {
            if (res.code === ERR_OK) {
              this.discList = res.data.list
              // console.log(this.discList)
            }
          })
        },
        loadImage() {
          if (!this.checkLoaded) {
            this.$refs.scroll.refresh()
            this.checkLoaded = true
          }
        },
        ...mapMutations({
          setDisc: 'SET_DISC'
        })
      },
      components: {
        Slider,
        Scroll,
        Loading
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable'

    .recommend
        position:fixed
        width:100%
        top:88px
        bottom:0
        .recommend-content
            height:100%
            overflow:hidden
            .slider-wrapper
                position:relative
                width:100%
                overflow:hidden
            .recommend-list
                .list-title
                    leight:65px
                    line-height:65px
                    text-align:center
                    font-size:$font-size-medium
                    color:$color-theme
                .item
                    display:flex
                    box-sizing:border-box
                    align-items:center
                    padding:0 20px 20px 20px
                    .icon
                        flex:0 0 60px
                        width:60px
                        padding-right:20px
                    .text
                        display:flex
                        flex-direction:column
                        justify-content:center
                        flex:1
                        line-height:20px
                        overflow: hidden
                        font-size: $font-size-medium
                        .name
                            margin-bottom: 10px
                            color: $color-text
                        .desc
                            color: $color-text-d
                .loading-container
                    position: absolute
                    width: 100%
                    top: 50%
                    transform: translateY(-50%)
</style>

