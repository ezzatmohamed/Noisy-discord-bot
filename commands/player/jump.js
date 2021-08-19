module.exports = {
    name: ['jump', 'j'],

    handler: async (message, args, session, bot, verbose=true) => {

        const player = session.getPlayer(message)

        const res = !isNaN(Number(args)) && await player.jump(Number(args)-1)
        if (res) {
            await session.joinVoice(message.member.voice.channel)
            player.start(async (player) => {
                const res_message = await player.getResponseMessage(message, undefined, true, true, 'delete')
                await res_message.send()
            })
        } else return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Invalid track number! 🤔`,
        }, message)).send()
        
    },

    description: `dump description`,

    usage: `[title]`
}