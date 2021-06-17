const Queue = require('./Queue')
const Song = require('./Song')
const YoutubeAdapter = require('../../adaptors/youtube')

const youtube_adapter = new YoutubeAdapter()

class Music {
    constructor(queue, current=0, autoplay=true) {
        this.queue = Queue.createQueue(queue)
        this.current = current
        this.autoplay = autoplay
    }

    async search(query) {
        let songs_info = await youtube_adapter.getSongs(query)
        let songs = []
        songs_info.forEach(async song_info => songs.push(await Song.create(song_info.url, song_info)))
        return songs
    }

    async add(query) {
        let songs = await this.search(query)
        songs.forEach(song => this.queue.add(song))
        return songs
    }
}

module.exports = Music