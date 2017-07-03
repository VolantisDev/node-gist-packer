// A bundle is an object that both describes and contains a gist data element
/**
 * data should be in a format ready to be placed in a gist file
 * 
 * meta should contain at a minimum:
 * - "dataType": The key of the dataType plugin this bundle represents
 * - "name": Either a short identifier, or if this represents a
 *   file, then a relative path to the file ending with the filename
 * 
 * meta can also contain any other data that the data type supports
 */
module.exports = (data, meta) => {
    function getData () {
        return data
    }

    function getMeta () {
        return meta
    }

    function setData (newData) {
        data = newData
    }

    function setMeta (newMeta) {
        meta = newMeta
    }

    return {
        name: () => meta.name,
        dataType: () => meta.dataType,
        getData,
        setData,
        getMeta,
        setMeta
    }
}
