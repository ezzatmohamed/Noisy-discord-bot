module.exports = {
    name: ['shuffle'],

    handler: async (message, args, session, bot) => {
        
        const player = session.getPlayer(message)
        await player.shuffle()

        if (player.queue.queue.length > 0) player.start()

        await message.react('👌')
    },

    description: `dump description`,

    usage: `[title]`
}