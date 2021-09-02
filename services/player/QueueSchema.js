const mongoose = require('mongoose')

const queueSchema = new mongoose.Schema({
    guild_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    queue: {
        type: Array,
        required: true,
    },
    autoplay: {
        type: Number,
        required: true,
    },
    loop: {
        type: Number,
        required: true,
    },
}, { collection: 'queues' })

queueSchema.index({ guild_id: 1, name: 1 })
let QueueModel = mongoose.model('Queue', queueSchema)

module.exports = QueueModel