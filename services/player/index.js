const Queue = require('./Queue')
const Song = require('./Song')
const Adapter = require('../../adaptors')

const adapter = new Adapter()

class Player {
    constructor(bot, session, channel=undefined, queue=[]) {
        this.bot = bot
        this.queue = Queue.createQueue(queue)
        this.removed = []
        this.session = session
        this.channel = channel
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
        this.queue.add(songs)
        return songs
    }

    async next(force=false) {
        let success = this.queue.next(force) ? 1 : 0
        if (success == 0) success = ((await this.addRelated(this.removed)) != undefined && this.queue.next(force)) ? -1 : 0
        return success
    }

    async previous(force=false) {
        let success = this.queue.previous(force)
        return success
    }

    async jump(idx) {
        let success = this.queue.jump(idx)
        return success
    }

    async remove(idx) {
        const res = this.queue.remove(idx)
        if (res != 0) this.removed.push(res[1].url)
        return res
    }

    async clear() {
        this.queue.clear()
        this.removed = []
        this.start()
    }

    async shuffle() {
        this.queue.shuffle()
    }

    async addRelated(exclude=[]) {
        if (this.queue.queue.length != 0 && this.queue.autoplay !== Queue.AUTOPLAY_MODES.AUTOPLAY_OFF) {
            let ref_song = undefined
            if (this.queue.autoplay === Queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE)
                ref_song = this.queue.queue[Math.floor(Math.random() * this.queue.queue.length)]
            else if (this.queue.autoplay === Queue.AUTOPLAY_MODES.AUTOPLAY_SONG)
                ref_song = this.queue.queue[this.queue.queue.length - 1]

            let related = (await adapter.getRelated(ref_song.url, [...exclude, ...this.queue.queue.map(song => song.url)])).sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0))
            if (related.length === 0) return undefined
            related = (await this.getSongs({author: {id: this.bot.user.id}}, related[0].url))[0]
            this.queue.add([related])
            return related
        }
        else return undefined
    }

    async start(callback=undefined, seek_time=0) {
        const current_track = this.queue.getCurrentTrack()
        if (!current_track) {
            const dispatcher = this.session.voice.connection.dispatcher
            if (dispatcher && dispatcher.finishListener) dispatcher.removeListener('finish', dispatcher.finishListener)
            dispatcher.end()
            return false
        }
        const stream = await adapter.getStream(current_track.url, seek_time)
        if (stream) {
            const dispatcher = this.session.voice.connection.play(stream, { type: 'opus' })
            await (callback || (async (player) => {
                const res_message = await player.getResponseMessage({channel: this.channel}, undefined, true, false, 'delete')
                await res_message.send()
            }))(this)
            dispatcher.seekedTo = seek_time
            dispatcher.finishListener = async () => {
                let next_mode = await this.next()
                if (next_mode != 0) await this.start(async (player) => {
                    const res_message = await player.getResponseMessage({channel: this.channel}, undefined, true, false, next_mode == -1 ? 'edit' : 'delete')
                    await res_message.send()
                })
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

    async seek(time, sign=1) {
        if (time.endsWith('ms')) time = Number(time.slice(0, -2)) / 1000
        else if (time.endsWith('s')) time = Number(time.slice(0, -1))
        else if (time.endsWith('m')) time = Number(time.slice(0, -1))*60
        else time = Number(time)
        if (isNaN(time) || time <= 0) return false
        const dispatcher = this.session.voice.connection.dispatcher
        time = Math.max(dispatcher.seekedTo + dispatcher.streamTime/1000 + sign*time, 0)
        if (dispatcher.finishListener) dispatcher.removeListener('finish', dispatcher.finishListener)
        dispatcher.end()
        this.start(async () => {}, time)
        return true
    }

    async getResponseMessage(message, songs, now_playing, reply=true, next_mode='edit', removed=false) {

        if (now_playing && this.now_playing_message.message) {
            if (this.now_playing_message.edits == 'nothing') {}
            else if (!this.now_playing_message.edits) await this.now_playing_message.message.delete()
            else await this.now_playing_message.message.edit(this.now_playing_message.edits)
        }

        if (!songs) songs = [this.queue.getCurrentTrack()]

        let description = ''
        let thumbnail = ''

        if (songs.length === 1) {
            description = `${now_playing ? 'Now Playing' : (removed ? 'Removed' : 'Queued')} [${songs[0].title}](${songs[0].url})\nby <@${songs[0].added_by}>`
            thumbnail = songs[0].thumbnail

            if (next_mode != 'off') this.now_playing_message.edits = now_playing && next_mode == 'edit' ? {
                description: `Queued [${songs[0].title}](${songs[0].url})\nby <@${songs[0].added_by}>`,
                thumbnail: songs[0].thumbnail
            } : (next_mode == 'delete' ? undefined : 'nothing')
        } else {
            description = `Queued **${songs.length}** song` + (now_playing ? ` and Now playing [${songs[0].title}](${songs[0].url})` : '') + `\nby <@${songs[0].added_by}>`

            if (next_mode != 'off') this.now_playing_message.edits = {
                description: `Queued **${songs.length}** song\nby <@${songs[0].added_by}>`
            }
        }

        const res_message = new this.bot.MessagesController.Message(message.channel, thumbnail ? { description, thumbnail } : { description }, reply ? message : undefined)
        if (next_mode != 'off') this.now_playing_message.message = res_message
        return res_message
    }
}

module.exports = Player