const Bundle = require('../../bundle')
const check = require('check-types')

module.exports = {
    name: 'meta',
    handles: {
        pack: true,
        unpack: true
    },
    matches,
    pack,
    unpack
}

function matches (data) {
    return check.array.of.object(data) && typeof data[0].getMeta !== 'undefined'
}

function pack (data, meta, config) {
    return new Promise(resolve => {
        const metaData = {}

        data.forEach(bundle => {
            metaData[bundle.name()] = bundle.getMeta()
        })

        resolve([Bundle(JSON.stringify(metaData), Object.assign({
            name: 'gist-packer-meta.json',
            dataType: 'meta'
        }, meta))])
    })
}

function unpack (bundle, config) {
    return new Promise(resolve => resolve(JSON.parse(bundle.data)))
}
