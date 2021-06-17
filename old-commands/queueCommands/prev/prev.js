const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    const song_info = state.get_previous_info(message);

    if (song_info == null)
        return await message.channel.send({ embed: utils.formatted_mssg("No previous songs!") });
    
    state.play_current(message, () => {
        next(message, "", bot);
    })

    let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing: ${song_info.title}`) });
    state.set_now_playing_mssg(message, now_playing_mssg)
}