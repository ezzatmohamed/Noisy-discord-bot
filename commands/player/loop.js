module.exports = {
    name: ['loop', 'l'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)
        const mode = args.trim() === 'off' ? player.queue.LOOP_MODES.LOOP_OFF : 
            (args.trim() === 'queue' ? player.queue.LOOP_MODES.LOOP_QUEUE : 
            (args.trim() === 'song' ? player.queue.LOOP_MODES.LOOP_SONG : undefined))
        player.queue.changeLoopMode(mode)
        const mode_name = player.queue.loop === player.queue.LOOP_MODES.LOOP_OFF ? 'Loop is off' : 
            (player.queue.loop === player.queue.LOOP_MODES.LOOP_QUEUE ? 'Loop queue 🔁' : 
            (player.queue.loop === player.queue.LOOP_MODES.LOOP_SONG ? 'Loop current song 🔂' : ''))
        return await (new bot.MessagesController.Message(message.channel, {
            description: `${mode_name}`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}