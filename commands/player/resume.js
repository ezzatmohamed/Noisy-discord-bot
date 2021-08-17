module.exports = {
    name: ['resume'],

    handler: async (message, args, session, bot) => {
        
        const player = session.getPlayer()

        if (await player.resume()) await message.react('👌')
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Play some music first`,
        }, message)).send()
    },

    description: `dump description`,

    usage: `[title]`
}