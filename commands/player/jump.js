module.exports = {
    name: ['jump', 'j'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)

        const res = !isNaN(Number(args)) && await player.jump(Number(args)-1)
        if (res) {
            if (!(await bot.CommandsController.handlers['join'](message, args, session, bot, false, false))) return
            await session.setVoiceController(player)
            player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, true, 'delete')
                await res_message.send()
            })
        } else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Invalid track number! 🤔`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}