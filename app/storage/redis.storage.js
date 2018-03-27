let redis = require('redis');

/**
 * Our client for this database
 * In this case we are using redis.
 */
exports.client = redis.createClient(6379, process.env.NODE_ENV == 'test' ? 'localhost' : 'redis');

/**
 * Find an object by ID and return it (decorateed)
 * @see decorate
 * @param id - The object ID
 * @returns {Promise}
 */
exports.find = function( id ) {
    return new Promise( ( resolve, reject ) => {
        this.client.get( id, ( err, res ) => {
            if( !res ) {
                reject( 404 );
            } else {
                resolve( this.decorate( id, (JSON.parse( res )) ) );
            }
        } )
    } );
};

/**
 * Create an object and return the id (decorated)
 * @see decorate
 * @param body
 * @returns {Promise}
 */
exports.create = function( body ) {
    let uuidv1 = require( 'uuid' );
    let id = uuidv1();
    return new Promise( ( resolve, reject ) => {
        this.client.set( id, JSON.stringify( body ), (( err, result ) => {
            if( err ) {
                return reject( err );
            }
            return resolve( this.decorate( id, body ) );
        }) )

    } )
};

/**
 * Return all objects and concat them decorateed
 * @see decorate
 * @returns {Promise}
 */
exports.all = function() {
    return new Promise( ( resolve, reject ) => {
        this.client.keys( '*', ( err, keys ) => {
            let output = [];
            let index = 0;
            // Asynchronous hell with node..
            let iterator = () => {
                // Operation finished
                if( index >= keys.length ) {
                    resolve( output );
                    return;
                }

                this.client.get( keys[ index ], ( err, res ) => {
                    output.push( this.decorate( keys[ index ], (res) ) );
                    index++;
                    iterator();
                } );
            };
            iterator();
        } );

    } )
};

/**
 * PUT or overwrite an object
 * @param id - the object ID
 * @param body - the body of the Object
 * @returns {Promise}
 */
exports.put = function( id, body ) {
    return new Promise( ( resolve, reject ) => {
        this.client.set( id, JSON.stringify( body ), ( err, res ) => {
            resolve( this.decorate( id, body ) );
        } );
    } );
};

/**
 * Delete an object
 * @param id - the ID of the object
 * @returns {Promise}
 */
exports.delete = function( id ) {
    return new Promise( ( resolve, reject ) => {
        this.client.del( id, ( err ) => {
            if( err ) {
                reject( err );
            } else {
                resolve();
            }
        } )
    } )
};
/**
 * ecorate an object with the ID
 * returning {id: id, body: body)
 * @param id - the object ID
 * @param body - the body of the object
 * @returns {{id: *, body: *}}
 */
exports.decorate = function( id, body ) {
    // Defensive programming
    if( typeof body === 'string' ) {
        body = JSON.parse( body );
    }
    return { id: id, body: body };
};


