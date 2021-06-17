const YoutubeAdapter = require('../../adaptors/youtube')

const youtube_adapter = new YoutubeAdapter()

class Song {
    constructor(song_info) {
        this.url = song_info.url
        this.id = song_info.id
        this.title = song_info.title
        this.description = song_info.description
        this.thumbnail = song_info.thumbnail
        this.duration = song_info.duration
        this.ago = song_info.ago
        this.views = song_info.views
    }

    static async create(url, song_info) {
        try {
            song_info = song_info ? song_info : await youtube_adapter.videoInfo(url)
            return new Song(song_info)
        } catch (_) {
            return undefined
        }
    }

    async getRelated(exclude_songs) {
        return await youtube_adapter.getRelated(this.url, exclude_songs.map(song => song.url))
    }

    async getStream() {
        return await youtube_adapter.getStream(this.url)
    }
}

module.exports = Song