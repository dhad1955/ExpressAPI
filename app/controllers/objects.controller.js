module.exports = {

    /**
     * Create a new object in the datastore
     * Store it in the repository then return the
     * generated id.
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    create: function( request, response ) {

        let parse = JSON.stringify( request.body );

        // Make sure it's valid JSON and we have atleast one key.
        if( !parse || Object.keys( request.body ).length === 0 ) {
            response.status( 400 );
            response.send( 'Malformed input ' + parse );
            return;
        }

        // TODO: Hidden dependency. We need to inject it
        let repository = require( '../repositories/objects.repository.js' );

        // Create a new object inside the repository
        // and return the result with the id attached
        repository.create( request.body )
            .then( ( result ) => {
                response.status( 201 );
                response.json( result );
            } )
            .catch( ( err ) => {
                console.log( err );
                response.status( 500 )
                    .send( 'Error when creating object' );
            } );
    },

    /**
     * Find an object by ID and return it
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    find: function( request, response ) {

        // Have we supplied an ID?
        if( !request.params.id ) {
            response.status( 404 );
            response.send( 'Object not found.' );
            return;
        }

        // TODO: Hidden dependency. We need to inject it
        let repository = require( '../repositories/objects.repository.js' );

        // Find the object
        // and return the result with the id attached
        repository.find( request.params.id )
            .then( ( result ) => {
                response.status( 200 )
                    .json( result );
            } )
            .catch( ( errCode ) => {
                response.status( errCode )
                    .send( 'Object not found' );
            } );
    },

    /**
     * Get all objects in the repository
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    all: function( request, response ) {

        // TODO: Hidden dependency. We need to inject it
        let repository = require( '../repositories/objects.repository.js' );

        // Get all objects from the repository then return them
        // with the id attached
        repository.all()
            .then( ( result ) => {
                response.status( 200 )
                    .json( result );
            } )
            .catch( ( err ) => {
                console.log( err );
                response.status( 500 )
                    .send( 'Error retrieving all objects' );
            } );
    },

    /**
     * Update / PUT an object
     * We supply an ID and create it if it doesn't exist
     * Overwrite it if it does exist
     * Returning the correct HTTP Code
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    put: function( request, response ) {

        // Have we supplied an ID?
        if( !request.params.id ) {
            response.status( 400 );
            response.send( 'Invalid ID specified' );
            return;
        }

        // TODO: Hidden dependency. We need to inject it
        let repository = require( '../repositories/objects.repository.js' );

        repository.find( request.params.id )
            .then( () => {
                // Update
                repository.put( request.params.id, request.body )
                    .then( ( result ) => {
                        response.status( 200 )
                            .json( result );
                    } )
            } )
            .catch( () => {
                // Created new object
                repository.put( request.params.id, request.body )
                    .then( ( result ) => {
                        response.status( 201 )
                            .json( result );
                    } )
            } )
    },

    /**
     * Delete an object from the repository
     * Returning the correct HTTP Code
     * @param request - the request object from Express
     * @param response - the response object from Express
     */
    delete: function( request, response ) {
        // TODO: Hidden dependency. We need to inject it
        let repository = require( '../repositories/objects.repository.js' );

        // Have we supplied an ID?
        if( !request.params.id ) {
            response.status( 400 );
            response.send( 'Invalid ID specified' );
            return;
        }
        // Does our object exist?
        repository.find( request.params.id )
            .then( ( result ) => {
                repository.delete( request.params.id )
                    .then( () => {
                        response.status( 200 )
                            .send( 'Object deleted' );
                    } )
                    .catch( () => {
                        response.status( 500 )
                            .send( 'Error deleting object' );
                    } )
            } )
            .catch( () => {
                // Does not exist so return 404.
                response.status( 404 )
                    .send( 'Object not found' );
            } );
    },
};
