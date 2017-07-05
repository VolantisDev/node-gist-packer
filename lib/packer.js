const Promise = require('bluebird')

module.exports = config => {
    const dataTypes = require('./data-types')

    function getDataTypes () {
        return dataTypes
    }

    function setDataType (key, dataType) {
        dataTypes[key] = dataType
        return dataTypes
    }

    function resolveDataType (data, operation) {
        return new Promise((resolve, reject) => {
            operation = operation || 'pack'
            var dataType
            var matched = false

            for (var key of Object.keys(dataTypes)) {
                dataType = dataTypes[key]
                matched = dataType.handles[operation] && dataType.matches(data)

                if (matched) {
                    break;
                }
            }

            if (matched) {
                resolve(dataType)
            } else {
                console.error(data)
                reject('Provided data did not match a known data type')
            }
        })
    }

    function pack (data, meta) {
        return resolveDataType(data, 'pack')
            .then(dataType => {
                return dataType.pack(data, meta, config)
            })
    }

    function unpack (bundles) {
        const results = []

        const requests = bundles.map((bundle, index) => {
            return dataTypes[bundle.dataType].unpack(bundle, config)
                .then(data => {
                    results[index] = data
                })
        })

        return Promise.all(requests).then(() => results)
    }

    function toGist(bundles) {
        return new Promise(resolve => {
            const meta = require('./meta')(config)

            meta.packMeta(bundles)
                .then(metaBundle => {
                    bundles.unshift(metaBundle)
                })
                .then(() => {
                    const files = {}

                    bundles.forEach(bundle => {
                        files[bundle.name()] = { content: bundle.getData() }
                    })

                    resolve({
                        description: config.get('packageName'),
                        public: false,
                        files: files
                    })
                })
        })
    }

    function fromGist(data) {
        return new Promise(resolve => {
            const Bundle = require('../bundle')
            const meta = require('./meta')(config)
            const packageMeta = meta.unpackMeta(data)

            const bundles = []

            Object.keys(data.files).forEach(name => {
                const fileData = data.files[name]

                if (typeof packageMeta[name] !== 'undefined') {
                    bundles.push(Bundle(fileData, packageMeta[name]))
                }
            })

            resolve(bundles)
        })
    }

    return {
        getDataTypes,
        setDataType,
        pack,
        unpack,
        toGist,
        fromGist
    }
}
