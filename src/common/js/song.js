import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

export default class song {
    //定义一个类，可传入的参数
    //构造方法
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id,
            this.mid = mid,
            this.singer = singer,
            this.name = name,
            this.album = album,
            this.duration = duration,
            this.image = image,
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
                }else{
                    reject('该曲是未填词的纯音乐，请欣赏')
                }
            })
        })
    }
}

export function creatSong(musicData) {
    //返回一个对象，
    //这个对象拥有很多参数，我们在组件中通过调用这个方法可以返回一个歌手一个对象，对象中有这个歌手的相关信息
    return new song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSongName(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    })
}

//过滤歌手名的方法
function filterSongName(singer) {
    let ret = []
    //如果没有入参
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    });
    //数组中每个数据中/隔开
    return ret.join("/");
}