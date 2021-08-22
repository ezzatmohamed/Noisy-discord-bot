const CHANNELS = require('./channels')
const { MessageEmbed } = require('discord.js')
const { EventEmitter } = require('events')

class Radio extends EventEmitter{

    static RADIO_CHANNELS = CHANNELS

    constructor(bot, session) {
        super()
        this.bot = bot
        this.session = session
        this.current = undefined
    }

    async start(idx) {
        const radio_channel = Radio.RADIO_CHANNELS[idx]
        if (radio_channel) {
            this.session.voice.connection.play(radio_channel.url)
            this.current = idx
            this.emit('RadioChanged')
            return radio_channel
        } else {
            this.current = undefined
            this.emit('RadioChanged')
            return undefined
        }
    }

    async stop() {
        this.current = undefined
        this.emit('RadioChanged')
        const dispatcher = this.session.voice.connection.dispatcher
        if (dispatcher) {
            dispatcher.end()
            dispatcher.destroy()
        }
        return true
    }

    getEmbed(page_idx=-1) {
        const res = Radio.createEmbed(
            '', 
            '', 
            this.current,
            page_idx
        )
        if (res.embed) {
            res.embed = res.embed.setTitle(`Radio`)
            res.embed = res.embed.setDescription(`page ${page_idx + 1}/${res.num_pages}` + (this.current != undefined ? ` | **#${this.current + 1} ${Radio.RADIO_CHANNELS[this.current].name}** now playing` : '') + `\n⠀\n` + res.embed.description)
        }
        return res
    }

    static createEmbed(title, description, current, page_idx, added_by=true) {
        if (Radio.RADIO_CHANNELS.length === 0) return { embed: undefined, num_pages: 0 }
        const pages = Radio.RADIO_CHANNELS.map((channel, idx) => ({ idx, channel })).chunk(15)
        page_idx = page_idx === -1 ? 0 : page_idx
        page_idx = page_idx === -2 || page_idx >= pages.length ? pages.length - 1 : page_idx
        let embed = new MessageEmbed()
        embed = title ? embed.setTitle(title) : embed
        embed = embed.setDescription(description + (pages[page_idx].map(ele => 
            `# ${ele.idx + 1}⠀**${ele.channel.name}**${current === ele.idx ? '⠀⠀⠀⠀⠀⠀⠀🎶' : ''}`
        ).join('\n')))
        embed = embed.addFields()
        return {
            embed,
            num_pages: pages.length,
            page_idx
        }
    }

}

module.exports = Radio