module.exports = {
    name: ['fastforward', 'ff'],

    handler: async (message, args, session, bot) => {
        
        const played_time = session.voice.connection.dispatcher.totalStreamTime
        await message.react('👌')
    },

    description: `dump description`,

    usage: `[title]`
}