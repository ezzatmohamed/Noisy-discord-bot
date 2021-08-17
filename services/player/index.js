const Queue = require('./Queue')
const Song = require('./Song')
const Adapter = require('../../adaptors')

const adapter = new Adapter()

class Player {
    constructor(bot, session, queue=[]) {
        this.bot = bot
        this.queue = Queue.createQueue(queue)
        this.session = session
        this.now_playing_message = { message: undefined, edits: undefined }
    }

    convertToSongs(message, songs_info) {
        let songs = []
        songs_info.forEach(async song_info => songs.push(await Song.create({...song_info, added_by: message.author.id})))
        return songs
    }

    async search(message, query) {
        let songs_info = await adapter.search(query)
        return this.convertToSongs(message, songs_info)
    }

    async getSongs(message, query) {
        let songs_info = await adapter.getSongs(query)
        return this.convertToSongs(message, songs_info)
    }

    async add(message, query) {
        let songs = await this.getSongs(message, query)
        songs.forEach(song => this.queue.add(song))
        return songs
    }

    async next() {
        let success = this.queue.next()
        if (!success && this.queue.autoplay !== Queue.AUTOPLAY_MODES.AUTOPLAY_OFF) {
            success = (await this.addRelated()) && this.queue.next()
        }
        return success
    }

    async addRelated() {
        if (this.queue.autoplay !== Queue.AUTOPLAY_MODES.AUTOPLAY_OFF) {
            let ref_song = undefined
            if (this.queue.autoplay === Queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE)
                ref_song = this.queue.queue[Math.floor(Math.random() * this.queue.queue.length)]
            else if (this.queue.autoplay === Queue.AUTOPLAY_MODES.AUTOPLAY_SONG)
                ref_song = this.queue.queue[this.queue.queue.length - 1]

            let related = (await adapter.getRelated(ref_song.url, this.queue.queue.map(song => song.url))).sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0))
            if (related.length === 0) return false
            related = (await this.getSongs({author: {id: this.bot.user.id}}, related[0].url))[0]
            this.queue.add(related)
        }
        else return false
        return true
    }

    async start(callback=undefined, next_callback=undefined, song_idx=undefined, seek_time=0) {
        if (song_idx && (song_idx < 0 || song_idx >= this.queue.queue.length)) return false
        const current_track = this.queue.getCurrentTrack()
        if (!current_track) return false
        const stream = await adapter.getStream(current_track.url, seek_time)
        if (stream) {
            const dispatcher = this.session.voice.connection.play(stream, { type: 'opus' })
            callback && await callback(this)
            dispatcher.nextCallback = next_callback
            dispatcher.seekedTo = seek_time
            dispatcher.finishListener = async () => {
                (await this.next()) && (await this.start(next_callback))
            }
            dispatcher.once('finish', dispatcher.finishListener)
            return true
        }
        return false
    }

    async pause() {
        if (this.session.voice && this.session.voice.connection && this.session.voice.connection.dispatcher) {
            await this.session.voice.connection.dispatcher.pause()
            return true
        }
        return false
    }

    async resume() {
        if (this.session.voice && this.session.voice.connection && this.session.voice.connection.dispatcher) {
            await this.session.voice.connection.dispatcher.resume()
            return true
        }
        return false
    }

    async fastforward(time) {
        if (time.endsWith('ms')) time = Number(time.slice(0, -2)) / 1000
        else if (time.endsWith('s')) time = Number(time.slice(0, -1))
        else if (time.endsWith('m')) time = Number(time.slice(0, -1))*60
        else time = Number(time)
        if (isNaN(time) || time <= 0) return false
        const dispatcher = this.session.voice.connection.dispatcher
        time = dispatcher.seekedTo + dispatcher.streamTime/1000 + time
        if (dispatcher.finishListener) dispatcher.removeListener('finish', dispatcher.finishListener) // Note: maybe dropped the next_callback function
        dispatcher.end()
        this.start(undefined, dispatcher.nextCallback, undefined, time)
        return true
    }

    async rewind(time) {
        if (time.endsWith('ms')) time = Number(time.slice(0, -2)) / 1000
        else if (time.endsWith('s')) time = Number(time.slice(0, -1))
        else if (time.endsWith('m')) time = Number(time.slice(0, -1))*60
        else time = Number(time)
        if (isNaN(time) || time <= 0) return false
        const dispatcher = this.session.voice.connection.dispatcher
        time = Math.max(dispatcher.seekedTo + dispatcher.streamTime/1000 - time, 0)
        if (dispatcher.finishListener) dispatcher.removeListener('finish', dispatcher.finishListener) // Note: maybe dropped the next_callback function
        dispatcher.end()
        this.start(undefined, dispatcher.nextCallback, undefined, time)
        return true
    }

    async getResponseMessage(message, songs, now_playing, reply=true) {

        if (this.now_playing_message.message) {
            if (!this.now_playing_message.edits) await this.now_playing_message.message.delete()
            else await this.now_playing_message.message.edit(this.now_playing_message.edits)
        }

        if (!songs) songs = [this.queue.getCurrentTrack()]

        let description = ''
        let thumbnail = ''

        if (songs.length === 1) {
            description = `${now_playing ? 'Now Playing' : 'Queued'} [${songs[0].title}](${songs[0].url})\nby <@${songs[0].added_by}>`
            thumbnail = songs[0].thumbnail

            this.now_playing_message.edits = undefined
        } else {
            description = `Queued **${songs.length}** song` + (now_playing ? ` and Now playing [${songs[0].title}](${songs[0].url})` : '') + `\nby <@${songs[0].added_by}>`

            this.now_playing_message.edits = {
                description: `Queued **${songs.length}** song\nby <@${songs[0].added_by}>`
            }
        }

        const res_message = new this.bot.MessagesController.Message(message.channel, thumbnail ? { description, thumbnail } : { description }, reply ? message : undefined)
        this.now_playing_message.message = res_message
        return res_message
    }
}

module.exports = Player