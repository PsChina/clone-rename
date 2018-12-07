/**
 * @author Pan·ShanShan
 *
 * @description Last update 2018-04-11.
*/

/**
 * @param {Object} input Prepare the object to be cloned.
 *
 * @param {Object} filter The key to change the name.
 *
 * @return {Object} The newObj is the cloned object.
 *
 * The newArr is an array of clones.
*/
 function cloneRename( input, filter ) {
    if ( typeof input === 'object' || input instanceof Function) {
        if ( input instanceof Array ) {
            let newArr = []
            for ( let i=0, length=input.length; i<length; i++ ) {
                let item = input[i]
                if ( typeof item === 'object' ) {
                    newArr.push( cloneRename( item, filter ) )
                } else {
                    newArr.push( item )
                }
            }
            return newArr
        } else if ( input instanceof Date ) {
            return new Date( input.getTime() )
        } else if ( input instanceof Function ) {
            let funStr = input.toString()
            let paramArr = funStr.substring(funStr.indexOf('(')+1, funStr.indexOf(')')).split(',')
            let funcBody = funStr.substring(funStr.indexOf('{'), funStr.length+1)
            paramArr.push(funcBody)
            return new Function(...paramArr)
        } else if ( input instanceof RegExp ) {
            return new RegExp(input)
        } else if ( input instanceof Object ) {
            let newObj = {}
            for ( let key in input ) {
                if ( input.hasOwnProperty(key) ) {
                    let value = input[key]
                    if ( typeof value === 'object' ) {
                        let obj = cloneRename( value, filter )
                        newObj[cloneRename.filterKey( key, filter )] = obj
                    } else {
                        newObj[cloneRename.filterKey( key, filter )] = value
                    }
                }
            }
            return newObj
        }
    } else {
        return input
    }
}
/**
 * @param {String} key The name of each property of the cloned object.
 *
 * @param {Object} filter The key to change the name.
 *
 * @return {String} New attribute names that are expected to be changed.
*/
cloneRename.filterKey = function( key, filter ) {
    if ( typeof filter === 'object' ) {
        for ( let defauktKey in filter ) {
            if ( key === defauktKey ) {
                key = filter[defauktKey]
            }
        }
    }
    return key
}

export default cloneRename