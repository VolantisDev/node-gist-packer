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
        operation = operation || 'pack'

        return new Promise((resolve, reject) => {
            var dataType
            var matched = false

            Object.keys(dataTypes).forEach(key => {
                matched = dataType.handles[operation] && dataType.matches(data)

                if (matched) {
                    dataType = dataTypes[key]
                }

                return !matched
            })

            if (matched) {
                return dataType
            }

            reject('Provided data did not match a known data type')
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

        bundles.forEach((bundle, index) => {
            
            dataTypes[bundle.dataType].unpack(bundle, config)
                .then(data => {
                    results[index] = data
                })
        })

        const requests = bundles.map((bundle, index) => {
            return dataTypes[bundle.dataType].unpack(bundle, config)
                .then(data => {
                    results[index] = data
                })
        })

        return Promise.all(requests).then(() => results)
    }

    function toGist(bundles) {
        return new Promise(() => {
            const meta = require('./meta')(config)
            const packageMeta = meta.packMeta(bundles)
            bundles.unshift(packageMeta)

            const files = {}

            bundles.forEach(bundle => {
                files[bundle.meta.name] = { content: bundle.data }
            })

            return {
                description: config.get('packageName'),
                public: false,
                files: files
            }
        })
    }

    function fromGist(data) {
        return new Promise(() => {
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

            return bundles
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
