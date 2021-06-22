const { MessageEmbed } = require('discord.js')

class Message {
    
    constructor(channel, params) {
        this.channel = channel
        this.had_component = false
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
        return embed
    }
    
    getFullContent() {
        return this.params.component || this.had_component ?
            this.content instanceof MessageEmbed ? 
                {content: this.params.content || '⠀', embed: this.content, components: this.params.component} 
                : { content: this.content, components: this.params.component }
            : this.content
    }

    async edit(params) {
        this.setContent(params)
        if (!this.message) return await this.send()
        const full_content = this.getFullContent()
        await this.message.edit(full_content.content, full_content)
        return this.message
    }

    async send() {
        if (this.message) return await this.edit(this.params)
        this.message = await this.channel.send(this.getFullContent())
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