module.exports = {

    find: function( id ) {
        return new Promise( ( resolve, reject ) => {
            global.client.get( id, ( err, res ) => {
                if( !res ) {
                    reject( 404 );
                } else {
                    resolve( this.transform( id, (JSON.parse(res)) ) );
                }
            } )
        } );
    },


    create: function( body ) {
        let uuidv1 = require( 'uuid' );
        let id = uuidv1();
        return new Promise( ( resolve, reject ) => {
            global.client.set( id, JSON.stringify(body), (( err, result ) => {
                if( err ) {
                    return reject( err );
                }
                return resolve( this.transform( id, body ) );
            }) )

        } )
    },

    all: function() {
        return new Promise( ( resolve, reject ) => {
            global.client.keys( '*', ( err, keys ) => {
                let output = [];
                let index = 0;
                let iterator = () => {

                    if( index >= keys.length ) {
                        resolve( output );
                        return;
                    }

                    global.client.get( keys[ index ], ( err, res ) => {
                        output.push( this.transform( keys[ index ], (res) ) );
                        index++;
                        iterator();
                    } );
                };
                iterator();
            } );

        } )
    },


    put: function( id, body ) {
        return new Promise( ( resolve, reject ) => {
            global.client.set( id, JSON.stringify(body), ( err, res ) => {
                resolve( this.transform( id, body ) );
            } );
        } );
    },

    delete: function( id, body ) {
        return new Promise( ( resolve, reject ) => {
            global.client.del( id, ( err ) => {
                if( err ) {
                    reject( err );
                } else {
                    resolve();
                }
            } )
        } )
    },

    transform: function( id, body ) {

        if(typeof body ==  'string') {
            body = JSON.parse(body);
        }

        return { id: id, body: body };
    }
};
