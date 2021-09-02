const glob = require('glob')
const path = require('path')

class CommandsController {
    constructor(bot) {
        this.bot = bot
        this.commands = {}
        this.handlers = {}

        this.loadCommands()
        this.loadHandlers()
    }

    /**
     * * Load all commands
     */
    loadCommands() {
        glob.sync('commands/**/*.js', { ignore: ['commands/index.js']}).map(file =>{
            const command = require(`./${file.substring(file.indexOf('/') + 1)}`)
            if (!command.name) {
                const fileWithoutPath = path.basename(file)
                command.name = [fileWithoutPath.substring(0, fileWithoutPath.lastIndexOf('.'))]
            }
            command.name.forEach(name => { this.commands[name] = command })
        })
    }

    /**
     * * Handlers
     */
    loadHandlers() {
        Object.keys(this.commands).forEach(name => {
            this.handlers[name] = this.commands[name].handler
        })
    }

    /**
     * * Exec command
     */
    async handle(message, command, args, session) {
        if (!this.handlers[command] || this.commands[command].private) return

        this.handlers[command](message, args, session, this.bot).then(() => {
            // console.log(`############ End`)
        }).catch(err => {
            console.error(err)
            console.log(`############ End with error`)
        })
    }
}

module.exports = CommandsController