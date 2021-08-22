module.exports = {
    name: ['next', 'n'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {

        const player = session.getPlayer(message)
        if (player.queue.queue.length === 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `The queue is empty! add some fun 😊`,
        }, reply ? message : undefined)).send()

        const res = await player.next(true)
        if (res != 0) {
            if (!(await bot.CommandsController.handlers['join'](message, args, session, bot, false, false))) return
            await session.setVoiceController(player)
            player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, reply, res == -1 ? 'edit' : 'delete')
                await res_message.send()
            })
        } else if (player.queue.autoplay !== player.queue.AUTOPLAY_MODES.AUTOPLAY_OFF) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Can't add new tracks 🥺, can you?`,
        }, reply ? message : undefined)).send()
        else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Nothing is up next! add more tracks 😊`,
        }, reply ? message : undefined)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}