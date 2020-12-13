// array = [
//     'join',
//     'leave',
//     'ping',
//     'say',
//     'video',
//     'play',
//     'next',
//     'queue',
//     'prev',
//     'autoplay',
//     'pause',
//     'resume',
//     'pop',
//     'remove',
//     'jump',
//     'lyrics',
//     'save',
//     'session',
//     'load',
//     'update',
//     'del',
//     'help',
//     'ftest'
// ]

// const fs = require('fs')

// for (let index = 0; index < array.length; index++) {
//     const element = array[index];
    
//     fs.open(`./commands/${element}.js`, 'w', function (err, file) {
//         if (err) throw err;
//     })
// }

// ##################################################
// const imports = require('./imports')
// Object.keys(imports).forEach(key => {
//     global[key] = imports[key]
// })
// console.log(utils)
// ##################################################
// let get_duration_seconds = (duration) => {
//     let a = duration.split(':')
//     if (a.length == 1) return (+a[0])
//     if (a.length == 2) return (+a[0]) * 60 + (+a[1])
//     if (a.length == 3) return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
// }
// var hms = '3:18';   // your input string
// console.log(get_duration_seconds(hms))
// ##################################################
// const ytdl = require('ytdl-core')
// ytdl.getInfo('https://www.youtube.com/watch?v=bo_efYhYU2A').then(info => {
//     // console.log(info.related_videos)
//     console.log(info.length_seconds)
// })
// ##################################################
// const ytsr = require('ytsr')
// ytsr('Lady Gaga - Look What I Found', { limit: 1 }).then(data=> {
//     console.log(data)
// })
// ##################################################
// let get_seek_bar = (duration, now, width=20) => {
//     let bar = '▬'.repeat(width)

//     let position = Math.min(Math.floor((now / duration) * width), width - 1)

//     bar = bar.substring(0, position) + '🔴' + bar.substring(position + 1)

//     return bar
// }

// console.log(get_seek_bar(200, 200))
// ##################################################
// let d = new Date(0)
// d.setHours(0, 0, 50)
// console.log(d.toTimeString())
// ##################################################
// music = require('musicmatch')({apikey:"d675c9f2563cc51703c82cc38209d179"})

// music.trackSearch({q_track: "billie bad guy"})
//     .then(function(data){
//         console.log(data.message.body.track_list[0].track)
//         music.trackLyrics({track_id: data.message.body.track_list[0].track.track_id})
//             .then(function(data){
//                 console.log(data.message.body.lyrics);
//             }).catch(function(err){
//                 console.log(err);
//         })
//     }).catch(function(err){
//         console.log(err)
//     })
// ##################################################
// var lyrics = require('node-lyrics');
 
// lyrics.getSong('', 'bad guy', function(err, data) {
//     if (err) {
//         // do something
//     }
//     console.log(data)
// });
// ##################################################
// let genius_api = require('genius-api')
// genius_api = new genius_api('Mann-9fKMJ5fOR5G9YMKFXOe7Yesi3iThj0DtOT32jpz2B-bewDkvACrAjBAbO6F')

// const jsdom = require("jsdom")
// const { JSDOM } = jsdom

// const axios = require('axios')
// let options = {
//     apiKey: 'Mann-9fKMJ5fOR5G9YMKFXOe7Yesi3iThj0DtOT32jpz2B-bewDkvACrAjBAbO6F', // genius developer access token
//     optimizeQuery: true
// }

// genius_api.search('قارئة الفنجان').then(function(response) {

//     console.log(response.hits[0].url)

//     url = response.hits[0].result.url

//     // let url = `https://api.genius.com/songs/${response.hits[0].result.id}?text_format=plain&access_token=${options.apiKey}`
//     console.log(url)
//     axios.get(url).then(res => {
//         const { window } = new JSDOM(res.data)
//         const $ = require( "jquery" )( window )
//         let page = $(window.document).find('.lyrics').text()
//         console.log(page)
//     })
    
// })
// ##################################################
// lyrics find قصاد عيني


// const solenolyrics= require("solenolyrics")
// solenolyrics.requestLyricsFor(encodeURI(`بنخاف`)).then(lyrics => {
//     console.log(lyrics)
// })

// transliteration.transliterate('دورك جاي')

// ##################################################
// const transliteration = require('transliteration')
// console.log(transliteration.transliterate('دورك جاي'))
// Ni Hao , world!
// console.log(transliteration.slugify('你好, world!'))