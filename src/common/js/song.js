import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, strMediaMid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.strMediaMid = strMediaMid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no Lyric')
        }
      })
    })
  }
}
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    strMediaMid: musicData.strMediaMid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval, // 歌曲的播放时长
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.strMediaMid}.m4a?vkey=${vKey}&guid=${guid}&uin=0&fromtag=66`// 歌曲的播放地址
    url: 'http://dl.stream.qqmusic.qq.com/C4000031wrub06889c.m4a?vkey=8B4AAC49C4663EC07D4CB467FBE01075F4DAEFA249C96234794C3C8BB652861C7720295075DC25317C7644E6F7547184DC17900637B31A03&guid=1765146630&uin=0&fromtag=66'
  })
}

// 格式歌手字段（即一首歌的歌手不止一个时的情况）
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
