const YoutubeAdapter = require('./adaptors/youtube')
const yts = require( 'yt-search' )
const ytdl = require('discord-ytdl-core')
// const Song = require('./services/music/Song')
// const Music = require('./services/music')
const { getData, getPreview, getTracks } = require('spotify-url-info')
const soundcloud = require("soundcloud-scraper")
const SoundCloudAdapter = require('./adaptors/soundcloud')
async function func () {
    // console.log(await yts( { videoId: '_4Vt0UGwmgQ' } ))
    // console.log(await ytdl('https://www.youtube.com/watch?v=9GaKp2E0sxI'))
    // const yt = new YoutubeAdapter()
    // const music = new Music()
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

    // await music.add('ثرثرة')
    // console.log(music.queue)

    // console.log(await ytdl.getInfo('https://open.spotify.com/track/0u2P5u6lvoDfwTYjAADbn4?si=2dd572e4160d4724'))
    // const res = await getData('https://open.spotify.com/track/0u2P5u6lvoDfwTYjAADbn4?si=2dd572e4160d4724')
    
    // const sc = new SoundCloudAdapter()
    // const res = await sc.getSongs('Youssra El Hawary - Shai Belaban')
    // console.log(res[0].url)
    // await sc.getStream(res[0].url)

    let ex = [
        'https://youtube.com/watch?v=bo_efYhYU2A',
        'https://youtube.com/watch?v=lp-EO5I60KA'
    ]
    let re = [
        {
            id: '52nfjRzIaj8',
            url: 'https://www.youtube.com/watch?v=52nfjRzIaj8',
            title: "I'll Never Love Again (from A Star Is Born) (Official Music Video)",
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/52nfjRzIaj8/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBHH3kspigjjazbOIn_O3LjkUX9gA',
            duration: undefined,
            ago: '2 years ago',
            views: '356022970'
        },
        {
            id: 'g_A-6CM_N4g',
            url: 'https://www.youtube.com/watch?v=g_A-6CM_N4g',
            title: "Tour de France 2021 Stage 13 Highlights | Can Mark Cavendish Equal Eddy Merckx's Stage Wins Record?",
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/g_A-6CM_N4g/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAhrWvKAnj8nNx0N3tuPNAAZR2dHA',
            duration: undefined,
            ago: '1 day ago',
            views: '292926'
        },
        {
            id: 'L0FQb3RMfPg',
            url: 'https://www.youtube.com/watch?v=L0FQb3RMfPg',
            title: 'Lady Gaga - Always Remember Us This Way (Lyrics Video)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/L0FQb3RMfPg/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDB6MZ4jJvNxfR9ya4-8uF8cnT_ZQ',
            duration: undefined,
            ago: '2 years ago',
            views: '89357043'
        },
        {
            id: 'RBumgq5yVrA',
            url: 'https://www.youtube.com/watch?v=RBumgq5yVrA',
            title: 'Passenger | Let Her Go (Official Video)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/RBumgq5yVrA/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBOnk0ncMKP_37rliN_u-_G9lQaUg',
            duration: undefined,
            ago: '8 years ago',
            views: '3023257437'
        },
        {
            id: '3Z7ddmHlbdU',
            url: 'https://www.youtube.com/watch?v=3Z7ddmHlbdU',
            title: 'Lady Gaga & Bradley Cooper - Shallow (Alternative Editing with Different Takes)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/3Z7ddmHlbdU/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLARqh6vFHy2RhLUFk7xgngiNSdLtg',
            duration: undefined,
            ago: '2 years ago',
            views: '73885388'
        },
        {
            id: 'JPJjwHAIny4',
            url: 'https://www.youtube.com/watch?v=JPJjwHAIny4',
            title: 'Lady Gaga, Bradley Cooper - Shallow (From A Star Is Born/Live From The Oscars)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/JPJjwHAIny4/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLB7_-Z5YXCDED9wqkdUv_3QWdycwg',
            duration: undefined,
            ago: '2 years ago',
            views: '463145998'
        },
        {
            id: 'YQHsXMglC9A',
            url: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
            title: 'Adele - Hello',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLA1F79kJnfwlmV1d0AnKHD4OdvQcw',
            duration: undefined,
            ago: '5 years ago',
            views: '2852954180'
        },
        {
            id: 'eWupm_cePX8',
            url: 'https://www.youtube.com/watch?v=eWupm_cePX8',
            title: 'A Star is Born - Shallow Sing-Along (Lady Gaga & Bradley Cooper) | Netflix',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/eWupm_cePX8/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAye6loP-dQf_qk58eyapQEsSMwVw',
            duration: undefined,
            ago: '2 months ago',
            views: '6575808'
        },
        {
            id: 'csYZub5FdRs',
            url: 'https://www.youtube.com/watch?v=csYZub5FdRs',
            title: 'ALWAYS REMEMBER US THIS WAY (LADY GAGA) - LEGENDADO - HD',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/csYZub5FdRs/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCzmIQpy7C8fZJAS2JgJo4W3IBnuw',
            duration: undefined,
            ago: '3 months ago',
            views: '1337384'
        },
        {
            id: '2Vv-BfVoq4g',
            url: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
            title: 'Ed Sheeran - Perfect (Official Music Video)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLA10odJyg6t041gxMu8v-6iUhbuQQ',
            duration: undefined,
            ago: '3 years ago',
            views: '2892017142'
        },
        {
            id: 'rEIRHVcjE6o',
            url: 'https://www.youtube.com/watch?v=rEIRHVcjE6o',
            title: 'Shallow - Lady Gaga, Bradley Cooper (A Star Is Born)(Boyce Avenue ft. Jennel Garcia acoustic cover)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/rEIRHVcjE6o/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDd3RnRCvA4GdpH7P28XPSlkPzObg',
            duration: undefined,
            ago: '2 years ago',
            views: '17912822'
        },
        {
            id: 'lp-EO5I60KA',
            url: 'https://www.youtube.com/watch?v=lp-EO5I60KA',
            title: 'Ed Sheeran - Thinking Out Loud (Official Music Video)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/lp-EO5I60KA/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLA35Z5x8QCXvZAWPSzSSaVzavCVDA',
            duration: undefined,
            ago: '6 years ago',
            views: '3285515793'
        },
        {
            id: 'OpQFFLBMEPI',
            url: 'https://www.youtube.com/watch?v=OpQFFLBMEPI',
            title: 'P!nk - Just Give Me A Reason ft. Nate Ruess',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/OpQFFLBMEPI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCn37Os2UJOYjFhtKaWHcFG9SGkiw',
            duration: undefined,
            ago: '8 years ago',
            views: '1302563210'
        },
        {
            id: 'qF0JV28vgLw',
            url: 'https://www.youtube.com/watch?v=qF0JV28vgLw',
            title: "Angelina Jordan - Bohemian Rhapsody - America's Got Talent: The Champions One - January 6, 2020",
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/qF0JV28vgLw/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDVhX6b6ufnbAu18xmjVV45juPFyQ',
            duration: undefined,
            ago: '1 year ago',
            views: '20938464'
        },
        {
            id: 'zABLecsR5UE',
            url: 'https://www.youtube.com/watch?v=zABLecsR5UE',
            title: 'Lewis Capaldi - Someone You Loved',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/zABLecsR5UE/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLBwnY86VknXWM8ggeVpQGYCaTbMQg',
            duration: undefined,
            ago: '1 year ago',
            views: '395507911'
        },
        {
            id: 'hLQl3WQQoQ0',
            url: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0',
            title: 'Adele - Someone Like You (Official Music Video)',
            description: undefined,
            thumbnail: 'https://i.ytimg.com/vi/hLQl3WQQoQ0/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAcip5yLBIgLjYL6w2dK-Y93L3xgg',
            duration: undefined,
            ago: '9 years ago',
            views: '1723964463'
        }
    ]
      
    console.log(re.length)
    console.log(re[11].url, ex, ex.includes(re[11].url))
    console.log(re[11].url, ex[1], re[11].url === ex[1])
    const res = re.filter(video => !ex.includes(video.url))
    console.log(res.length)
    // console.log()
}
func()