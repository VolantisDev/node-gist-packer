const fs = require('sander')
const Bundle = require('../../bundle')
const pathmap = require('../util/pathmap')
const check = require('check-types')

module.exports = {
    name: 'textFile',
    handles: {
        pack: true,
        unpack: true
    },
    matches,
    pack,
    unpack
}

function matches (data) {
    return check.string(data) && data.startsWith('directory:')
}

function pack (data, meta, config) {
    return fs
        .readFile(data)
        .then(fileData => {
            return [Bundle(fileData, Object.assign({
                name: pathmap.shortPath(data, config),
                dataType: 'textFile'
            }, meta))]
        })
}

function unpack (bundle, config) {
    return fs
        .writeFile(pathmap.fullPath(bundle.name, config), bundle.data)
        .then(() => {
            return bundle.name
        })
}
