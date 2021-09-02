const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports = {
    name: ['list'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {
        if (args.trim()) await bot.CommandsController.handlers['list_queue'](message, args, session, bot)
        else await bot.CommandsController.handlers['list_all'](message, args, session, bot)
    },

    description: `dump description`,

    usage: `[title]`
}