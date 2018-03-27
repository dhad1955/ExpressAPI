module.exports = function( repository ) {
    /**
     * Create a new object in the datastore
     * Store it in the repository then return the
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

        // Create a new object inside the repository
        // and return the result with the id attached
        repository.create( request.body )
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

        // Find the object
        // and return the result with the id attached
        repository.find( request.params.id )
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
     * Get all objects in the repository
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    this.all = function( request, response ) {

        // Get all objects from the repository then return them
        // with the id attached
        repository.all()
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

        repository.find( request.params.id )
            .then( function() {
                repository.put( request.params.id, request.body )
                    .then( function( result ) {
                        response.status( 200 )
                            .json( result );
                    } )
            } )
            .catch( function() {
                // Created new object
                repository.put( request.params.id, request.body )
                    .then( function( result ) {
                        response.status( 201 )
                            .json( result );
                    } )
            } )
    };

    /**
     * Delete an object from the repository
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
        repository.find( request.params.id )
            .then( function( result ) {
                repository.delete( request.params.id )
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
