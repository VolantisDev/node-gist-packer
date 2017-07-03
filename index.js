module.exports = cfg => {
    const config = getConfig(cfg)
    const gist = require('./lib/gist')
    const meta = require('./lib/meta')(config)
    const packer = require('./lib/packer')(config)
    

    return {
        config,
        gist,
        meta,
        packer
    }
}

function getConfig(cfg) {
    const config = require('./lib/config')
    config.set(cfg)
    return config
}
