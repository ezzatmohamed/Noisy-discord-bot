const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    state.remove_song_message(message)
    
    let current_info = state.get_current_info(message)

    if (!current_info) return await message.channel.send({ embed: utils.formatted_mssg(`Nothing is playing`) })

    let width = 20
    let step = current_info.secs / width
    step = 2

    let seek_bar = state.get_current_seek_bar(message, width)
    message.channel.send({ embed: utils.formatted_mssg(`${current_info.title}\n${seek_bar}`) }).then(msg => {

        let interval = setInterval(() => {
            let seek_bar = state.get_current_seek_bar(message, width)
            if (seek_bar) msg.edit({ embed: utils.formatted_mssg(`${current_info.title}\n${seek_bar}`) })
        }, step * 1000);
        state.set_song_message(message, msg,  interval)

        msg.react('⏪')
        msg.react('▶️')
        msg.react('⏸️')
        msg.react('⏩')

        locker = false

        let reactions_callback = async (reaction, user) => {
            if (user.bot) return
            
            if (reaction.message.id != msg.id) return

            
            if (locker) return await message.channel.send({ embed: utils.formatted_mssg(`You must wait a little!`) })

            locker = true

            setTimeout(function() {
                locker = false
            }, 1000)

            let seek_bar
            switch (reaction.emoji.name) {
                case '⏪':
                    await rewind(message, 20, bot, false)
                    seek_bar = state.get_current_seek_bar(message, width)
                    if (seek_bar) msg.edit({ embed: utils.formatted_mssg(`${current_info.title}\n${seek_bar}`) })
                    break
                case '▶️':
                    resume(message, '', bot, false)
                    break
                case '⏸️':
                    pause(message, '', bot, false)
                    break
                case '⏩':
                    await fastforward(message, 20, bot, false)
                    seek_bar = state.get_current_seek_bar(message, width)
                    if (seek_bar) msg.edit({ embed: utils.formatted_mssg(`${current_info.title}\n${seek_bar}`) })
                    break
                default:
                    break
            }
            
        }

        bot.on('messageReactionRemove', reactions_callback)
        bot.on('messageReactionAdd', reactions_callback)
    })


}
