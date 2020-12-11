const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    
    const video_info = await utils.search(args);
    
    await message.channel.send(video_info['secs']);
}