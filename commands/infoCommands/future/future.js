const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    const queue = state.get_queue(message);

    if (queue.length == 0) return await message.channel.send({ embed: utils.formatted_mssg(`The queue is empty!`) });

    const old_url = queue[queue.length - 1].link

    if (!state.get_autoplay(message)) return await message.channel.send({ embed: utils.formatted_mssg(`Autoplay is off`) });

    let related_videos = await utils.related_videos(old_url, state.get_queue_urls(message));
    
    if (related_videos.length == 0) return await message.channel.send({ embed: utils.formatted_mssg(`Can't find related song`) })
    
    song_info = await utils.search(related_videos[0])
    state.add_song(message, song_info);
    
    await message.channel.send({ embed: utils.formatted_mssg(`Queued: ${song_info.title}`) })
}