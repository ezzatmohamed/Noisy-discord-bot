const Queue = require('./Queue')
const Song = require('./Song')
const YoutubeAdapter = require('../../adaptors/youtube')

const youtube_adapter = new YoutubeAdapter()

class Player {
    constructor(bot, session, queue=[], current=0, loop=undefined, autoplay=undefined) {
        this.bot = bot
        this.queue = Queue.createQueue(queue)
        this.session = session
    }

    convertToSongs(message, songs_info) {
        let songs = []
        songs_info.forEach(async song_info => songs.push(await Song.create({...song_info, added_by: message.author.id})))
        return songs
    }

    async search(message, query) {
        let songs_info = await youtube_adapter.search(query)
        return this.convertToSongs(message, songs_info)
    }

    async getSongs(message, query) {
        let songs_info = await youtube_adapter.getSongs(query)
        return this.convertToSongs(message, songs_info)
    }

    async add(message, query) {
        let songs = await this.getSongs(message, query)
        songs.forEach(song => this.queue.add(song))
        return songs
    }

    async next() {
        const success = this.queue.next()
        if (!success && this.queue.autoplay !== Queue.AUTOPLAY_MODES.AUTOPLAY_OFF) return await this.addRelated()
        return success
    }

    async addRelated() {
        if (this.queue.autoplay === Queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE) this.queue.add(this.queue.queue[this.queue.queue.length - 1])
        else if (this.queue.autoplay === Queue.AUTOPLAY_MODES.AUTOPLAY_SONG) this.queue.add(this.queue.queue[this.queue.queue.length - 1])
        else return false
        return true
    }

    async start(song_idx=undefined) {
        if (song_idx && (song_idx < 0 || song_idx >= this.queue.queue.length)) return false
        const current_track = this.queue.getCurrentTrack()
        if (!current_track) return false
        const stream = await youtube_adapter.getStream(current_track.url)
        if (stream) {
            this.session.voice.connection.play(stream, { type: 'opus' })
            return true
        }
        return false
    }
}

module.exports = Player