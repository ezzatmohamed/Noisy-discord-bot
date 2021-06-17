class MessagesController {
    constructor(bot) {
        this.bot = bot

        /**
         * * Handle the messages
         */
        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
        const regex = ` *(${escapeRegExp(process.env.PREFIX)}) *([^ ]+) *(.*)`

        this.bot.on('message', async(message) => {
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
    }

    /**
     * * edit existing message
     */
    async edit(message, mssg_text) {
        return await message.edit(mssg_text)
    }

    /**
     * * send normal message
     */
    async send(channel, mssg_text) {
        if (!mssg_text) return
        const message = await channel.send(mssg_text)
        return message
    }

    /**
     * * send list
     */
    async sendList(channel, list) {
        const message = await channel.send(list)
        return message
    }
}

module.exports = MessagesController