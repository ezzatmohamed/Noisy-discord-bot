module.exports = {
    name: ['queue', 'q'],

    handler: async (message, args, session, bot) => {
        const music = await session.getMusic()
        await bot.MessagesController.send(message.channel, music.queue.queue.map(song => song.title).toString())
    },

    description: `dump description`,

    usage: `[title]`
}