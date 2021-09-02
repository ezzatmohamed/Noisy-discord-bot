const { MessageEmbed } = require('discord.js')
const { EventEmitter } = require('events')

class Queue extends EventEmitter {


    static LOOP_MODES = { LOOP_OFF: 0, LOOP_QUEUE: 1, LOOP_SONG: 2 }
    static AUTOPLAY_MODES = { AUTOPLAY_OFF: 0, AUTOPLAY_QUEUE: 1, AUTOPLAY_SONG: 2 }

    constructor(queue=[], name=undefined, current=0, loop=Queue.LOOP_MODES.LOOP_OFF, autoplay=Queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE) {
        
        super()
        this.queue = queue
        this.LOOP_MODES = Queue.LOOP_MODES
        this.AUTOPLAY_MODES = Queue.AUTOPLAY_MODES
        this.name = name
        this.current = current
        this.loop = loop
        this.autoplay = autoplay

    }

    static createQueue(queue, name=undefined, current=0, loop=Queue.LOOP_MODES.LOOP_OFF, autoplay=Queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE) {
        if (typeof queue === Queue) return queue
        else if (typeof queue === typeof []) return new Queue(queue, name, current, loop, autoplay)
        else return new Queue([], name, current, loop, autoplay)
    }

    set queue_current(value) {
        if (value >= 0 && value < this.queue.length) {
            this.current = value
            this.emit('QueueChanged')
        }
    }

    add(songs, pos=-1) {
        if (pos === -1) this.queue.push(...songs)
        else this.queue.splice(pos, 0, ...songs)
        this.emit('QueueChanged')
    }

    next(force=false) {
        if (this.queue.length === 0) return false
        else if (!force && this.loop === Queue.LOOP_MODES.LOOP_SONG) this.current = this.current
        else if (this.current < this.queue.length - 1) this.current += 1
        else if (this.loop === Queue.LOOP_MODES.LOOP_QUEUE) this.current = 0
        else return false
        this.emit('QueueChanged')
        return true
    }

    previous(force=false) {
        if (this.queue.length === 0) return false
        else if (!force && this.loop === Queue.LOOP_MODES.LOOP_SONG) this.current = this.current
        else if (this.current > 0) this.current -= 1
        else if (this.loop === Queue.LOOP_MODES.LOOP_QUEUE) this.current = this.queue.length - 1
        else return false
        this.emit('QueueChanged')
        return true
    }

    jump(idx) {
        if (idx >= 0 && idx < this.queue.length) this.current = idx
        else return false
        this.emit('QueueChanged')
        return true
    }

    /**
     * 
     * @param {*} idx 
     * @returns 
     *      1 if safely removes
     *      0 if not removed
     *     -1 if need to replay current
     *     -2 if current last song removed
     */
    remove(idx) {
        let res = [0, undefined]
        if (idx >= 0 && idx < this.queue.length) {
            let removed = this.queue.splice(idx, 1)[0]
            if (idx > this.current) res = [1, removed]
            else if (idx == this.current) {
                if (this.current == this.queue.length) {
                    this.current = Math.max(0, this.queue.length - 1)
                    res = [-2, removed]
                }
                else res = [-1, removed]
            } else {
                this.current = Math.max(1, this.current - 1)
                res =  [1, removed]
            }
        }
        if (res != 0) this.emit('QueueChanged')
        return res
    }

    changeLoopMode(mode=undefined) {
        if (mode !== undefined && mode >= 0 && mode < Object.keys(Queue.LOOP_MODES).length) {
            const will_change = this.loop !== mode
            this.loop = mode
            will_change && this.emit('QueueChanged')
            return
        }
        else this.loop = (this.loop + 1) % Object.keys(Queue.LOOP_MODES).length
        this.emit('QueueChanged')
    }

    changeAutoplayMode(mode=undefined) {
        if (mode !== undefined && mode >= 0 && mode < Object.keys(Queue.AUTOPLAY_MODES).length) {
            const will_change = this.autoplay !== mode
            this.autoplay = mode
            will_change && this.emit('QueueChanged')
            return
        }
        else this.autoplay = (this.autoplay + 1) % Object.keys(Queue.AUTOPLAY_MODES).length
        this.emit('QueueChanged')
    }

    clear() {
        this.queue = []
        this.current = 0
        this.emit('QueueChanged')
    }

    shuffle() {
        this.queue = this.queue
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
        this.current = 0
        this.emit('QueueChanged')
    }

    getCurrentTrack() {
        if (this.queue.length === 0 || this.current < 0 || this.current >= this.queue.length) return undefined
        return this.queue[this.current]
    }

    getTrack(idx) {
        return this.queue[idx]
    }

    getCurrentPlayingPage() {
        const pages = this.queue.map((song, idx) => ({ idx, song })).chunk(1)
        const current_playing_page = pages.map((page, idx) => ({ idx, page})).filter(ele => (this.current >= ele.page[0].idx && this.current <= ele.page[ele.page.length - 1].idx))[0].idx
        return current_playing_page
    }

    getEmbed(page_idx=-1, use_current=true) {
        const res = Queue.createEmbed(this.queue,
            '', 
            '', 
            use_current ? this.current : -1,
            page_idx
        )
        if (res.embed) {
            res.embed = res.embed.setTitle(`Queue ${this.name || '[Unnamed]'}`)
            res.embed = res.embed.setDescription(`page ${page_idx + 1}/${res.num_pages}` + (use_current ? ` | #${this.current + 1} now playing\n⠀` : ''))
        }
        return res
    }

    static createEmbed(queue, title, description, current, page_idx, added_by=true) {
        if (queue.length === 0) return { embed: undefined, num_pages: 0 }
        const pages = queue.map((song, idx) => ({ idx, song })).chunk(8)
        let current_playing_page = pages.map((page, idx) => ({ idx, page})).filter(ele => (current >= ele.page[0].idx && current <= ele.page[ele.page.length - 1].idx))
        if (current_playing_page.length > 0) current_playing_page = current_playing_page[0].idx
        else current_playing_page = 0
        page_idx = page_idx === -1 ? current_playing_page : page_idx
        page_idx = page_idx === -2 || page_idx >= pages.length ? pages.length - 1 : page_idx
        let embed = new MessageEmbed()
        embed = title ? embed.setTitle(title) : embed
        embed = description ? embed.setDescription(description) : embed
        embed = embed.addFields(pages[page_idx].map(ele => ({
                name: `# ${ele.idx + 1}      [${ele.song.duration}]${current === ele.idx ? '      🎶' : ''}`,
                value: `[${ele.song.title}](${ele.song.url})` + (added_by ? ` (<@${ele.song.added_by}>)` : '')
            })))
        return {
            embed,
            num_pages: pages.length,
            current_playing_page,
            page_idx
        }
    }

    get autoplay_on() {
        return this.autoplay != this.AUTOPLAY_MODES.AUTOPLAY_OFF
    }

    get db_queue() {
        const queue = this.queue.map(song => {
            const {...obj} = song
            return obj
        })
        return {
            queue,
            name: this.name,
            loop: this.loop,
            autoplay: this.autoplay,
        }
    }
}

module.exports = Queue