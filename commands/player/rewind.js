module.exports = {
    name: ['rewind'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {
        
        const player = session.getPlayer(message)

        if (await player.seek(args, -1)) { if (reply) await message.react('👌') }
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Invalid time`,
        }, reply ? message : undefined)).send()

    },

    description: `dump description`,

    usage: `[title]`
}