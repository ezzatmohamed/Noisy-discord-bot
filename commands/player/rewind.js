module.exports = {
    name: ['rewind'],

    handler: async (message, args, session, bot) => {
        
        const player = session.getPlayer()

        if (await player.rewind(args)) await message.react('👌')
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Invalid time`,
        }, message)).send()

    },

    description: `dump description`,

    usage: `[title]`
}