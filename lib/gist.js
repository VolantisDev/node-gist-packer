const GitHub = require('github-api')

module.exports = (config => {
    function gistClient() {
        const token = config.get('token')
        const gh = new GitHub({ token })
        return gh.getGist()
    }

    function createGist (bundles) {
        const packer = require('./packer')(config)
        return packer
            .toGist(bundles)
            .then(data => gistClient().create(data))
            .then(response => response.data.id)
    }

    function readGist () {
        const packer = require('./packer')(config)
        return gistClient()
            .download({ id: config.get('gistId') })
            .then(packer.fromGist)
    }

    function updateGist (bundles) {
        const packer = require('./packer')(config)
        return packer
            .toGist(bundles)
            .then(data => {
                data.id = config.get('gistId')
                return gistClient().edit(data)
            })
            .then(gist => gist.id)
    }

    function deleteGist () {
        return gistClient()
            .destroy({id: config.get('gistId')})
    }

    function listGists () {
        const meta = require('./meta')(config)
        var data
        return gistClient()
            .all()
            .then(gistData => {
                data = gistData
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
