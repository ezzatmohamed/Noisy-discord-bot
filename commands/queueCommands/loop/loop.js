const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    let loop = state.get_loop(message)

    let loop_mssgs = [
        '➡️     Loop is off',
        '🔁     Loop all songs',
        '🔂     Loop current song'
    ]

    await message.channel.send({ embed: utils.formatted_mssg(`${loop_mssgs[loop]}`) }).then(msg => {

        msg.react('➡️')
        msg.react('🔁')
        msg.react('🔂')

        locker = false

        let reactions_callback = async (reaction, user) => {
            if (user.bot) return
            
            if (reaction.message.id != msg.id) return

            
            if (locker) return await message.channel.send({ embed: utils.formatted_mssg(`You must wait a little!`) })

            locker = true

            setTimeout(function() {
                locker = false
            }, 1000)

            switch (reaction.emoji.name) {
                case '➡️':
                    state.set_loop(message, 0)
                    loop = state.get_loop(message)
                    msg.edit({ embed: utils.formatted_mssg(`${loop_mssgs[loop]}`) })
                    break
                case '🔁':
                    state.set_loop(message, 1)
                    loop = state.get_loop(message)
                    msg.edit({ embed: utils.formatted_mssg(`${loop_mssgs[loop]}`) })
                    break
                case '🔂':
                    state.set_loop(message, 2)
                    loop = state.get_loop(message)
                    msg.edit({ embed: utils.formatted_mssg(`${loop_mssgs[loop]}`) })
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
    })


}
