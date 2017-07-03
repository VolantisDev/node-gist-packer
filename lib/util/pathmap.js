const path = require('path')

module.exports = {
    shortPath,
    fullPath
}

function shortPath(fullPath, config) {
    const basePath = config.get('basePath')
    if (!basePath) {
        return fullPath
    }

    return fullPath.slice(fullPath.indexOf(basePath) + basePath.length)
}

function fullPath(shortPath, config) {
    if (!config.get('basePath')) {
        return shortPath
    }

    return path.resolve(config.get('basePath'), shortPath)
}
