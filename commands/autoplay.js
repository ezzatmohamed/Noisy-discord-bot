const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    state.toggle_autoplay(message)
    const autoplay_bool = state.get_autoplay(message)

    await message.channel.send({ 
        embed: utils.formatted_mssg(autoplay_bool ? "Autoplay is on" : "Autoplay is off") 
    })
}