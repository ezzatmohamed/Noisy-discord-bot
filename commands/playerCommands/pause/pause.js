const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot, verbose=true) => {
    const dispatcher = state.get_player(message).dispatcher;
    dispatcher.pause();

    if (verbose) await message.channel.send({ embed: utils.formatted_mssg(`Paused`) });
}