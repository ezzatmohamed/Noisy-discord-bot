require('dotenv').config()
const Discord = require('discord.js')
const bot = new Discord.Client()
const reactionHandlers = require('./reactions')
const mongoose = require('mongoose')
const TOKEN = process.env.TOKEN
const PREFIX = process.env.PREFIX
const DB_URL = process.env.DB_URL
const path = require('path')
const glob = require('glob')

let handlers = {}
glob.sync('commands/**/*.js').map(file =>{
    
    let fileWithoutPath = path.basename(file)
    let command = fileWithoutPath.substring(0, fileWithoutPath.lastIndexOf('.'))
    if (command.startsWith('test') && process.env.DEV != '1') return
    handlers[command] = require('./'+file)
})




bot.on('ready', () => {})

let locker = false

bot.on('message', async(message) => {

    if (!message.guild) return
    if (message.author.bot) return
    if (message.content.indexOf(PREFIX) !== 0) return

    if (locker) return await message.channel.send({ embed: utils.formatted_mssg(`You must wait a little!`) })

    locker = true

    setTimeout(function() {
        locker = false
    }, 500)
    

    const idx_from = message.content.indexOf(PREFIX) + PREFIX.length
    let idx_to = message.content.indexOf(' ')
    idx_to = idx_to === -1 ? message.content.length : idx_to
    const command = message.content.substring(idx_from, idx_to)
    const args = message.content.substring(idx_to + 1, message.content.length)
    if (!handlers[command]) return

    if (command != 'join') {
        let joined = await handlers['join'](message, args, bot, false)
    }

    state.remove_song_message(message)

    handlers[command](message, args, bot).then(() => {
        // logger.log(`############ End`)
    }).catch(err => {
        // logger.log(err)
        // logger.log(`############ End with error`)
    })

});
bot.on('messageReactionAdd', async(reaction, user) => {
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            // logger.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    const info = reaction.users.cache
    const LastUser = Array.from(info)[info.size - 1][1]
    if (LastUser['bot'])
        return

    if (!reaction.message.embeds[0]) return
    const title = reaction.message.embeds[0]['title']
    const description = reaction.message.embeds[0]['description']
    const fields = reaction.message.embeds[0]['fields']

    if (description == "XO Game") {
        reactionHandlers['XOGame'](reaction.message, bot, reaction.emoji['name'], LastUser)

    }

});

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    bot.login(TOKEN)
}).catch(error => {
})