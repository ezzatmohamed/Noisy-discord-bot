const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    if (args == '') {
        args = state.get_current_info(message).title
        if (!args) return await message.channel.send({ embed: utils.formatted_mssg("Enter the song name\n") })
    }

    let lyrics = await utils.get_lyrics(args)

    if (!lyrics) return await message.channel.send({ embed: utils.formatted_mssg("Can't find the lyrics\n") })

    lyrics_pages = []
    
    let max_char = 1024

    let pointer
    while (lyrics.length) {
        pointer = max_char - 1
        if (pointer > lyrics.length) pointer = lyrics.length - 1
        else {
            for (; pointer >= 0; pointer--) {
                if (lyrics[pointer] == '\n') break
            }
        }
        lyrics_pages.push(lyrics.substring(0, pointer + 1))
        lyrics = lyrics.substring(pointer + 1)
    }


    let page = 0

    let field = {}
    field[`${args} page ${page + 1} / ${lyrics_pages.length}`] = lyrics_pages[page]
    message.channel.send({ embed: utils.formatted_mssg(`Lyrics`, field) }).then((msg) => {
        if (lyrics_pages.length <= 1) return

        msg.react("⬆️")
        msg.react("⬇️")
        
        let locker = false

        let reactions_callback = async (reaction, user) => {
            if (user.bot) return
            
            if (reaction.message.id != msg.id) return

            if (locker) return await message.channel.send({ embed: utils.formatted_mssg(`You must wait a little!`) })

            locker = true

            setTimeout(function() {
                locker = false
            }, 1000)
            
            switch (reaction.emoji.name) {
                case '⬆️':
                    page = Math.max(0, page - 1)
                    console.log(page)
                    field = {}
                    field[`${args} page ${page + 1} / ${lyrics_pages.length}`] = lyrics_pages[page]
                    msg.edit({ embed: utils.formatted_mssg(`Lyrics`, field) })
                    break
                case '⬇️':
                    page = Math.min(page + 1, lyrics_pages.length - 1)
                    console.log(page)
                    field = {}
                    field[`${args} page ${page + 1} / ${lyrics_pages.length}`] = lyrics_pages[page]
                    msg.edit({ embed: utils.formatted_mssg(`Lyrics`, field) })
                    break
                default:
                    break
            }
            
        }

        bot.on('messageReactionRemove', reactions_callback)
        bot.on('messageReactionAdd', reactions_callback)

        setTimeout(function() {
            msg.reactions.removeAll()
            bot.removeListener('messageReactionRemove', reactions_callback)
            bot.removeListener('messageReactionAdd', reactions_callback);
        }, 60000)
    });
}