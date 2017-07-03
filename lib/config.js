var config = getDefaults()

module.exports = {
    get: getValue,
    set: setValue
}

function getValue (key, defaultValue) {
    if (!key) {
        return config
    }

    if (typeof config[key] === 'undefined') {
        return defaultValue
    }

    return config[key]
}

function setValue (key, value) {
    if (typeof value === 'undefined') {
        config = Object.assign(getDefaults(), key)
    } else {
        config[key] = value
    }

    return config
}

function getDefaults () {
    return {
        basePath: null,
        token: '',
        gistId: '',
        packageName: 'gistPackage'
    }
}
