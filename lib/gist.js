const Gists = require('gists')

module.exports = (config => {
    function createGist (bundles) {
        const gists = new Gists({ token: config.get('token') })
        const packer = require('./packer')(config)

        return packer
            .toGist(bundles)
            .then(gists.createAsync)
            .then(gist => gist.id)
    }

    function readGist () {
        const packer = require('./packer')(config)
        const gists = new Gists({ token: config.get('token') })
        
        return gists
            .downloadAsync({ id: config.get('gistId') })
            .then(packer.fromGist)
    }

    function updateGist (bundles) {
        const gists = new Gists({ token: config.get('token') })
        const packer = require('./packer')(config)

        return packer
            .toGist(bundles)
            .then(data => {
                data.id = config.get('gistId')
                return gists.editAsync(data)
            })
            .then(gist => gist.id)
    }

    function deleteGist () {
        const gists = new Gists({ token: config.get('token') })

        return gists
            .destroyAsync({id: config.get('gistId')})
            .then(() => {
                return true
            })
    }

    function listGists () {
        const gists = new Gists({ token: config.get('token') })
        const meta = require('./meta')(config)

        var gistData

        return gists
            .allAsync()
            .then(data => {
                gistData = data
                const gists = []
                Object.keys(data).forEach(index => {
                    if (typeof data[index].files['gist-packer-meta.json'] !== 'undefined') {
                        gists.push(data[index])
                    }
                })
                return gists
            })
            .then(gistPackages => {
                const gists = []

                gistPackages.forEach(gist => {
                    const metaPackage = meta.unpackMeta(gistData)
                    gists.push({
                        id: gist.id,
                        name: metaPackage.packageName
                    })
                })

                return gists
            })
    }

    return {
        createGist,
        readGist,
        updateGist,
        deleteGist,
        listGists
    }
})
