module.exports = {
    name: ['play', 'p'],

    handler: async (message, args, session, bot) => {

        // * For testing
        if (!args) args = 'https://www.youtube.com/playlist?list=PLj8W9i8pOP4Mc1GRsrevZ7ojkaBzc9EBo'

        await session.joinVoice(message.member.voice.channel)
        const player = session.getPlayer()
        const was_empty = player.queue.queue.length === 0
        const songs = await bot.CommandsController.handlers['add'](message, args, session, bot, false)
        if (was_empty) player.start()
        
        if (songs.length == 1) (new bot.MessagesController.Message(message.channel, {
            description: `${was_empty ? 'Now Playing' : 'Queued'} [${songs[0].title}](${songs[0].url})\nby <@${songs[0].added_by}>`,
            thumbnail: songs[0].thumbnail
        })).send()
        else if (songs.length > 1) (new bot.MessagesController.Message(message.channel, {
            description: `Queued **${songs.length}** song` + (was_empty ? ` and Now playing [${songs[0].title}](${songs[0].url})` : '') + `\nby <@${songs[0].added_by}>`,
        })).send()
    },

    description: `dump description`,

    usage: `[title]`
}