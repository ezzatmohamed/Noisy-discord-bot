module.exports = {
    name: ['save', 's'],

    handler: async (message, args, session, bot, verbose=true, reply=true) => {

        const player = session.getPlayer(message)
        
        if (args.trim()) player.queue.name = args.trim()

        if (player.queue.name) {
            if (player.queue.queue.length == 0) await (new bot.MessagesController.Message(message.channel, {
                type: 'danger',
                description: `The queue is empty!`,
            }, reply ? message : undefined)).send()
            else if (await player.saveQueue()) await message.react('✅')
            else await (new bot.MessagesController.Message(message.channel, {
                type: 'danger',
                description: `Can't save the queue 😟`,
            }, reply ? message : undefined)).send()
        } else {
            await (new bot.MessagesController.Message(message.channel, {
                type: 'danger',
                description: `You must give the queue a name`,
            }, reply ? message : undefined)).send()
        }
    },

    description: `dump description`,

    usage: `[title]`
}