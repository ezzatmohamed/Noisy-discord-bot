const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    if (args == "") return await message.channel.send({ embed: utils.formatted_mssg("Enter a session name") })

    let queue = state.get_queue(message)
    let mssg
    if (queue.length == 0)
        mssg = "The queue is empty"
    else {
        if (await state.save_session(message, args))
            mssg = "Saved"
        else
            mssg = "This name is already used"
    }
    await message.channel.send({ embed: utils.formatted_mssg(mssg) })
}