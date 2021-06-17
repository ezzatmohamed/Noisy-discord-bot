module.exports = {
    name: ['dump', 'd'],

    handler: async (message, args, session, bot) => {
        await bot.MessagesController.send(message.channel, args)
    },

    description: `dump description`,

    usage: `[title]`
}