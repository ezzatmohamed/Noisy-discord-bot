const ytpl = require('ytpl')


let resolveYtsrResult = async (items) => {

    let valid_item = null
    for (let i = 0; i < items.length; i++) {
        if( ['video', 'playlist'].includes(items[i]['type']) ) {
            valid_item =  items[i]
            break
        }
    }

    if( !valid_item ) return null

    switch(valid_item.type) {
        case 'video':
            return resolveVideo(valid_item)
        case 'playlist':
            return await resolvePlaylist(valid_item)
    }
    return null

}

let resolveVideo = (video) => {
    let secs = get_duration_in_seconds(video['duration'])

    return {
        "title": video.title,
        "url": video.url,
        "duration": video.duration,
        "secs": secs
    }
}

let resolvePlaylist = async (playlist) => {
    const tracks = await ytpl(playlist.url, {limit: 100});
    const resolved_tracks = tracks.items.map(track => {
        return resolveVideo(track)
    });
    return resolved_tracks
}

let get_duration_in_seconds = (duration) => {
    let a = duration.split(':')
    if (a.length == 1) return (+a[0])
    if (a.length == 2) return (+a[0]) * 60 + (+a[1])
    if (a.length == 3) return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
}

module.exports = {
    resolveYtsrResult,
    resolveVideo,
    resolvePlaylist
}