const request = require("request")
const regex = /var ytInitialData = ([\S\s]*?)<\/script>/g
let is_valid_url = (string) => {
    try { return new URL(string) } catch (_) { return null }
}
let ytsr = async (query, _) => {
    let url = is_valid_url(query)
    query = url == null ? query : url.searchParams.get('v')
    for (let i = 0; i < 3; i++) {
        try {
            const body = await new Promise(function(resolve, reject){
                request(encodeURI(`https://www.youtube.com/results?hl=en&persist_hl=1&search_query=${query}`), (error, response, body) => {
                    if (error) return reject(error);
                    try { resolve(body) } catch(e) { reject(e) }
                })
            })
            let obj = regex.exec(body)[1]
            obj = JSON.parse(obj.substr(0, obj.lastIndexOf(';')))
            obj = obj['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents']
            videos = obj.filter(video => video['videoRenderer'] !== undefined)
            videos = videos.map(video => {
                try {
                    return { 
                        type: "video",
                        live: false,
                        title: video['videoRenderer']['title']['runs'][0]['text'],
                        link: `https://www.youtube.com/watch?v=${video['videoRenderer']['videoId']}`,
                        thumbnail: video['videoRenderer']['thumbnail']['thumbnails'][0]['url'],
                        author: {
                            name: video['videoRenderer']['ownerText']['runs'][0]['text'],
                            ref: `https://www.youtube.com${video['videoRenderer']['ownerText']['runs'][0]['navigationEndpoint']['commandMetadata']['webCommandMetadata']['url']}`,
                            verified: false,
                        },
                        description: video['videoRenderer']['descriptionSnippet']['runs'].map(t => t['text']).join('\n'),
                        views: video['videoRenderer']['viewCountText']['simpleText'].replace(/[^\d.-]/g, ''),
                        duration: video['videoRenderer']['lengthText']['simpleText'],
                        uploaded_at: video['videoRenderer']['publishedTimeText']['simpleText'],
                        secs: 0
                    }
                } catch (err) {
                    return null
                }
            })
            videos = videos.filter(video => video != null)
            return { items: videos }
        } catch {
    
        }
    }
}
module.exports = {
    ytsr
}
;

