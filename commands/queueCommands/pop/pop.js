const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    let result = state.queue_pop(message, () => {
        next(message, "", bot)
    })

    if (result) await message.channel.send({ embed: utils.formatted_mssg(`Removed : ${result.title}`) })
    else await message.channel.send({ embed: utils.formatted_mssg("The Queue is already empty") })

    if (state.get_current_info(message)) {
        let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing : ${state.get_current_info(message).title}`) })
        state.set_now_playing_mssg(message, now_playing_mssg)
    }
}