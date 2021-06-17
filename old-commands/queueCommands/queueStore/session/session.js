const imports = require('../../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    if (args != '') {
        let session = await state.get_session(message, args)

        if (!session) return await message.channel.send({ embed: utils.formatted_mssg("Session is not found") })

        let max_songs = 10
        let page = Math.floor(session.current / max_songs)
        let queue = session.queue
        queue = queue.slice(page * max_songs, page * max_songs + max_songs)
        let queue_fields = utils.get_queue_fields(queue, session.current, page * max_songs)
        
        if (!queue_fields) return await message.channel.send({ embed: utils.formatted_mssg(`Session ${args} Queue empty`) })
        
        await message.channel.send({ embed: utils.formatted_mssg(`Session ${args} Queue: Page ${page + 1}`, queue_fields, false) }).then((msg) => {
            if (session.queue.length <= max_songs) return

            msg.react("⬆️")
            msg.react("⬇️")
            
            let locker = false

            let reactions_callback = async (reaction, user) => {
                if (user.bot) return
                
                if (reaction.message.id != msg.id) return

                if (locker) return await message.channel.send({ embed: utils.formatted_mssg(`You must wait a little!`) })

                locker = true

                setTimeout(function() {
                    locker = false
                }, 1000)
                
                let queue
                let queue_fields
                let no_pages
                switch (reaction.emoji.name) {
                    case '⬆️':
                        page -= 1
                        queue = session.queue
                        no_pages = Math.ceil(queue.length / max_songs)
                        if (page >= no_pages || page < 0) return null
                        queue = queue.slice(page * max_songs, page * max_songs + max_songs)
                        queue_fields = utils.get_queue_fields(queue, session.current, page * max_songs)
                        if (queue_fields) msg.edit({ embed: utils.formatted_mssg(`Music Queue: Page ${page + 1}`, queue_fields, false) })
                        else page += 1
                        break
                    case '⬇️':
                        page += 1
                        queue = session.queue
                        no_pages = Math.ceil(queue.length / max_songs)
                        if (page >= no_pages || page < 0) return null
                        queue = queue.slice(page * max_songs, page * max_songs + max_songs)
                        queue_fields = utils.get_queue_fields(queue, session.current, page * max_songs)
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
    } else {
        let sessions = await state.get_session(message)

        let sessions_fields = []
        for (let idx = 0; idx < sessions.length; idx++) {
            const session = sessions[idx];

            sessions_fields.push([{
                name: '\u200B',
                value: session.name,
                inline: true
            }, {
                name: '\u200B',
                value: `${session.queue.length} Track(s)`,
                inline: true
            }, {
                name: '\u200B',
                value: `Autoplay is ${session.autoplay ? 'on' : 'off'}`,
                inline: true
            }])
        }

        if (sessions.length == 0) await message.channel.send({ embed: utils.formatted_mssg("There are no saved queues") })
        else await message.channel.send({ embed: utils.formatted_mssg(`Saved sessions`, sessions_fields, false) })
    }
}