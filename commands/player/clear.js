module.exports = {
    name: ['clear', 'c'],

    handler: async (message, args, session, bot) => {
        
        const player = session.getPlayer()
        player.queue.clear()

        await message.react('👌')
    },

    description: `dump description`,

    usage: `[title]`
}