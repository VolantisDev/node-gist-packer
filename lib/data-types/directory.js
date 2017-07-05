const Promise = require('bluebird')
const dir = require('node-dir')
const check = require('check-types')

module.exports = {
    name: 'directory',
    handles: {
        pack: true,
        unpack: false
    },
    matches,
    pack
}

function matches (data) {
    return check.string(data) && data.startsWith('directory:')
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
