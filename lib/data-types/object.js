const randomstring = require('randomstring')
const check = require('check-types')
const Bundle = require('../../bundle')

module.exports = {
    name: 'object',
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
    return new Promise(resolve => {
        const name = randomstring.generate({ length: 6 })
        resolve([Bundle(JSON.stringify(data), Object.assign({ name, dataType: 'object' }, meta))])
    })
}

function unpack (bundle, config) {
    return new Promise(resolve => resolve(JSON.parse(bundle.data)))
}
