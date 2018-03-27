module.exports = function( database ) {
    /**
     * Create a new object in the datastore
     * Store it in the database then return the
     * generated id.
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    this.create = function( request, response ) {

        let parse = JSON.stringify( request.body );

        // Make sure it's valid JSON and we have atleast one key.
        if( !parse || Object.keys( request.body ).length === 0 ) {
            response.status( 400 );
            response.send( 'Malformed input ' + parse );
            return;
        }


        database.create( request.body )
            .then( function( result ) {

                response.status( 201 );
                response.json( result );

            } )
            .catch( function(  ) {

                response.status( 500 )
                    .send( 'Error when creating object' );

            } );
    };

    /**
     * Find an object by ID and return it
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    this.find = function( request, response ) {

        // Have we supplied an ID?
        if( !request.params.id ) {
            response.status( 404 );
            response.send( 'Object not found.' );
            return;
        }

        database.find( request.params.id )
            .then( function( result ) {

                response.status( 200 )
                    .json( result );

            } )
            .catch( function( errCode ) {

                response.status( errCode )
                    .send( 'Object not found' );

            } );
    };

    /**
     * Get all objects in the database
     * @param request - the request object from Express
     * @param response - the response object from Express
     */

    this.all = function( request, response ) {


        database.all()
            .then( function( result ) {

                response.status( 200 )
                    .json( result );

            } )
            .catch( function( err ) {

                response.status( 500 )
                    .send( 'Error retrieving all objects' );

            } );
    };

    /**
     * Update / PUT an object
     * We supply an ID and create it if it doesn't exist
     * Overwrite it if it does exist
     * Returning the correct HTTP Code
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    this.put = function( request, response ) {

        // Have we supplied an ID?
        if( !request.params.id ) {
            response.status( 400 );
            response.send( 'Invalid ID specified' );
            return;
        }

        database.find( request.params.id )
            .then( function() {

                database.put( request.params.id, request.body )
                    .then( function( result ) {
                        response.status( 200 )
                            .json( result );
                    } )

            } )
            .catch( function() {

                database.put( request.params.id, request.body )
                    .then( function( result ) {

                        response.status( 201 )
                            .json( result );

                    } )

            } )
    };

    /**
     * Delete an object from the database
     * Returning the correct HTTP Code
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    this.delete = function( request, response ) {

        // Have we supplied an ID?
        if( !request.params.id ) {
            response.status( 400 );
            response.send( 'Invalid ID specified' );
            return;
        }

        // Does our object exist?
        database.find( request.params.id )
            .then( function( result ) {

                database.delete( request.params.id )
                    .then( function() {

                        response.status( 200 )
                            .send( 'Object deleted' );

                    } )
                    .catch( function() {

                        response.status( 500 )
                            .send( 'Error deleting object' );

                    } )

            } )
            .catch( function() {
                // Does not exist so return 404.
                response.status( 404 )
                    .send( 'Object not found' );

            } );
    }
};
