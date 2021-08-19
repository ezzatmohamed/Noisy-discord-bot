module.exports = {
    name: ['play', 'p'],

    handler: async (message, args, session, bot) => {

        // * For testing
        if (!args) args = 'https://www.youtube.com/playlist?list=PLj8W9i8pOP4Mc1GRsrevZ7ojkaBzc9EBo'

        await session.joinVoice(message.member.voice.channel)
        const player = session.getPlayer(message)
        const was_empty = player.queue.queue.length === 0
        const songs = await bot.CommandsController.handlers['add'](message, args, session, bot, false)
        
        if (was_empty) player.start(async (player) => {
            const res_message = await player.getResponseMessage(message, songs, true, true, 'edit')
            await res_message.send()
        })
        else {
            const res_message = await player.getResponseMessage(message, songs, false, true, 'off')
            await res_message.send()
        }
    },

    description: `dump description`,

    usage: `[title]`
}