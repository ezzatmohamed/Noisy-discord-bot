const Music = require('../services/music')

class Session {
    constructor(guild_id) {
        this.guild_id = guild_id
    }

    /**
     * * join voice channel
     */
    async joinVoice(voice_channel) {
        if (voice_channel.id === this.voice.id) return
        if (!voice_channel) return
        
        await voice_channel.join()
        await voice_channel.guild.voice.setSelfDeaf(true)

        this.voice = voice_channel
    }

    /**
     * * start music service
     */
    async getMusic() {
        if (this.music) return this.music
        this.music = new Music()
        return this.music
    }
}

module.exports = Session