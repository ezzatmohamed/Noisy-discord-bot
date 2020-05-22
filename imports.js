const utils = require("./utils")
const state = require("./state")
const logger = require('./logger')
const embedColor = 0xCB0000

modules = {
    utils,
    state,
    logger,
    embedColor
}

let commands_path = require("path").join(__dirname, "commands");
require("fs").readdirSync(commands_path).forEach(function(file) {
    let command = file.substring(0, file.lastIndexOf('.'))
    modules[command] = require('./commands/' + file)
})

module.exports = modules