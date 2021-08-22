const Player = require('../services/player')
const Radio = require('../services/radio')
const TicTacToe = require('../services/tic-tac-toe')

class Session {
    constructor(bot, guild_id) {
        this.bot = bot
        this.guild_id = guild_id
        this.voice_controller = undefined
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
    getVoiceController(message) {
        if (this.voice_controller && this.voice_controller.constructor.name === 'Player') return this.getPlayer(message)
        else if (this.voice_controller && this.voice_controller.constructor.name === 'Radio') return this.getRadio(message)
        return this.voice_controller
    }

    /**
     * * start player service
     */
    getPlayer(message) {
        this.clearVoiceControl('Player')
        if (!this.player) this.player = new Player(this.bot, this)
        this.player.channel = message.channel
        this.voice_controller = this.player
        return this.player
    }

    /**
     * * start radio service
     */
    getRadio(message) {
        this.clearVoiceControl('Radio')
        if (!this.radio) this.radio = new Radio(this.bot, this)
        this.voice_controller = this.radio
        return this.radio
    }

    /**
     * * clear voice control
     */
    clearVoiceControl(not=undefined) {
        if (this.voice_controller) {
            if (not && this.voice_controller.constructor.name === not) return
            this.voice_controller.stop()
        }
    }

    /**
     * * terminate all voice controllers
     */
    terminateVoice() {
        this.voice_controller = undefined
        if (this.player) {
            this.player.stop()
            delete this.player
        }
        if (this.radio) {
            this.radio.stop()
            delete this.radio
        }
    }

    /**
     * * start player service
     */
    createTicTacToe(player_one, player_two, difficulty, board_size=3) {
        const tic_tac_toe = new TicTacToe(this.bot, this, player_one, player_two, difficulty, board_size)
        return tic_tac_toe
    }
}

module.exports = Session