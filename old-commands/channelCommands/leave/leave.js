const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    if (!message.guild.voice.connection) {
        await message.channel.send({ embed: utils.formatted_mssg("You must be in a voice channel!") });
    } else {
        await message.guild.voice.connection.disconnect();
        await message.channel.send({ embed: utils.formatted_mssg('Bye!') });
        // logger.log(`leave "${message.guild.name}#${message.guild.id}"`)
        state.remove_song_message(message)
        state.remove_server(message);
    }
}