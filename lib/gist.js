const GitHub = require('github-api')

module.exports = (config => {
    function gistClient() {
        const token = config.get('token')
        const gh = new GitHub({ token })
        const gistId = config.get('gistId', null)
        var gistClient

        if (gistId) {
            gistClient = gh.getGist(config.get('gistId'))
        } else {
            gistClient = gh.getGist()
        }

        return gistClient
    }

    function createGist (bundles) {
        const packer = require('./packer')(config)
        return packer.toGist(bundles)
            .then(data => gistClient().create(data))
            .then(response => response.data.id)
    }

    function readGist () {
        const packer = require('./packer')(config)
        return gistClient().read()
            .then(response => packer.fromGist(response.data))
    }

    function updateGist (bundles) {
        const packer = require('./packer')(config)
        return packer.toGist(bundles)
            .then(data => {
                data.id = config.get('gistId')
                return gistClient().update(data)
            })
            .then(response => response.data.id)
    }

    function deleteGist () {
        return gistClient().delete()
    }

    function listGists () {
        const meta = require('./meta')(config)
        var data
        return gistClient().all()
            .then(response => {
                data = response.data
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
                const metaPackage = meta.unpackMeta(data)

                gistPackages.forEach(gist => {
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
