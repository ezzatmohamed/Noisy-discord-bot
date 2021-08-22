module.exports = {
    name: ['play', 'p'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {

        // * For testing
        if (args == 'p') args = 'https://www.youtube.com/playlist?list=PLj8W9i8pOP4Mc1GRsrevZ7ojkaBzc9EBo'

        await session.joinVoice(message.member.voice.channel)
        const player = session.getPlayer(message)
        
        if (!args) {
            if (await player.play()) { if (reply) await message.react('👌') }
            else await (new bot.MessagesController.Message(message.channel, {
                type: 'danger',
                description: `Nothing to play! add tracks 😊`,
            }, reply ? message : undefined)).send()
        } else {
            const was_empty = player.queue.queue.length === 0
            const songs = await bot.CommandsController.handlers['add'](message, args, session, bot, false)
            
            if (was_empty) player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, songs, true, reply, 'edit')
                await res_message.send()
            })
            else {
                const res_message = await player.getResponseMessage(message, songs, false, reply, 'off')
                await res_message.send()
            }
        }
    },

    description: `dump description`,

    usage: `[title]`
}