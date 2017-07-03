const Promise = require('bluebird')
const check = require('check-types')

module.exports = {
    handles: {
        pack: true,
        unpack: false
    },
    matches,
    pack,
}

function matches (data) {
    return check.array(data)
}

function pack (data, meta, config) {
    const packer = require('../packer')(config)
    const packedItems = []

    const requests = data.map(item => {
        return packer
            .pack(item, Object.assign(meta))
            .then(packedItems.push)
    })

    return Promise.all(requests).then(() => packedItems)
}
