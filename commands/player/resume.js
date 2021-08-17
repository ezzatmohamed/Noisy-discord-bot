module.exports = {
    name: ['resume'],

    handler: async (message, args, session, bot) => {
        
        await session.voice.connection.dispatcher.resume()
        await message.react('👌')
    },

    description: `dump description`,

    usage: `[title]`
}