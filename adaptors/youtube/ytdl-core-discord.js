const ytdl = require('ytdl-core-discord')

class YTDLAdapter {

    formatVideo(video) {
        return {
            id: video.id,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            title: video.title,
            description: undefined,
            thumbnail: video.thumbnails[0].url,
            duration: undefined,
            ago: video.published,
            views: video.view_count
        }
    }


    async getStream(url) {
        return await ytdl(url)
    }

    async getRelated(url) {
        let { related_videos } = await ytdl.getInfo(url)
        return related_videos.map(video => this.formatVideo(video))
    }

}

module.exports = YTDLAdapter