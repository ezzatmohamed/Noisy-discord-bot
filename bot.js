require('dotenv').config()
require('./defines')
const db = require('./database')

const Discord = require('discord.js')
const SessionsController = require('./sessions')
const CommandsController = require('./commands')
const MessagesController = require('./messages')

/**
 * * Create the bot
 */
require('discord-reply')
const bot = new Discord.Client({
    intents: [
      Discord.GatewayIntentBits.DirectMessages,
      Discord.GatewayIntentBits.Guilds,
      Discord.GatewayIntentBits.GuildBans,
      Discord.GatewayIntentBits.GuildMessages,
      Discord.GatewayIntentBits.MessageContent,
    ]
})
require('discord-buttons')(bot)
bot.MessagesController = new MessagesController(bot)
bot.SessionsController = new SessionsController(bot)
bot.CommandsController = new CommandsController(bot)

/**
 * * Start
 */
db().then(() => bot.login(process.env.TOKEN) ).catch(error => console.error(error) )
bot.on('ready', () => console.log(`Logged in as ${bot.user.tag}!`))

module.exports = bot