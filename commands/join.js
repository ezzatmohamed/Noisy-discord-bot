const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot, verbose = true) => {
    if (message.member.voice.channel) {
        if (!message.guild.voice || !message.guild.voice.connection) {
            await message.member.voice.channel.join();

            await message.guild.voice.setSelfDeaf(true)

            // logger.log(`join "${message.guild.name}#${message.guild.id}"`)

            if (verbose) {
                await message.channel.send({ embed: utils.formatted_mssg('Hello') }).then((msg) => {
                    msg.react('🍊')
                });
            }

            state.add_server(message);
        }
        return true
    } else {
        await message.channel.send({ embed: utils.formatted_mssg("You must be in a voice channel!") }).then((msg) => {
            msg.react('🍊')
        });
        return false
    }
};