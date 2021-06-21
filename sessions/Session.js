const Player = require('../services/player')

class Session {
    constructor(bot, guild_id) {
        this.bot = bot
        this.guild_id = guild_id
    }

    /**
     * * join voice channel
     */
    async joinVoice(voice_channel) {
        if (this.voice && voice_channel.id === this.voice.id) return
        if (!voice_channel) return
        
        await voice_channel.join()
        await voice_channel.guild.voice.setSelfDeaf(true)

        this.voice = voice_channel
    }

    /**
     * * leave voice channel
     * * return 0 if success, 1 if not in the same channel, -1 if not in a channel
     */
    async leaveVoice(voice_channel) {
        if (!this.voice) return -1
        if (voice_channel.id !== this.voice.id) return 1
        
        await this.voice.leave()
        delete this.voice
        return 0
    }

    /**
     * * start player service
     */
    getPlayer() {
        if (this.player) return this.player
        this.player = new Player(this.bot)
        return this.player
    }

    /**
     * * terminate player service
     */
    terminatePlayer() {
        if (this.player) delete this.player
        return true
    }
}

module.exports = Session