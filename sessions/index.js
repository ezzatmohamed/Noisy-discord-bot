const Session = require('./Session')

class SessionsController {
    constructor(bot) {
        this.bot = bot
        this.sessions = {}
    }

    /**
     * * init a session
     */
    initSession(message) {
        this.sessions[message.guild.id] = new Session(this.bot, message.guild.id)
        return this.sessions[message.guild.id]
    }

    /**
     * * get existing session
     */
    getSession(message) {
        let csession = this.sessions[message.guild.id]
        csession = csession === undefined ? this.initSession(message) : csession
        return csession
    }

    
}

module.exports = SessionsController