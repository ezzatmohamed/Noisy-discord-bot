module.exports = {
    name: ['next', 'n'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)
        if (player.queue.queue.length === 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `The queue is empty! add some fun 😊`,
        }, message)).send()

        const res = await player.next(true)
        if (res != 0) {
            await session.joinVoice(message.member.voice.channel)
            player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, true, res == -1 ? 'edit' : 'delete')
                await res_message.send()
            })
        } else if (player.queue.autoplay !== player.queue.AUTOPLAY_MODES.AUTOPLAY_OFF) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Can't add new tracks 🥺, can you?`,
        }, message)).send()
        else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Nothing is up next! add more tracks 😊`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}