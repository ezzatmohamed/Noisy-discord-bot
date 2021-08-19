module.exports = {
    name: ['previous', 'prev'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)
        if (player.queue.queue.length === 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `The queue is empty! add some fun 😊`,
        }, message)).send()

        const res = await player.previous(true)
        console.log(player.queue.current)
        if (res) {
            await session.joinVoice(message.member.voice.channel)
            player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, true, 'delete')
                await res_message.send()
            })
        } else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Nothing is before!`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}