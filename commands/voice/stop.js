module.exports = {
    name: ['stop'],

    handler: async (message, args, session, bot) => {
        
        const voice_controller = session.getVoiceController(message)

        if (await voice_controller.stop()) await message.react('👌')
        else await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Nothing to stop!`,
        }, message)).send()
    },

    description: `dump description`,

    usage: `[title]`
}