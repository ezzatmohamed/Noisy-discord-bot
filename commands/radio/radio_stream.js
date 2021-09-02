module.exports = {
    name: ['radio_stream'],
    private: true,

    handler: async (message, args, session, bot) => {

        await session.joinVoice(message.member.voice.channel)
        const radio = session.getRadio(message)
        
        await session.setVoiceController(radio)
        const radio_channel = await radio.start(Number(args)-1)
        if (radio_channel) await (new bot.MessagesController.Message(message.channel, {
            description: `Now, you're listening to **${radio_channel.name}** 📻`,
        }, message)).send()
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Invalid radio number 😟`,
        }, message)).send()
    },

    description: `dump description`,

    usage: `[title]`
}