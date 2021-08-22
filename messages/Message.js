const { MessageEmbed } = require('discord.js')

class Message {
    
    constructor(channel, params, reply_on=undefined) {
        this.channel = channel
        this.had_component = false
        this.reply_on = reply_on
        this.setContent(params)
    }

    setContent(params) {
        this.params = params
        this.had_component = this.had_component || this.params.component
        const temp_embed = this.createEmbed()
        this.content = temp_embed || this.params.content
    }

    createEmbed() {
        if (this.params.embed) return this.params.embed.setColor(this.getColor(this.params.type))
        if (!this.params.title && !this.params.description && !this.params.thumbnail && !this.params.footer) return undefined
        let embed = new MessageEmbed()
            .setColor(this.getColor(this.params.type))
        if (this.params.title) embed = embed.setTitle(this.params.title)
        if (this.params.url) embed = embed.setURL(this.params.url)
        if (this.params.description) embed = embed.setDescription(this.params.description)
        if (this.params.thumbnail) embed = embed.setThumbnail(this.params.thumbnail)
        if (this.params.footer && (this.params.footer.title || this.params.footer.image)) embed = embed.setFooter(this.params.footer.title || '\u200B', this.params.footer.image)
        else if (this.params.footer) embed = embed.setFooter(this.params.footer)
        return embed
    }
    
    getFullContent(edit=false) {
        return this.params.component || this.had_component ?
            this.content instanceof MessageEmbed ? 
                {content: this.params.content || '⠀', embed: this.content, components: this.params.component} 
                : { content: this.content, components: this.params.component }
            : (this.content instanceof MessageEmbed ? 
                {content: this.params.content || '⠀', embed: this.content} 
                : this.content)
    }

    async edit(params) {
        this.setContent(params)
        if (!this.message) return await this.send()
        const full_content = this.getFullContent(true)
        await this.message.edit(full_content.content, {...full_content, allowedMentions: { repliedUser: false }})
        return this.message
    }

    async send() {
        if (this.message) return await this.edit(this.params)
        const full_content = this.getFullContent()
        this.message = this.reply_on ? await this.reply_on.lineReplyNoMention(full_content) : await this.channel.send(this.getFullContent())
        if (full_content.components) await this.edit(this.params)
        return this.message
    }

    async delete(options) {
        if (this.message) {
            await this.message.delete(options)
            delete this.message
        }
    }

    getColor(type) {
        if (type === 'danger') return '#F05454'
        else if (type === 'warn') return '#FFE227'
        else if (type === 'secondary') return '#222831'
        else return '#DDDDDD' // primary
    }
}

module.exports = Message