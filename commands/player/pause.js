module.exports = {
    name: ['pause'],

    handler: async (message, args, session, bot) => {
        
        const player = session.getPlayer(message)

        if (await player.pause()) await message.react('👌')
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Play some music first`,
        }, message)).send()
    },

    description: `dump description`,

    usage: `[title]`
}