Array.prototype.insert = function (item, index) { return this.splice( index, 0, item ) }

Array.prototype.chunk = function (chunk_size) { return this.reduce((r, v) => (!r.length || r[r.length - 1].length === chunk_size ? r.push([v]) : r[r.length - 1].push(v)) && r, []) }

Array.prototype.seperate = function (seperator) { return this.reduce((r, a) => r.concat(a, seperator), []).slice(0, this.length * 2 - 1) }

Number.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    var seconds = sec_num - (hours * 3600) - (minutes * 60)

    if (hours   < 10) {hours   = "0"+hours}
    if (minutes < 10) {minutes = "0"+minutes}
    if (seconds < 10) {seconds = "0"+seconds}
    return hours > 0 ? hours+':'+minutes+':'+seconds : minutes+':'+seconds
}

String.prototype.toSecs = function () {
    var total_time = this.split(':')
    total_time = total_time.length < 3 ? ['0', ...total_time] : total_time
    total_time = (+total_time[0]) * 60 * 60 + (+total_time[1]) * 60 + (+total_time[2])
    return total_time
}