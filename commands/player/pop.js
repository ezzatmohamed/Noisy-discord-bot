module.exports = {
    name: ['pop'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)
        return await bot.CommandsController.handlers['remove'](message, player.queue.queue.length, session, bot)
    },

    description: `dump description`,

    usage: `[title]`
}