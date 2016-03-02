var xtend = require('xtend')

function Iterator(db, ns, opts) {
  this.namespace = ns
  this.codec = ns.codec
  this.opts = opts = ns.encodeRange(opts)

  if (typeof opts.limit !== 'number') {
    opts.limit = -1
  }

  if (opts.keys == null) opts.keys = true
  if (opts.values == null) opts.values = true

  // If db is not a *DOWN db, bypass the value decoding it might do
  this.iterator = db.iterator(xtend(opts, { valueEncoding: 'id' }))
}

Iterator.prototype.next = function outerNext(cb) {
  this.iterator.next(function innerNext(err, key, value) {
    if (err) return cb(err)
    else if (key === undefined) return cb()

    key = this.opts.keys ? this.namespace.decode(key, this.opts) : null
    value = this.opts.values ? this.codec.decodeValue(value, this.opts) : null

    cb(null, key, value)
  }.bind(this))
}

Iterator.prototype.end = function outerEnd(cb) {
  this.iterator.end(cb)
}

module.exports = Iterator
