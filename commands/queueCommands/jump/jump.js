const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async(message, args, bot) => {
    let queue = state.get_queue(message);
    if (queue === undefined || queue.length == 0)
        return await message.channel.send({ embed: utils.formatted_mssg("The Queue is already empty") });

    let idx = Number(args) - 1;
    if (isNaN(idx))
        return await message.channel.send({ embed: utils.formatted_mssg("invalid use of command jump\ncommand : jump [number]") });

    let current_song_info = state.get_idx_url(message, idx);

    if (current_song_info == null)
        return await message.channel.send({ embed: utils.formatted_mssg("Invalid number") });

    state.play_current(message, () => {
        next(message, "", bot);
    })

    let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing: ${current_song_info.title}`) });
    state.set_now_playing_mssg(message, now_playing_mssg)

}