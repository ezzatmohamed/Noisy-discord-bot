const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    
    const video_info = await utils.search(args);
    if (video_info == null)
        return await message.channel.send({ embed: utils.formatted_mssg('Can\'t find this song!') });

    state.add_song(message, video_info);
    if (state.get_player(message).dispatcher == null) {
        state.get_next_info(message)
        state.play_current(message, () => {
            next(message, "", bot)
        })
        
        let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing: ${video_info.title}`) });
        state.set_now_playing_mssg(message, now_playing_mssg)

    } else {
        await message.channel.send({ embed: utils.formatted_mssg(`Queued: ${video_info.title}`) });
    }
}