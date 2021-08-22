
module.exports = {
    name: ['video', 'v'],

    handler: async (message, args, session, bot) => {
        const player = session.getPlayer(message)
        const songs = await player.search(message, args)
        
        if (songs.length) return await (new bot.MessagesController.Message(message.channel, {
            content: songs[0].url,
        }, message)).send()
        else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Can't find the track 😟`,
        }, message)).send()

    },

    description: `dump description`,

    usage: `[query]`
}