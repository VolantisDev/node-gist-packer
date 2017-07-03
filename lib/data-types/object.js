const randomstring = require('randomstring')
const check = require('check-types')
const Bundle = require('../../bundle')

module.exports = {
    handles: {
        pack: true,
        unpack: true
    },
    matches,
    pack,
    unpack
}

function matches (data) {
    return check.object(data)
}

function pack (data, meta, config) {
    return new Promise(() => {
        const name = randomstring.generate({ length: 6 })
        return Bundle(JSON.stringify(data), Object.assign({ name }, meta))
    })
}

function unpack (bundle, config) {
    return new Promise(() => JSON.parse(bundle.data))
}
