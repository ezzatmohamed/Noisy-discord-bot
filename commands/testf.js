const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports =  async (message, args, bot) => {
    // console.log(state.get_player(message).dispatcher)
    // console.log(state.get_player(message).dispatcher)
    // const video_url = state.get_current_info(message)[1]
    // const stream = utils.audio_stream(video_url);
    // let dispatcher = message.guild.voice.connection.play(stream, { volume: 1, seek:120})

    
    // state.set_player(message, dispatcher, 1);
    // dispatcher.on("finish", () => {
    //     console.log("end");
    //     state.set_player(message, null, 1);
    //     next(message, "", bot);
    // });
    const Msg = {
        color: embedColor,
        title: `Now playing:`,

    };
    await message.channel.send({ embed: Msg });
}