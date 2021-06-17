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

    async getStream(url) {
        try { return await this.stream_adapter.getStream(url) }
        catch (_) { return undefined }
    }

    async getRelated(url, exclude_urls) {
        return (await this.stream_adapter.getRelated(url)).filter(video => !exclude_urls.include(video.url))
    }

    async getSongs(query) {
        let songs = []
        if (validURL(query) && /youtu\.be\/|youtube\.com\/watch/.test(query)) {
            let song_info = await this.videoInfo(query)
            song_info && songs.push(song_info)
        } else if (validURL(query) && /youtube\.com\/playlist/.test(query)) {
            songs.push(...(await this.listInfo(query)))
        } else {
            songs.push(...(await this.search(query, 1)))
        }
        return songs
    }
}

module.exports = YoutubeAdapter