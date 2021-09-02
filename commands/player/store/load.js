module.exports = {
    name: ['load', 'l'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {

        const player = session.getPlayer(message)
        
        const queue_name = args.trim()

        if (queue_name) {
            if (!(await bot.CommandsController.handlers['join'](message, args, session, bot, false, false))) return
            await session.setVoiceController(player)
            if (await player.loadQueue(queue_name)) await message.react('✅')
            else await (new bot.MessagesController.Message(message.channel, {
                type: 'danger',
                description: `Can't find this queue 😟`,
            }, reply ? message : undefined)).send()
        } else {
            await (new bot.MessagesController.Message(message.channel, {
                type: 'danger',
                description: `You must enter the queue name`,
            }, reply ? message : undefined)).send()
        }
    },

    description: `dump description`,

    usage: `[title]`
}