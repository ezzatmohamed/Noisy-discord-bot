const Queue = require('./Queue')
const Song = require('./Song')
const Adapter = require('../../adaptors')
const { MessageEmbed } = require('discord.js')
const QueueModel = require('./QueueSchema')

const adapter = new Adapter()

BAR_LENGTH = 32

class Player {
    constructor(bot, session, channel=undefined, queue=[]) {
        this.bot = bot
        this.queue = Queue.createQueue(queue)
        this.removed = []
        this.session = session
        this.channel = channel
        this.now_playing_message = { message: undefined, edits: undefined }
        this.player_message = undefined
    }

    async convertToSongs(message, songs_info) {
        let songs = []
        for (const song_info of songs_info) {
            songs.push(await Song.create({...song_info, ...(message ? {added_by: message.author.id} : {})}))
        }
        return songs
    }

    async search(message, query) {
        let songs_info = await adapter.search(query)
        return await this.convertToSongs(message, songs_info)
    }

    async getSongs(message, query) {
        let songs_info = await adapter.getSongs(query)
        return await this.convertToSongs(message, songs_info)
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
            this.stop()
            return false
        }
        const stream = await adapter.getStream(current_track.url, seek_time)
        if (stream && this.session.voice) {
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

    async stop() {
        await this.changeNowPlayingMessage()
        const dispatcher = this.session.voice.connection.dispatcher
        if (dispatcher) {
            if (dispatcher.finishListener) dispatcher.removeListener('finish', dispatcher.finishListener)
            await dispatcher.end()
            dispatcher.destroy()
        }

        this.queue.queue_current = 0
        return true
    }

    async play() {
        return (await this.resume()) || (await this.start())
    }

    async seek(time, sign=1) {
        if (time.endsWith('ms')) time = Number(time.slice(0, -2)) / 1000
        else if (time.endsWith('s')) time = Number(time.slice(0, -1))
        else if (time.endsWith('m')) time = Number(time.slice(0, -1))*60
        else time = Number(time)
        if (isNaN(time) || time <= 0) return false
        const dispatcher = this.session.voice.connection.dispatcher
        if (!dispatcher) return false
        time = Math.max(dispatcher.seekedTo + dispatcher.streamTime/1000 + sign*time, 0)
        if (dispatcher.finishListener) dispatcher.removeListener('finish', dispatcher.finishListener)
        dispatcher.end()
        this.start(async () => {}, time)
        return true
    }

    async getResponseMessage(message, songs, now_playing, reply=true, next_mode='edit', removed=false) {

        if (now_playing && this.now_playing_message.message) await this.changeNowPlayingMessage()

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

    async changeNowPlayingMessage() {
        if (this.now_playing_message.edits == 'nothing') {}
        else if (!this.now_playing_message.edits) await this.now_playing_message.message.delete()
        else await this.now_playing_message.message.edit(this.now_playing_message.edits)
    }

    async getPlayerMessage(message=undefined, reply_on=undefined, content={}) {

        if (!message && this.player_message) await this.player_message.delete()

        let song = this.queue.getCurrentTrack()
        const dispatcher = this.session.voice.connection.dispatcher
        if (!song || !dispatcher) {
            if (message) message.setContent({
                type: 'danger',
                description: `Nothing is playing! add tracks 😊`,
            })
            else message = (new this.bot.MessagesController.Message(reply_on.channel, {
                type: 'danger',
                description: `Nothing is playing! add tracks 😊`,
            }, reply_on))
            return message
        }

        let description = ''
        let footer = ''
        let thumbnail = ''

        // thumbnail = song.thumbnail

        let total_time = song.duration.toSecs()
        let slice_length = total_time/BAR_LENGTH
        let streamed_time = dispatcher.seekedTo + dispatcher.streamTime/1000
        let left_length = Math.floor(streamed_time / slice_length)
        let streamed_time_string = Math.floor(streamed_time).toHHMMSS()
        let total_time_string = song.duration
        let remaining_time_string = '-' + Math.floor(total_time - streamed_time).toHHMMSS()
        let sep_length = Math.floor((BAR_LENGTH*1.5 - streamed_time_string.length - total_time_string.length - remaining_time_string.length) / 2)
        description = `[${song.title}](${song.url})\nby <@${song.added_by}>\n`
        footer = `${'▬'.repeat(left_length)}🔵${'▬'.repeat(BAR_LENGTH-1-left_length)}\n` + 
                    `${streamed_time_string}${'⠀'.repeat(sep_length)}${total_time_string}${'⠀'.repeat(sep_length)}${remaining_time_string}`

        
        if (!message) message = new this.bot.MessagesController.Message(reply_on.channel, thumbnail ? { description, thumbnail, footer } : { description, footer }, reply_on)
        else {
            message.setContent({
                description, thumbnail, footer, ...content
            })
        }
        this.player_message = message

        return message
    }

    get is_paused() {
        const dispatcher = this.session.voice.connection.dispatcher
        return !dispatcher || dispatcher.paused
    }

    async saveQueue() {
        if (this.queue.name && this.queue.queue.length > 0) {
            const db_queue = this.queue.db_queue
            const doc = await QueueModel.findOneAndUpdate({
                guild_id: this.session.guild_id,
                name: db_queue.name
            }, {
                guild_id: this.session.guild_id,
                ...db_queue
            }, {
                new: true, upsert: true
            })
            return Boolean(doc)
        } else return false
    }

    async loadQueue(name) {
        const doc = await this.getSavedQueue(name)
        if (!Boolean(doc)) return false
        this.queue = Queue.createQueue(await this.convertToSongs(undefined, doc.queue), doc.name, 0, doc.loop, doc.autoplay)
        this.start()
        return true
    }

    async deleteQueue(name) {
        const res = await QueueModel.findOneAndDelete({
            guild_id: this.session.guild_id,
            name
        })
        return Boolean(res)
    }

    async getSavedQueues() {
        const docs = await QueueModel.find({
            guild_id: this.session.guild_id
        })
        return docs.map(doc => ({
            name: doc.name,
            length: doc.queue.length
        }))
    }

    async getSavedQueue(name, use_class=false) {
        const doc = await QueueModel.findOne({
            guild_id: this.session.guild_id,
            name
        })
        if (!Boolean(doc)) return undefined
        return use_class ? Queue.createQueue(doc.queue, doc.name, 0, doc.loop, doc.autoplay) : doc
    }

    createSavedQueuesEmbed(queues, title, description, page_idx) {
        if (queues.length === 0) return { embed: undefined, num_pages: 0 }
        const pages = queues.map((queue, idx) => ({ idx, queue })).chunk(15)
        page_idx = page_idx === -1 ? 0 : page_idx
        page_idx = page_idx === -2 || page_idx >= pages.length ? pages.length - 1 : page_idx
        let embed = new MessageEmbed()
        embed = title ? embed.setTitle(title) : embed
        embed = embed.setDescription(description + (pages[page_idx].map(ele => 
            `# ${ele.idx + 1}⠀**${ele.queue.name}**⠀⠀⠀⠀(${ele.queue.length}) ${ele.queue.length > 1 ? 'songs' : 'song'}${this.queue.name === ele.queue.name ? '⠀⠀⠀⠀⠀⠀⠀🎶' : ''}`
        ).join('\n')))
        embed = embed.addFields()
        return {
            embed,
            num_pages: pages.length,
            page_idx
        }
    }
}

module.exports = Player