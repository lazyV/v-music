// // 获取请求需要的vKey字段
// import jsonp from 'common/js/jsonp'
// import {commonParams, options} from './config'
// export function getVkey(songmid, strMediaMid) {
//   const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
//   const data = Object.assign({}, commonParams, {
//     cid: 205361747,
//     songmid: songmid,
//     fileName: `C400${strMediaMid}.m4a`,
//     guid: guid,
//     format: 'json'
//   })
//   return jsonp(url, data, options)
// }

import {commonParams} from 'api/config'
import axios from 'axios'

const guid = parseInt(Math.random() * 2147483647) * parseInt((new Date()).getTime() * 1000) % 10000000000

export function getVkey(songmid, strMediaMid) {
  const url = 'api/getVkey'
  const filename = typeof strMediaMid === 'undefined' ? songmid : strMediaMid
  const data = Object.assign({}, commonParams, {
    cid: 205361747,
    songmid: songmid,
    filename: 'C400' + filename + '.m4a',
    guid: guid
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    if (res.data.data) {
      let vKey = res.data.data.items[0].vkey
      let url = `http://dl.stream.qqmusic.qq.com/C400${filename}.m4a?vkey=${vKey}&guid=${guid}&uin=0&fromtag=66`
      return Promise.resolve(url)
    } else {
      return Promise.resolve('getVkeyErr')
    }
  })
}
