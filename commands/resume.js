const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot, verbose = true) => {
    const dispatcher = state.get_player(message).dispatcher;
    if (dispatcher == null) {
        let queue = state.get_queue(message)
        let current = state.get_current(message)

        if (current >= queue.length)
            state.set_current(message, 0)

        state.play_current(message, () => {
            next(message, '', bot)
        })
    } else dispatcher.resume()
    
    if (verbose && state.get_current_info(message)) await message.channel.send({ embed: utils.formatted_mssg(`Resumed`) })
}