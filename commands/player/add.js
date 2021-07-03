module.exports = {
    name: ['add', 'a'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer()
        const songs = await player.add(message, args)
        
        if (verbose) {
            if (songs.length == 1) (new bot.MessagesController.Message(message.channel, {
                description: `Queued [${songs[0].title}](${songs[0].url})\nby <@${songs[0].added_by}>`,
                thumbnail: songs[0].thumbnail
            }, message)).send()
            else if (songs.length > 1) (new bot.MessagesController.Message(message.channel, {
                description: `Queued ${songs.length} song\nby <@${songs[0].added_by}>`,
            }, message)).send()
        }

        return songs
    },

    description: `dump description`,

    usage: `[title]`
}