module.exports = (config => {
    const Bundle = require('../bundle')
    var packer = require('./packer')(config)
    var filename = 'gist-packer-meta.json'

    /**
     * Gather all meta information from supplied bundles and pack into a gist bundle
     * 
     * @param {*} bundles 
     */
    function packMeta (bundles) {
        const metaMeta = { dataType: 'meta', packageName: config.get('packageName', 'gistPackage') }
        return packer
            .pack(bundles, metaMeta)
            .then(metaBundleArray => metaBundleArray.pop())
    }

    /**
     * Unpack the meta information from the supplied gist data
     * 
     * @param {*} data 
     */
    function unpackMeta (data) {
        const bundle = Bundle(data.files[filename].content, { name: filename, dataType: 'meta' })
        delete data.files[filename]
        return packer.unpack(bundle)
    }

    return {
        filename,
        packMeta,
        unpackMeta
    }
})
