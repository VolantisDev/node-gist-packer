const Bundle = require('../../bundle')
const check = require('check-types')

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
    return check.array.of.object(data) && data[0].meta
}

function pack (data, meta, config) {
    return new Promise(() => {
        const metaData = {}

        data.forEach(bundle => {
            metaData[bundle.name] = bundle
        })

        return Bundle(JSON.stringify(metaData), Object.assign({
            name: 'gist-packer-meta.json',
            dataType: 'meta'
        }, meta))
    })
}

function unpack (bundle, config) {
    return new Promise(() => JSON.parse(bundle.data))
}
