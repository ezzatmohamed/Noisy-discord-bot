module.exports = {
    name: ['toggle', 't'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {
        
        const player = session.getPlayer(message)

        if (player.is_paused) await bot.CommandsController.handlers['play'](message, '', session, bot, verbose, reply)
        else await bot.CommandsController.handlers['pause'](message, '', session, bot, verbose, reply)
    },

    description: `dump description`,

    usage: `[title]`
}