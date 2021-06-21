module.exports = {
    name: ['play', 'p'],

    handler: async (message, args, session, bot) => {

        // * For testing
        if (!args) args = 'https://www.youtube.com/playlist?list=PLj8W9i8pOP4Mc1GRsrevZ7ojkaBzc9EBo'

        // await session.joinVoice(message.member.voice.channel)
        const player = session.getPlayer()
        const songs = await player.add(message, args)
        
        if (songs.length == 1) (new bot.MessagesController.Message(message.channel, {
            description: `Queued [${songs[0].title}](${songs[0].url})\nby <@${songs[0].added_by}>`,
            thumbnail: songs[0].thumbnail
        })).send()
        else if (songs.length > 1) (new bot.MessagesController.Message(message.channel, {
            description: `Queued ${songs.length} song\nby <@${songs[0].added_by}>`,
        })).send()
    },

    description: `dump description`,

    usage: `[title]`
}