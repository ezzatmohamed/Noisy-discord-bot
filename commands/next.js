const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    const old_url = state.get_current_info(message).link;
    let song_info = state.get_next_info(message);

    state.remove_song_message(message)

    if (song_info == null && !state.get_autoplay(message))
        return await message.channel.send({ embed: utils.formatted_mssg(`No More Songs in the queue`) });
    else if (song_info == null) {
        let related_videos = await utils.related_videos(old_url, state.get_queue_urls(message));
        
        if (related_videos.length == 0) return await message.channel.send({ embed: utils.formatted_mssg(`Can't find related song`) })
        // console.log(related_videos)
        song_info = await utils.search(related_videos[0])
        state.add_song(message, song_info);
        song_info = state.get_next_info(message);
    }

    state.play_current(message, () => {
        next(message, "", bot);
    })
    
    let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing: ${song_info.title}`) });
    state.set_now_playing_mssg(message, now_playing_mssg)
}