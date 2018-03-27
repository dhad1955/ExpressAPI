module.exports = function( app ) {

    var JsonController = require( '../controllers/json.controller.js' );

    let controllerInstance = new JsonController(require('../storage/redis.storage.js'));

    app.route( '/json/:id' )
        .get( controllerInstance.find )
        .put( controllerInstance.put )
        .delete( controllerInstance.delete );

    app.route( '/json' )
        .get( controllerInstance.all )
        .post( controllerInstance.create );
};
