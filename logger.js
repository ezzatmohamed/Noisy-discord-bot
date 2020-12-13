// // const fs = require('fs')

// // if (!fs.existsSync('./logs/')) {
// //     fs.mkdirSync('./logs/')
// // }

// class logger {

//     static #created = false
//     static #filename = ''

//     constructor () {
//         if (!logger.#created) {
//             // const date = (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '-')
//             // logger.#filename = `./logs/log-${date}.log`
//             logger.#created = true
            
//             // fs.open(logger.#filename, 'w', function (err, file) {
//             //     if (err) console.log(err)
//             // })
//         }
//     }

//     log(mssg, prefix='') {
//         const date = (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '')
//         // console.log(date + ' ::: ' + mssg)
//         // fs.appendFile(logger.#filename, date + ' ::: ' + mssg + '\n', (err) => {
//         //     if(err) return console.log(err)
//         // })
//     }
// }

// class singleton {

//     constructor() {
//         if (!singleton.instance) {
//             singleton.instance = new logger();
//         }
//     }
  
//     getInstance() {
//         return singleton.instance;
//     }
  
// }

// module.exports = (new singleton).getInstance()