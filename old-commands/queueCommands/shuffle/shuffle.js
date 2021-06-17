const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async(message, args, bot) => {
    let queue = state.get_queue(message);
    const current_idx = state.get_current(message);
    let length = queue.length

    if (length < 2)
        return await message.channel.send({ embed: utils.formatted_mssg("Can't shuffle the queue\n") })


    for (let i = 0; i < length; i++) {
        let randIdx = Math.floor(Math.random() * length)

        if (i == current_idx)
            state.set_current(message, randIdx)

        let temp = queue[randIdx]
        queue[randIdx] = queue[i]
        queue[i] = temp
    }
    return await message.channel.send({ embed: utils.formatted_mssg("Shuffled the queue\n") })
}