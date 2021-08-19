module.exports = {
    name: ['future'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)
        if (player.queue.queue.length === 0) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `The queue is empty! add some fun 😊`,
        }, message)).send()

        const res = await player.addRelated()
        if (res != undefined) {
            const res_message = await player.getResponseMessage(message, [res], false, true, 'off')
            await res_message.send()
        } else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Can't add new tracks 🥺, can you?`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}