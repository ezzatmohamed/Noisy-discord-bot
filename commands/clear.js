const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {
    state.clear_queue(message)

    await message.channel.send({ 
        embed: utils.formatted_mssg(`The queue is cleared`) 
    })
}