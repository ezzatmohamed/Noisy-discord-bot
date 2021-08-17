module.exports = {
    name: ['add', 'a'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer()
        const was_empty = player.queue.queue.length === 0
        const songs = await player.add(message, args)
        
        if (verbose) {
            const res_message = await player.getResponseMessage(message, songs, was_empty)
            await res_message.send()
        }

        return songs
    },

    description: `dump description`,

    usage: `[title]`
}