module.exports = function( app ) {

    var ObjectController = require( '../controllers/objects.controller.js' );

    let objectController = new ObjectController(require('../repositories/objects.repository.js'));

    app.route( '/objects/:id' )
        .get( objectController.find )
        .put( objectController.put )
        .delete( objectController.delete );

    app.route( '/objects' )
        .get( objectController.all )
        .post( objectController.create );
};
