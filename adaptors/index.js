const YoutubeAdapter = require('./youtube')

const youtube_adapter = new YoutubeAdapter()

class Adapter {

    constructor() {

    }

    getSuitableAdapter(query) {
        if (youtube_adapter.isValidURL(query)) return youtube_adapter
        else return youtube_adapter
    }

    async search(query, limit=-1) {
        const adapter = this.getSuitableAdapter(query)
        return await adapter.search(query, limit)
    }

    async videoInfo(video_url) {
        const adapter = this.getSuitableAdapter(video_url)
        return await adapter.videoInfo(video_url)
    }

    async listInfo(list_url) {
        const adapter = this.getSuitableAdapter(list_url)
        return await adapter.listInfo(list_url)
    }

    async getStream(url, seek=0) {
        const adapter = this.getSuitableAdapter(url)
        return await adapter.getStream(url, seek)
    }

    async getRelated(url, exclude_urls=[]) {
        const adapter = this.getSuitableAdapter(url)
        return await adapter.getRelated(url, exclude_urls)
    }

    async getSongs(query) {
        const adapter = this.getSuitableAdapter(query)
        return await adapter.getSongs(query)
    }

}

module.exports = Adapter