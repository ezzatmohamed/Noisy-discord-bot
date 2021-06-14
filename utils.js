const ytdl = require('discord-ytdl-core')
const ytsr = require('ytsr')
// const logger = require('./logger')
const embedColor = 0xCB0000
const solenolyrics= require("solenolyrics")

let get_duration_seconds = (duration) => {
    let a = duration.split(':')
    if (a.length == 1) return (+a[0])
    if (a.length == 2) return (+a[0]) * 60 + (+a[1])
    if (a.length == 3) return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
}

let get_seconds_duration = (seconds) => {
    let date = new Date()
    date.setHours(0, 0, seconds)
    let date_string = date.toTimeString().substring(0, 8)
    if (date_string.substring(0, 2) == '00') date_string = date_string.substring(3)
    return date_string
}

let search = async(query) => {
    // logger.log(`search about "${query}"`)
    const data = await ytsr(query, { limit: 10 })

    data.items = data.items.filter((item) => {
        return item['type'] == 'video';
    })

    data.items = data.items.map((item) => {

        let secs = get_duration_seconds(item['duration'])
        return {
            "title": item.title,
            "url": item.url,
            "duration": item.duration,
            "secs": secs
        }
    })
    
    if (data.items.length === 0) return null

    return data.items[0]
}

let searchAll = async(query) => {
    // logger.log(`search all about "${query}"`)
    const data = await ytsr(query, { limit: 10, type: 'video' })
    data.items = data.items.filter((item) => {
        return item['type'] == 'video';
    })
    if (data.items.length === 0) return null
    return data.items
}

let audio_url = async(url) => {
    // logger.log(`get audio link "${url}"`)
    let info = await ytdl.getInfo(url)
    let format = ytdl.chooseFormat(info.formats, {
        filter: "audioonly",
        opusEncoded: true,
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    })

    return format.url
}

let audio_stream = (url) => {
    // logger.log(`get audio stream "${url}"`)
    return ytdl(url, {
        filter: "audioonly",
        opusEncoded: true,
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    })
}

let related_videos = async(url, exclude = []) => {
    // logger.log(`get related videos "${url}" exclude ${exclude.length}`)
    let info = await ytdl.getInfo(url)
    let related_videos = info.related_videos
    let related_videos_urls = []
    for (let index = 0; index < related_videos.length; index++) {
        const video = related_videos[index]
        const video_url = `https://www.youtube.com/watch?v=${video.id}`
        if (!exclude.includes(video_url))
            related_videos_urls.push(video_url)
    }
    // logger.log(`get related videos "${url}" ${related_videos_urls.length} found`)
    return related_videos_urls
}
let get_lyrics = async(song) => {
    // logger.log(`get lyrics "${song}"`)
    
    let lyrics = await solenolyrics.requestLyricsFor(encodeURI(song))

    return lyrics;

}

let formatted_mssg = (title, fields = {}, fields_pre = true) => {
    if (fields_pre) {
        fields = Object.keys(fields).map(key => {
            return {
                name: key,
                value: fields[key]
            }
        })
    }
    return {
        color: embedColor,
        title,
        fields: fields
    }
}

let get_queue_string = (queue, current_idx) => {

    if (queue.length == 0) return null

    let queue_string = queue.map((video_info, idx) => {
        if (current_idx == idx) return "🎧 \t\t" + (idx + 1).toString() + ") " + ` ${video_info.title}` + " 🎧";
        else(idx + 1).toString() + ") " + `${video_info.title}`;
    })

    return queue_string.join('\n')
}

let get_queue_fields = (queue, current_idx, from = 0) => {

    if (queue.length == 0) return null

    let queue_fields = []
    for (let idx = 0; idx < queue.length; idx++) {
        const video_info = queue[idx];

        let name_field = {
            value: `${from + idx + 1} - ${video_info.title}`,
            name: '\u200B',
            inline: true,
        }

        let play_field
        if (current_idx - from == idx)
            play_field = {
                value: `🎧`,
                name: '\u200B',
                inline: true
            }
        else
            play_field = {
                value: `\u200B`,
                name: '\u200B',
                inline: true
            }
        duration_field = {
            value: `${video_info.duration}`,
            name: '\u200B',
            inline: true
        }

        queue_fields.push([name_field, play_field, duration_field])
    }
    return queue_fields
}

let get_seek_bar = (duration, now, width = 20) => {
    let bar = '▬'.repeat(width)

    let position = Math.min(Math.floor((now / duration) * width), width - 1)

    if (isNaN(position)) return null

    bar = bar.substring(0, position) + '🔴' + bar.substring(position + 1)

    return `${bar} ${get_seconds_duration(now)} : -${get_seconds_duration(duration - now)}`
}

module.exports = {
    search,
    audio_url,
    audio_stream,
    related_videos,
    get_lyrics,
    searchAll,
    get_duration_seconds,
    formatted_mssg,
    get_queue_string,
    get_queue_fields,
    get_seek_bar,
    get_seconds_duration
}