module.exports = {
    name: ['next', 'n'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer()
        if (player.queue.queue.length === 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `The queue is empty! add some fun 😊`,
        }, message)).send()

        // TODO: if args
        // const songs = await bot.CommandsController.handlers['add'](message, args, session, bot, false)
        
        const res = await player.next()
        if (res) {
            await session.joinVoice(message.member.voice.channel)
            player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, true)
                await res_message.send()
            }, async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, false)
                await res_message.send()
            })
        } else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Nothing is up next! add more tracks 😊`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}