const Promise = require('bluebird')
const dir = require('node-dir')
const fs = require('sander')

module.exports = {
    handles: {
        pack: true,
        unpack: false
    },
    matches,
    pack
}

function matches (data) {
    return fs
        .stat(data)
        .then(stats => stats.isDirectory())
        .catch(() => false)
}

function packFiles (files, meta, config) {
    const packer = require('../packer')(config)
    const packedFiles = []

    const requests = files.map(file => {
        return packer
            .pack(file, Object.assign(meta, { name: file, dataType: 'file' }))
            .then(packedFiles.push)
    })

    return Promise
        .all(requests)
        .then(() => packedFiles)
}

function pack (data, meta, config) {
    return dir
        .promiseFiles(data)
        .then(files => packFiles(files, meta, config))
}
