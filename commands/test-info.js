const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    console.log(args)
    const video_info = await utils.search(args);
    console.log(video_info)
    await message.channel.send(video_info['secs']);
}