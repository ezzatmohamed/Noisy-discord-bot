module.exports = {
    name: ['next', 'n'],

    handler: async (message, args, session, bot, verbose=true) => {

        await session.joinVoice(message.member.voice.channel)
        const player = session.getPlayer()
        if (player.queue.queue.length === 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `The queue is empty! add some fun 😊`,
        }, message)).send()

        // TODO: if args
        // const songs = await bot.CommandsController.handlers['add'](message, args, session, bot, false)
        
        const res = await player.next()
        if (res) {
            player.start()
            const current_track = player.queue.getCurrentTrack()
            return await (new bot.MessagesController.Message(message.channel, {
                description: `Now Playing [${current_track.title}](${current_track.url})\nby <@${current_track.added_by}>`,
                thumbnail: current_track.thumbnail
            }, message)).send()
        } else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Nothing is up next! add more tracks 😊`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}