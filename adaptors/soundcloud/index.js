const SoundCloudScraper = require('soundcloud-scraper')

class SoundCloudAdapter {
    constructor() {
        this.soundcloud_scraper = new SoundCloudScraper.Client(process.env.SOUNDCLOUD_API_KEY)
    }

    async search(query, limit=-1) {
        const results = await this.soundcloud_scraper.search(query)
        return limit !== -1 ? results.slice(0, limit) : results
    }

    async videoInfo(video_url) {
        const result = await this.soundcloud_scraper.getSongInfo(video_url)
        return result
    }

    async listInfo(list_url) {
        const results = await this.soundcloud_scraper.getPlaylist(list_url)
        return results
    }

    async getStream(url, seek=0) {
        const song = await this.videoInfo(url)
        const stream = await song.downloadProgressive()
        return stream
    }

    async getSongs(query) {
        let songs = []
        try {
            songs = [await this.videoInfo(query)]
        } catch (_) {
            try {
                songs = await this.listInfo(query)
            } catch (_) {
                songs = await this.search(query)
            }
        }
        return songs
    }
}

module.exports = SoundCloudAdapter