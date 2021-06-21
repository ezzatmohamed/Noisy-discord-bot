module.exports = {
    name: ['leave', 'bye', 'die'],

    handler: async (message, args, session, bot) => {
        const leave_result = await session.leaveVoice(message.member.voice.channel)
        
        if (leave_result === 0) await message.react('🚶')
        else if (leave_result === -1) await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `I'm not here already 🥺`,
        })).send()
        else if (leave_result === 1) await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `You must be in the same channel`,
        })).send()
    },

    description: `dump description`,

    usage: `[title]`
}