module.exports = {
    name: ['pause'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {
        
        const player = session.getPlayer(message)

        if (await player.pause()) { if (reply) await message.react('👌') }
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Play some music first`,
        }, reply ? message : undefined)).send()
    },

    description: `dump description`,

    usage: `[title]`
}