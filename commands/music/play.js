module.exports = {
    name: ['play', 'p'],

    handler: async (message, args, session, bot) => {
        await session.joinVoice(message.member.voice.channel)
        const music = await session.getMusic()
        const songs = await music.add(args)
        await bot.MessagesController.send(message.channel, songs.map(song => song.title).toString())
    },

    description: `dump description`,

    usage: `[title]`
}