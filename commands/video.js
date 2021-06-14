const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    const video_info = await utils.search(args);
    const video_url = video_info.url;
    if (video_url == null) {
        // logger.log(`song not found`)
        video_url = "Can't find this song!"
    }
    await message.channel.send(video_url);
}