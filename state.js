const Session = require('./Session')
const utils = require('./utils')

let storage = {}
let debug = false
let XO = {}

let initialize = () => {
    storage = new Object()
    if (debug) console.log(storage)
}

let add_server = (message) => {
    storage[message.guild.id] = {
        queue: [],
        dispatcher: null,
        volume: 1,
        current: 0,
        autoplay: true,
        loop: 0
    }
    XO[message.guild.id] = {
        user1: null,
        user2: null,
        NextToPlay: 0,
        StartTime: null,
        messageID: null
    }
    if (debug) console.log(storage)
}

let get_XO = (message) => {
    return XO[message.guild.id]
}
let clear_XO = (message) => {

    XO[message.guild.id] = {
        user1: null,
        user2: null,
        NextToPlay: null,
        StartTime: null,
        messageID: null
    }

}
let remove_server = (message) => {
    delete storage[message.guild.id]
    if (debug) console.log(storage)
}

let set_player = (message, dispatcher, volume) => {
    storage[message.guild.id].dispatcher = dispatcher
    storage[message.guild.id].volume = volume
    if (debug) console.log(storage)
}

let add_song = (message, video_info) => {

    storage[message.guild.id].queue.push(video_info)
    if (debug) console.log(storage)
}


let get_player = (message) => {
    return {
        dispatcher: storage[message.guild.id].dispatcher,
        volume: storage[message.guild.id].volume
    }
}

let get_queue = (message) => {
    return storage[message.guild.id].queue
}

let clear_queue = (message) => {
    if (get_player(message).dispatcher != null) {
        get_player(message).dispatcher.destroy();
        delete get_player(message).dispatcher;
        set_player(message, null, 1);
    }
    
    storage[message.guild.id] = {
        queue: [],
        dispatcher: null,
        volume: 1,
        current: 0,
        autoplay: storage[message.guild.id].autoplay,
        loop: storage[message.guild.id].loop
    }
    play_current(message)
}

let get_queue_urls = (message) => {
    return storage[message.guild.id].queue.map(video_info => {
        return video_info.link
    })
}

let get_current = (message) => {
    return storage[message.guild.id].current
}
let set_current = (message, val) => {
    storage[message.guild.id].current = val
}
let set_loop = (message, val) => {
    storage[message.guild.id].loop = val
}
let get_loop = (message) => {
    return storage[message.guild.id].loop
}

let set_current_audio_url = (message, audio_url) => {
    storage[message.guild.id].queue[storage[message.guild.id].current].audio_url = audio_url
}

let get_current_info = (message) => {
    return storage[message.guild.id].queue.length != 0 ? storage[message.guild.id].queue[storage[message.guild.id].current] : null
}

let get_next_info = (message) => {
    if (storage[message.guild.id].current + 1 <= storage[message.guild.id].queue.length - 1) { // nextable
        if (storage[message.guild.id].loop == 0 || storage[message.guild.id].loop == 1) storage[message.guild.id].current += 1
        return get_current_info(message)
    } else if (storage[message.guild.id].loop == 1) {
        storage[message.guild.id].current = 0
        return get_current_info(message)
    } else if (storage[message.guild.id].loop == 2) {
        return get_current_info(message)
    }
    return null
}

let get_previous_info = (message) => {
    if (storage[message.guild.id].current - 1 >= 0 && storage[message.guild.id].queue.length > 0) { // nextable
        storage[message.guild.id].current -= 1
        return get_current_info(message)
    }
    return null
}
let get_idx_url = (message, Idx) => {

    if (Idx >= 0 && Idx < storage[message.guild.id].queue.length) {
        storage[message.guild.id].current = Idx
        return get_current_info(message)
    }
    return null

}

let get_autoplay = (message) => {
    return storage[message.guild.id].autoplay
}

let toggle_autoplay = (message) => {
    return storage[message.guild.id].autoplay = !storage[message.guild.id].autoplay
}

let save_session = async(message, name) => {
    let sessions = await Session.find({
        guild_id: message.guild.id,
        name: name
    })
    if (sessions.length != 0) return false

    let session = Session({
        guild_id: message.guild.id,
        name: name,
        queue: storage[message.guild.id].queue,
        current: storage[message.guild.id].current,
        autoplay: storage[message.guild.id].autoplay,
        loop: storage[message.guild.id].loop,
    })

    await session.save()
    return true
}

let get_session = async(message, session_name = '') => {
    let sessions = await Session.find({
        guild_id: message.guild.id
    })

    if (session_name == '') {
        return await Session.find({
            guild_id: message.guild.id
        })
    } else {
        return await Session.findOne({
            guild_id: message.guild.id,
            name: session_name,
        })
    }
}

let load_session = async(message, session_name) => {
    let session = (await Session.findOne({
        guild_id: message.guild.id,
        name: session_name
    }))

    if (session != null) {
        storage[message.guild.id] = {
            queue: session.queue,
            dispatcher: null,
            volume: 1,
            current: session.current,
            autoplay: session.autoplay,
            loop: session.loop === undefined ? 0 : session.loop
        }
        return true
    } else return false

}

let update_session = async(message, session_name) => {
    let session = (await Session.findOne({
        guild_id: message.guild.id,
        name: session_name
    }))

    if (session != null) {
        session.queue = storage[message.guild.id].queue
        session.current = storage[message.guild.id].current
        session.autoplay = storage[message.guild.id].autoplay
        session.loop = storage[message.guild.id].loop
        await session.save()
        return true
    } else return false

}

let delete_session = async(message, session_name) => {
    let session = (await Session.findOne({
        guild_id: message.guild.id,
        name: session_name
    }))

    if (session != null) {
        const session__id = session._id
        await Session.deleteOne({ _id: session__id })
        return true
    } else return false

}

let get_queue_string = (message) => {
    const queue = state.get_queue(message);
    const current_idx = state.get_current(message);
    
    return utils.get_queue_string(queue, current_idx)
}

let get_queue_fields = (message, page=0, max_songs=-1) => {
    let queue = state.get_queue(message);
    const current_idx = state.get_current(message);

    if (max_songs != 1) {
        let no_pages = Math.ceil(queue.length / max_songs)
    
        if (page >= no_pages || page < 0) return null
        
        queue = queue.slice(page * max_songs, page * max_songs + max_songs)
    }
    
    return utils.get_queue_fields(queue, current_idx, from=page * max_songs)
}

let play_current = async (message, callback = null, from=-1) => {
    
    if (get_player(message).dispatcher != null) {
        get_player(message).dispatcher.destroy();
        delete get_player(message).dispatcher;
        set_player(message, null, 1);
    }

    if (from == -1) {
        remove_song_message(message)
        set_now_playing_mssg(message, null)
    }

    let current_info = get_current_info(message)

    if (!current_info) return

    let audio_stream = utils.audio_stream(current_info.link)
    // let audio_url
    // if (from != -1 && current_info.audio_url) audio_url = current_info.audio_url
    if (from == -1) {
        // audio_url = await utils.audio_url(current_info.link);
        from = 0
    }
    let dispatcher = await message.guild.voice.connection.play(audio_stream, { type: "opus", volume: 1, seek: from })
    dispatcher.from = from * 1000
    // set_current_audio_url(message, audio_url)

    set_player(message, dispatcher, 1);
    dispatcher.on("finish", () => {
        set_player(message, null, 1);
        if (callback) callback()
    });
}

let queue_pop = (message, callback=null) => {
    return queue_remove(message, -1, callback)
}

let queue_remove = (message, idx, callback=null) => {
    let queue = get_queue(message)
    
    idx = idx == -1 ? queue.length - 1 : idx

    if (idx >= queue.length) return false

    let current = get_current(message)
    let removed_info = queue[idx]

    queue.splice(idx, 1)

    if (idx == current)
        play_current(message, callback)

    return removed_info
}

let get_current_seek_bar = (message, width=20) => {
    let dispatcher = get_player(message).dispatcher

    if (!dispatcher || dispatcher.pausedSince != null) return null

    let current_info = get_current_info(message)

    return utils.get_seek_bar(current_info.secs, ((new Date()).getTime() - dispatcher.startTime - dispatcher._pausedTime + dispatcher.from) / 1000, width)
}

let rewind = (message, secs, callback) => {
    let dispatcher = get_player(message).dispatcher
    
    if (!dispatcher) return null

    let now = ((new Date()).getTime() - dispatcher.startTime - dispatcher._pausedTime + dispatcher.from) / 1000

    now = Math.max(0, now - secs)

    if (now != 0) play_current(message, callback, now)
}

let fastforward = (message, secs, callback) => {
    let dispatcher = get_player(message).dispatcher
    
    if (!dispatcher) return null

    let current_info = get_current_info(message)

    let now = ((new Date()).getTime() - dispatcher.startTime - dispatcher._pausedTime + dispatcher.from) / 1000

    now = Math.min(current_info.secs, now + secs)

    if (now != current_info.secs) play_current(message, callback, now)
}

let set_song_message = (message, mssg, interval) => {
    storage[message.guild.id].song_message = mssg
    storage[message.guild.id].interval = interval
}

let remove_song_message = (message) => {
    if (storage[message.guild.id].song_message) storage[message.guild.id].song_message.delete()
    if (storage[message.guild.id].interval) clearInterval(storage[message.guild.id].interval)

    delete storage[message.guild.id].song_message
    delete storage[message.guild.id].interval
}

let set_now_playing_mssg = (message, now_playing_mssg) => {
    if (storage[message.guild.id].now_playing_mssg) {
        storage[message.guild.id].now_playing_mssg.delete()
        delete storage[message.guild.id].now_playing_mssg
    }

    storage[message.guild.id].now_playing_mssg = now_playing_mssg
}

initialize()

module.exports = {
    initialize,
    add_server,
    remove_server,
    set_player,
    add_song,
    get_player,
    get_queue,
    clear_queue,
    get_current,
    set_current,
    set_loop,
    get_loop,
    set_current_audio_url,
    get_current_info,
    get_next_info,
    get_previous_info,
    get_idx_url,
    get_autoplay,
    toggle_autoplay,
    save_session,
    get_session,
    load_session,
    update_session,
    delete_session,
    get_XO,
    clear_XO,
    get_queue_string,
    get_queue_fields,
    get_queue_urls,
    play_current,
    queue_pop,
    queue_remove,
    get_current_seek_bar,
    rewind,
    fastforward,
    set_song_message,
    remove_song_message,
    set_now_playing_mssg
}