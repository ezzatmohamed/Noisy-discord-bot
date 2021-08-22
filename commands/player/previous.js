module.exports = {
    name: ['previous', 'prev'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {

        const player = session.getPlayer(message)
        if (player.queue.queue.length === 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `The queue is empty! add some fun 😊`,
        }, reply ? message : undefined)).send()

        const res = await player.previous(true)
        if (res) {
            if (!(await bot.CommandsController.handlers['join'](message, args, session, bot, false, false))) return
            await session.setVoiceController(player)
            player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, reply, 'delete')
                await res_message.send()
            })
        } else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Nothing is before!`,
        }, reply ? message : undefined)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}