const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports =  async (message, args, bot) => {
    const Msg = {
        color: embedColor,
        title: `Now playing:`,

    };
    await message.channel.send({ embed: Msg });
}