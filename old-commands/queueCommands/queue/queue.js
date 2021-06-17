const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    let max_songs = 8
    let page = Math.floor(state.get_current(message) / max_songs)
    let queue_fields = state.get_queue_fields(message, page, max_songs)

    if (!queue_fields) return await message.channel.send({ embed: utils.formatted_mssg("The queue is empty\n") })
    
    message.channel.send({ embed: utils.formatted_mssg(`Music Queue: Page ${page + 1}`, queue_fields, false) }).then((msg) => {
        if (state.get_queue(message).length <= max_songs) return

        msg.react("⬆️")
        msg.react("⬇️")

        let locker = false

        let reactions_callback = async(reaction, user) => {
            if (user.bot) return

            if (reaction.message.id != msg.id) return

            if (locker) return await message.channel.send({ embed: utils.formatted_mssg(`You must wait a little!`) })

            locker = true

            setTimeout(function() {
                locker = false
            }, 1000)

            let queue_fields
            switch (reaction.emoji.name) {
                case '⬆️':
                    page -= 1
                    queue_fields = state.get_queue_fields(message, page, max_songs)
                    if (queue_fields) msg.edit({ embed: utils.formatted_mssg(`Music Queue: Page ${page + 1}`, queue_fields, false) })
                    else page += 1
                    break
                case '⬇️':
                    page += 1
                    queue_fields = state.get_queue_fields(message, page, max_songs)
                    if (queue_fields) msg.edit({ embed: utils.formatted_mssg(`Music Queue: Page ${page + 1}`, queue_fields, false) })
                    else page -= 1
                    break
                default:
                    break
            }

        }

        bot.on('messageReactionRemove', reactions_callback)
        bot.on('messageReactionAdd', reactions_callback)

        setTimeout(function() {
            msg.reactions.removeAll()
            bot.removeListener('messageReactionRemove', reactions_callback)
            bot.removeListener('messageReactionAdd', reactions_callback);
        }, 60000)
    });
}