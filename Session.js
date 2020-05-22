const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    guild_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    queue: {
        type: Array,
        required: true,
    },
    current: {
        type: Number,
        required: true,
    },
    autoplay: {
        type: Boolean,
        required: true,
    },
}, { collection: 'servers_sessions' });


let Model = mongoose.model('Session', sessionSchema);

module.exports = Model;