/**
 * @Author: shanshan.pan 
 * @Date: 2018-04-11 14:30:14 
 * @Last Modified by: shanshan.pan
 * @Last Modified time: 2018-12-08 08:50:46
 */

/**
 * @param {Object} input Prepare the object to be cloned.
 *
 * @param {Object} filter The key to change the name.
 *
 * @param {Object} opions Whether deep rename or deep copy
 *
 * @return {Object} The newObj is the cloned object.
 *
 * The newArr is an array of clones.
*/
 function cloneRename( input, filter, opions={} ) {
    let {deepCopy, deepRename} = opions
    if(deepCopy === undefined){
        deepCopy = true
    }
    if(deepRename === undefined){
        deepRename = true
    }
    if ( typeof input === 'object' || input instanceof Function) {
        if ( input instanceof Array ) {
            let newArr = []
            for ( let i=0, length=input.length; i<length; i++ ) {
                let item = input[i]
                if (deepCopy) {
                    if ( typeof item === 'object' ) {
                        newArr.push( cloneRename( item, filter, opions ) )
                    } else {
                        newArr.push( item )
                    }
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
                    if(deepCopy){
                        if ( typeof value === 'object' ) {
                            let obj
                            if(deepRename){
                                obj = cloneRename( value, filter, opions )
                            } else {
                                obj = cloneRename( value, {} , opions )
                            }
                            newObj[cloneRename.filterKey( key, filter )] = obj
                        } else {
                            newObj[cloneRename.filterKey( key, filter )] = value
                        }
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