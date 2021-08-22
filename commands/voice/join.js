module.exports = {
    name: ['join', 'come'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {
        const res = await session.joinVoice(message.member.voice.channel)
        if (res == 0) if (verbose && reply) await message.react('😊')
        else if (res == -1) await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `You must be in a voice channel!`,
        }, message)).send()
        else if (res == 1) if (verbose && reply) await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `I'm already here!`,
        }, reply ? message : undefined)).send()

        return res === 0 || res === 1
    },

    description: `dump description`,

    usage: `[title]`
}