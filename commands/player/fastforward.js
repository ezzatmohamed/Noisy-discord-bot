module.exports = {
    name: ['fastforward', 'ff'],

    handler: async (message, args, session, bot) => {
        
        const player = session.getPlayer(message)

        if (await player.seek(args)) await message.react('👌')
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Invalid time`,
        }, message)).send()

    },

    description: `dump description`,

    usage: `[title]`
}