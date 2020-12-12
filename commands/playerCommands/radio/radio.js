
console.log('imported')
const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

const radio_channels = {
    "nagham" : "https://ahmsamir.radioca.st/stream",
    "nogom": "https://reach-audio.esteam.rocks/radio/8000/live.mp3",
    "nile": "https://reach-audio.esteam.rocks/radio/8010/live.mp3",
    "masr": "https://live.radiomasr.net/RADIOMASR"
}

const channelsName = [

    {name:'2- nogomFM',value:".radio nogom"},
    {name:'1- naghamFM',value:".radio nagham"},
    {name:'3- nileFM',value:".radio nile"},
    {name:'4- radioMASR',value:".radio masr"},

]

module.exports = async (message, args, bot) => {
    
    if(args == '')
    {
        await message.channel.send({ embed: utils.formatted_mssg(`Available Radio Stations.`, channelsName, false) })
    }
    else{
        const channel = args.split(' ')[0]
        
        if(radio_channels[channel] !== undefined)
        {
            const audio_stream =  radio_channels[channel]
            state.play_radio(message,audio_stream)
            let now_playing_mssg = await message.channel.send({ embed: utils.formatted_mssg(`Now playing: radio ${channel}`) });
            state.set_now_playing_mssg(message, now_playing_mssg)    
        }
        else{
            await message.channel.send({ embed: utils.formatted_mssg(`Radio Channel doesn't exist!`) });
        }
        
    }


}