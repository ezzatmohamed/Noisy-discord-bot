Array.prototype.insert = function (item, index) { return this.splice( index, 0, item ) }

Array.prototype.chunk = function (chunk_size) { return this.reduce((r, v) => (!r.length || r[r.length - 1].length === chunk_size ? r.push([v]) : r[r.length - 1].push(v)) && r, []) }

Array.prototype.seperate = function (seperator) { return this.reduce((r, a) => r.concat(a, seperator), []).slice(0, this.length * 2 - 1) }