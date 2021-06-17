const imports = require('../../../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

const commands = [
    ['join', 'joins your voice chat channel if you are connected. Usage: .join'],
    ['leave', 'leaves your voice chat channel . Usage: .leave'],
    ['video', 'Searches online for a video with the specified title. Usage: .video [title]'],
    ['search', 'Searches for most related tracks of the specified search term. Usage: .search [title]'],
    ['play', 'Adds the specified song to the music queue and plays it if the player is available. Usage: .play [track] '],
    ['next', 'Skips to the next song. Usage: .next'],
    ['previous', 'Skips to the previous song. Usage: .prev'],
    ['queue', 'Displays the current queue. Usage: .queue'],
    ['shuffle', 'Shuffles the current queue. Usage: .shuffle'],
    ['autoplay', 'Plays related songs if there\'s no next song. Usage: .autoplay'],
    ['pause', 'Pauses the current song. Usage: .pause'],
    ['loop', 'Displays options to loop the current track/loop the current queue/disable loop . Usage: .loop'],
    ['fastforward', 'Fastforwards the current track with the specified seconds. Usage: .fastforward [seconds]'],
    ['rewinds', 'Rewinds the current track with the specified seconds. Usage: .rewind [seconds]'],
    ['song', 'Displays real-time info about the current playing track with options to pause/resume/fastforward/rewind . Usage: .song'],
    ['pop', 'Removes the last song from the queue. Usage: .pop'],
    ['remove', 'Removes the specified song from the queue. Usage: .remove [song number]'],
    ['clear', 'Removes all tracks from the queue. Usage: .clear'],
    ['jump', 'Skips to the specified song. Usage: .jump [song number] '],
    ['lyrics', 'Displays the lyrics of the specified song. Usage: .lyrics [name]'],
    ['save', 'Saves the current queue with the specified name. Usage: .save [name]'],
    ['session', 'List all the saved queues. Usage: .session'],
    ['load', 'Loads the specified queue. Usage: .load [name]'],
    ['update', 'Updates the specified saved queue with the current queue. Usage: .update [name]'],
    ['del', 'Deletes the specified saved queue. Usage: .del [name]'],
    ['XO Game', 'Playing XO game with another user. Usage: .xo @mention'],
]

module.exports = async(message, args, bot) => {

    let command = null
    let details = null
    let field = null
    let Fields = []

    commands.forEach(Element => {

        command = Element[0]
        details = Element[1]

        field = {
            name: command,
            value: details,
            inline: false
        }
        Fields.push(field)

    });
    let max_commands = 13

    let pages = []
    let start = 0
    let end = max_commands + 1
    while (start < Fields.length) {
        pages.push([Fields.slice(start, end)])
        start = end
        end = end + max_commands
    }


    // const page1_fields = Fields.slice(0, max_commands + 1)

    let page = 0
    await message.channel.send({
        embed: utils.formatted_mssg(`Commands : Page ${page+1}`, pages[page], false)
    }).then((msg) => {

        if (pages.length <= 1) return

        msg.react("⬆️")
        msg.react("⬇️")

        let locker = false

        let reactions_callback = async(reaction, user) => {
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
                    msg.edit({ embed: utils.formatted_mssg(`Commands : Page ${page+1}`, pages[page], false) })
                    break
                case '⬇️':
                    page = Math.min(pages.length - 1, page + 1)
                    msg.edit({ embed: utils.formatted_mssg(`Commands : Page ${page+1}`, pages[page], false) })
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
    })
}