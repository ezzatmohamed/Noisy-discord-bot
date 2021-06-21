module.exports = {
    name: ['join', 'come'],

    handler: async (message, args, session, bot) => {
        await session.joinVoice(message.member.voice.channel)
        await message.react('😊')
    },

    description: `dump description`,

    usage: `[title]`
}