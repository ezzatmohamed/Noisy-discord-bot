module.exports = {
    name: ['remove', 'r'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)

        const [res, removed] = !isNaN(Number(args)) && await player.remove(Number(args)-1)
        if (res != 0) {
            const res_message = await player.getResponseMessage(message, [removed], false, true, 'off', true)
            await res_message.send()
        }
        
        if (res < 0) {
            if (res == -2) await player.next(true)

            if (!(await bot.CommandsController.handlers['join'](message, args, session, bot, false, false))) return
            await session.setVoiceController(player)
            player.start()
        } else if (res == 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Invalid track number! 🤔`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}