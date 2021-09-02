module.exports = {
    name: ['radio', 'r'],

    handler: async (message, args, session, bot) => {
        if (args.trim()) await bot.CommandsController.handlers['radio_stream'](message, args, session, bot)
        else await bot.CommandsController.handlers['radio_list'](message, args, session, bot)
    },

    description: `dump description`,

    usage: `[title]`
}