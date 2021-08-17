module.exports = {
    name: ['pause'],

    handler: async (message, args, session, bot) => {
        
        await session.voice.connection.dispatcher.pause()
        await message.react('👌')
    },

    description: `dump description`,

    usage: `[title]`
}