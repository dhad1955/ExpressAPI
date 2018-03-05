module.exports = function( app ) {

    let objectController = require( '../controllers/objects.controller.js' );

    app.route( '/objects/:id' )
        .get( objectController.find )
        .put( objectController.put )
        .delete( objectController.delete );

    app.route( '/objects' )
        .get( objectController.all )
        .post( objectController.create );
};
