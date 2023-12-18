const Message = require('./Message')

class MessagesController {
    constructor(bot) {
        this.bot = bot

        /**
         * * Handle the messages
         */
        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
        const regex = ` *(${escapeRegExp(process.env.PREFIX)}) *([^ ]+) *(.*)`

        this.bot.on('message', async(message) => {
            console.log(message)
            if (!message.guild) return
            if (message.author.bot) return
            if (message.content.indexOf(process.env.PREFIX) !== 0) return

            const match_results = (new RegExp(regex, 'ig')).exec(message.content)
            if (!match_results) return

            const command = match_results[2]
            const args = match_results[3]

            const session = this.bot.SessionsController.getSession(message)
            this.bot.CommandsController.handle(message, command, args, session)
        })

        this.Message = Message
    }
}

module.exports = MessagesController