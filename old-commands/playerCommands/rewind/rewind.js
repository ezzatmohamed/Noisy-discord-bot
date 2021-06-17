const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot, verbose = true) => {


    await message.channel.send({ embed: utils.formatted_mssg(`This command is under maintenance`) })
    return 
    
    if (isNaN(Number(args))) await message.channel.send({ embed: utils.formatted_mssg(`Invalid seconds`) })

    state.rewind(message, Number(args), () => {
        next(message, '', bot)
    })
    
    if (verbose && state.get_current_info(message)) await message.channel.send({ embed: utils.formatted_mssg(`rewined`) })
}