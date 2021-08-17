const YTSearchAdapter = require('./yt-search')
const YTDLAdapter = require('./ytdl-core-discord')

const validURL = (url) => {
    try { new URL(url.includes('http') ? url : `http://${url}`); return true }
    catch (_) { return false }
}

class YoutubeAdapter {
    constructor() {
        this.search_adapter = new YTSearchAdapter()
        this.stream_adapter = new YTDLAdapter()
    }

    async search(query, limit=-1) {
        return await this.search_adapter.search(query, limit)
    }

    async videoInfo(video_url) {
        try { 
            const id = ((new RegExp('v=([^&]+)').exec(video_url)) || (new RegExp('youtu\.be\/([^&]+)').exec(video_url)))[1]
            return await this.search_adapter.video(id)
        }
        catch (_) { return undefined }
    }

    async listInfo(list_url) {
        try { 
            const id = (new RegExp('list=([^&]+)').exec(list_url))[1]
            return await this.search_adapter.list(id)
        }
        catch (_) { return [] }
    }

    async getStream(url, seek=0) {
        try { return await this.stream_adapter.getStream(url, seek) }
        catch (_) { return undefined }
    }

    async getRelated(url, exclude_urls=[]) {
        const exclude_ids = exclude_urls.map(url => ((new RegExp('v=([^&]+)').exec(url)) || (new RegExp('youtu\.be\/([^&]+)').exec(url)))[1])
        const res = (await this.stream_adapter.getRelated(url)).filter(video => !exclude_ids.includes(video.id))
        return res
    }

    async getSongs(query) {
        let songs = []
        if (this.isValidSongURL(query)) {
            let song_info = await this.videoInfo(query)
            song_info && songs.push(song_info)
        } else if (this.isValidPlaylistURL(query)) {
            songs.push(...(await this.listInfo(query)))
        } else {
            songs.push(...(await this.search(query, 1)))
        }
        return songs
    }

    isValidSongURL(url) {
        return validURL(url) && /youtu\.be\/|youtube\.com\/watch/.test(url)
    }

    isValidPlaylistURL(url) {
        return validURL(url) && /youtube\.com\/playlist/.test(url)
    }

    isValidURL(url) {
        return this.isValidSongURL(url) || this.isValidPlaylistURL(url)
    }
}

module.exports = YoutubeAdapter