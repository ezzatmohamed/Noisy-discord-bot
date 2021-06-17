
Array.prototype.insert = (item, index) => this.splice( index, 0, item )

class Queue {
    constructor(queue=[]) {
        this.queue = queue
    }

    static createQueue(queue) {
        if (typeof queue === Queue) return queue
        else if (typeof queue === typeof []) return new Queue(queue)
        else return new Queue([])
    }

    add(song, pos=-1) {
        if (pos === -1) this.queue.push(song)
        else this.queue.insert(song, pos)
    }

    clear() {
        this.queue = []
    }

    shuffle() {
        this.queue = this.queue
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
    }
}

module.exports = Queue