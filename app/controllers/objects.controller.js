module.exports = {

    // Create a new object
    create: function( request, response ) {
        let parse = JSON.stringify( request.body );

        if( !parse || Object.keys( request.body ).length === 0 ) {
            response.status( 400 );
            response.send( 'Malformed input '+parse);
            return;
        }


        let model = require( '../models/objects.model.js' );

        model.create(request.body )
            .then( (result ) => {
                response.status( 201 );
                response.json( result );
            } )
            .catch( ( err ) => {
                console.log( err );
                response.status( 500 )
                    .send( 'Error when creating object' );
            } );
    },

    // Find an object or return 404 if it doesn't exist
    find: function( request, response ) {

        if( !request.params.id ) {
            response.status( 404 );
            response.send( 'Object not found.' );
            return;
        }

        let model = require( '../models/objects.model.js' );
        model.find( request.params.id )
            .then( ( result ) => {
                response.status( 200 )
                    .json( result );
            } )
            .catch( ( errCode ) => {
                response.status( errCode )
                    .send( 'Object not found' );
            } );
    },

    // Get all objects
    all: function( request, response ) {
        let model = require( '../models/objects.model.js' );
        model.all()
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

    // PUT (update or create) a new object
    put: function( request, response ) {

        if( !request.params.id ) {
            response.status( 400 );
            response.send( 'Invalid ID specified' );
            return;
        }

        let model = require( '../models/objects.model.js' );

        model.find( request.params.id )
            .then( () => {
                // Update
                model.put( request.params.id, request.body )
                    .then( ( result ) => {
                        response.status( 200 )
                            .json( result );
                    } )
            } )
            .catch( () => {
                // Created new model
                model.put( request.params.id, request.body )
                    .then( ( result ) => {
                        response.status( 201 )
                            .json( result );
                    } )
            } )
    },

    // Delete an object (existing object)
    delete: function( request, response ) {
        let model = require( '../models/objects.model.js' );

        if( !request.params.id ) {
            response.status( 400 );
            response.send( 'Invalid ID specified' );
            return;
        }

        model.find( request.params.id )
            .then( ( result ) => {
                model.delete( request.params.id )
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
                response.status( 404 )
                    .send( 'Object not found' );
            } );
    },
};
