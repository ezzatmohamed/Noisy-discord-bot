const YoutubeAdapter = require('./adaptors/youtube')
const yts = require( 'yt-search' )
const Song = require('./services/music/Song')
const Music = require('./services/music')

async function func () {
    // console.log(await yts( { videoId: '_4Vt0UGwmgQ' } ))
    // console.log(await ytdl('https://www.youtube.com/watch?v=9GaKp2E0sxI'))
    const yt = new YoutubeAdapter()
    const music = new Music()
    // console.log(await yt.videoInfo('dscdsc'))
    // results = await yt.getRelatedVideos('https://www.youtube.com/watch?v=9GaKp2E0sxI')
    // console.log(results)

    // let song = await Song.create('https://www.youtube.com/watch?v=9GaKp2E0sxI')
    // console.log(song)

    // console.log(await yt.getSongs('https://youtube.com/watch?v=X2gBOUqqpg0'))
    // console.log(await yt.getSongs('https://www.youtube.com/watch?v=9GaKp2E0sxI'))
    // console.log(await yt.getSongs('https://youtube.com/watch?v=X0'))
    // console.log((await yt.getSongs('https://www.youtube.com/playlist?list=PL4BrNFx1j7E7BDa131cA8Aax0QtfDbWeS')).slice(0, 2))
    // console.log((await yt.getSongs('https://youtube.com/playlist?list=PL4BrNFx1j7E7BDa131cA8Aax0QtfDbWeS')).slice(0, 2))
    // console.log(await yt.getSongs('ثرثرة'))
    // console.log(await yt.getSongs('ىريبت يتنبىر يبتنرىيبىرنيبىريبنى'))

    await music.add('ثرثرة')
    console.log(music.queue)
}
func()