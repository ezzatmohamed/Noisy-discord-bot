const imports = require('../../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    let mssg
    if (args != '') {

        if ((await state.delete_session(message, args))) 
            mssg = utils.formatted_mssg("Session is deleted") 
        else
            mssg = utils.formatted_mssg("Session is not found") 

    } else {
        mssg = utils.formatted_mssg("Enter the session id")
    }
    
    await message.channel.send({ 
        embed: mssg
    })
}