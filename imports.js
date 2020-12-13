const utils = require("./utils")
const state = require("./state")
const path = require('path')
const glob = require('glob')
const embedColor = 0xCB0000

modules = {
    utils,
    state,
    embedColor
}

glob.sync('commands/**/*.js').map(file=>{
    let fileWithoutPath = path.basename(file)
    let command = fileWithoutPath.substring(0, fileWithoutPath.lastIndexOf('.'))
    if (command.startsWith('test') && process.env.DEV != '1') return
    modules[command] = require('./'+file)
  
})

module.exports = modules