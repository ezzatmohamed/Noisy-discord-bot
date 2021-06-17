const yts = require( 'yt-search' )

class YTSearchAdapter {

    formatVideo(video) {
        return {
            id: video.videoId,
            url: video.url || `https://youtube.com/watch?v=${video.videoId}`,
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            duration: video.duration.timestamp,
            ago: video.ago,
            views: video.views
        }
    }

    async search(query, limit=-1) {
        let { videos } = await yts(query)
        videos = limit === -1 ? videos : videos.slice(0, limit)
        videos = videos.map(video => this.formatVideo(video))
        return videos
    }

    async video(videoId) {
        let video = await yts({videoId})
        return this.formatVideo(video)
    }

    async list(listId) {
        let {videos} = await yts({listId})
        videos = videos.map(video => this.formatVideo(video))
        return videos
    }
}

module.exports = YTSearchAdapter