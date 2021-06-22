const Player = require('../services/player')
const TicTacToe = require('../services/tic-tac-toe')

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
        
        const connection = await voice_channel.join()
        await voice_channel.guild.voice.setSelfDeaf(true)

        this.voice = voice_channel
        this.voice.connection = connection
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
        this.player = new Player(this.bot, this)
        return this.player
    }

    /**
     * * terminate player service
     */
    terminatePlayer() {
        if (this.player) delete this.player
        return true
    }

    /**
     * * start player service
     */
    createTicTacToe(player_one, player_two,difficulty) {
        const tic_tac_toe = new TicTacToe(this.bot, this, player_one, player_two, difficulty)
        return tic_tac_toe
    }
}

module.exports = Session