const Promise = require('bluebird')
const Gists = require('gists')

module.exports = (config => {
    function newGists() {
        const token = config.get('token')
        return new Gists({ token })
    }

    function createGist (bundles) {
        const packer = require('./packer')(config)

        return packer
            .toGist(bundles)
            .then(gistData => {
                return new Promise((resolve, reject) => {
                    newGists().create(gistData, (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    })
                })
            })
            .then(gist => gist.id)
    }

    function readGist () {
        const packer = require('./packer')(config)

        return new Promise((resolve, reject) => {
            newGists().download({ id: config.get('gistId') }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        }).then(packer.fromGist)
    }

    function updateGist (bundles) {
        const packer = require('./packer')(config)

        return packer
            .toGist(bundles)
            .then(data => {
                return new Promise((resolve, reject) => {
                    data.id = config.get('gistId')
                    newGists().edit(data, (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    })
                })
            })
            .then(gist => gist.id)
    }

    function deleteGist () {
        return new Promise((resolve, reject) => {
            newGists()
                .destroy({id: config.get('gistId')}, (error, result) => {
                    if (error) reject(error)
                    else resolve(true)
                })
        })
    }

    function listGists () {
        const meta = require('./meta')(config)

        var gistData

        return new Promise((resolve, reject) => {
            return newGists().all((error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
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
