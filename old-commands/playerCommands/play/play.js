const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    
    const result = await utils.search(args);
    if (result == null)
        return await message.channel.send({ embed: utils.formatted_mssg('Can\'t find this song!') });

    let video_info = null
    const is_playlist = Array.isArray(result)

    if( is_playlist) {
        await message.channel.send({ embed: utils.formatted_mssg(`Queued: ${result.length} tracks`) });
        video_info = result[0]
        for (let i = 0; i < result.length; i++) {
            state.add_song(message, result[i]);
        }
    } else {
        video_info = result
        state.add_song(message, video_info);
    }
            
    if (state.get_player(message).dispatcher == null) {
        
        if( is_playlist ) {
            state.set_current(message, -1)
        }

        state.get_next_info(message)
        state.play_current(message, () => {
            next(message, "", bot)
        })

        let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing: ${video_info.title}`) });
        state.set_now_playing_mssg(message, now_playing_mssg)

    } else if(!is_playlist) {
        await message.channel.send({ embed: utils.formatted_mssg(`Queued: ${video_info.title}`) });
    }
}