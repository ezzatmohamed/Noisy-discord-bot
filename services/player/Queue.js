const { MessageEmbed } = require('discord.js')
const { EventEmitter } = require('events')
class Queue extends EventEmitter {
    constructor(queue=[]) {
        
        super()
        this.queue = queue
        this.name = undefined
        this.current = 0

    }

    static createQueue(queue) {
        if (typeof queue === Queue) return queue
        else if (typeof queue === typeof []) return new Queue(queue)
        else return new Queue([])
    }

    add(song, pos=-1) {
        if (pos === -1) this.queue.push(song)
        else this.queue.insert(song, pos)
    }

    clear() {
        this.queue = []
        this.emit('QueueChanged')
    }

    shuffle() {
        this.queue = this.queue
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
    }

    getCurrentPlayingPage() {
        const pages = this.queue.map((song, idx) => ({ idx, song })).chunk(1)
        const current_playing_page = pages.map((page, idx) => ({ idx, page})).filter(ele => (this.current >= ele.page[0].idx && this.current <= ele.page[ele.page.length - 1].idx))[0].idx
        return current_playing_page
    }

    getEmbed(page_idx=-1) {
        return Queue.createEmbed(this.queue,
            `Queue ${this.name || '[Unnamed]'}`, 
            `page ${page_idx + 1}/${pages.length} | #${current + 1} now playing\n⠀`, 
            this.current,
            page_idx
        )
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
                value: `[${ele.song.title}](${ele.song.url})` + (added_by ? `(<@${ele.song.added_by}>)` : '')
            })))
        return {
            embed,
            num_pages: pages.length,
            current_playing_page,
            page_idx
        }
    }
}

module.exports = Queue