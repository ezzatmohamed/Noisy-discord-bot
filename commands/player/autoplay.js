module.exports = {
    name: ['autoplay'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer()
        const mode = args.trim() === 'off' ? player.queue.AUTOPLAY_MODES.AUTOPLAY_OFF : 
            (args.trim() === 'queue' ? player.queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE : 
            (args.trim() === 'song' ? player.queue.AUTOPLAY_MODES.AUTOPLAY_SONG : undefined))
        player.queue.changeAutoplayMode(mode)
        const mode_name = player.queue.autoplay === player.queue.AUTOPLAY_MODES.AUTOPLAY_OFF ? 'Autoplay is off' : 
            (player.queue.autoplay === player.queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE ? 'Autoplay is on, related to the whole queue' : 
            (player.queue.autoplay === player.queue.AUTOPLAY_MODES.AUTOPLAY_SONG ? 'Autoplay is on, related to last song' : ''))
        return await (new bot.MessagesController.Message(message.channel, {
            description: `${mode_name}`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}