const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async(message, args, bot) => {
    const song_info = await utils.searchAll(args);
    if (song_info == null)
        return await message.channel.send({ embed: utils.formatted_mssg('No result!') });

    let fields = []
    let idx = 1
    song_info.forEach((song) => {

        let field = {
            value: `${idx} - ${song.title}`,
            name: '\u200B',
            inline: false,
        }
        fields.push(field)
        idx++
    })

    return await message.channel.send({
        embed: utils.formatted_mssg("Search result for: " + args, fields, false)
    })

}