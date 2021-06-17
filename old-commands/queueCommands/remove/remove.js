const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    let queue = state.get_queue(message);
    if (queue === undefined || queue.length == 0) 
        return await message.channel.send({ embed: utils.formatted_mssg("The Queue is already empty") });

    let idx = Number(args) - 1;
    if (isNaN(idx))
        return await message.channel.send({ embed: utils.formatted_mssg("invalid use of command remove\ncommand : remove [number]") });

    let result = state.queue_remove(message, idx, () => {
        next(message, "", bot)
    })

    if (result) await message.channel.send({ embed: utils.formatted_mssg(`removed : ${result.title}`) });
    else await message.channel.send({ embed: utils.formatted_mssg("Invalid number") });

        
    if (state.get_current_info(message)) {
        let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing : ${state.get_current_info(message).title}`) })
        state.set_now_playing_mssg(message, now_playing_mssg)
    }
}