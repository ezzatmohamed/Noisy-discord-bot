const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    let mssg
    if (args != '') {

        if ((await state.load_session(message, args))) {
            if (state.get_player(message).dispatcher != null) {
                state.get_player(message).dispatcher.destroy();
                delete state.get_player(message).dispatcher;
                state.set_player(message, null, 1);
            }
            mssg = "Session is loaded"

            resume(message, args, bot, false)
        } else mssg = "Session is not found"

    } else {
        mssg = `Enter the session id`
    }

    await message.channel.send({ embed: utils.formatted_mssg(mssg) })
}