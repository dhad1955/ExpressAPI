process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require( 'chai' );
let chaiHttp = require( 'chai-http' );
let server = require( '../server' );
let should = chai.should();

chai.use( chaiHttp );

var allObjects = [];

describe( 'Objects', function() {
    it( 'should get all the objects in the database', function( done ) {
        chai.request( server )
            .get( '/objects' )
            .end( ( err, res ) => {
                res.should.have.status( 200 );
                res.body.should.be.an( 'array' );
                allObjects = res.body;
                done();
            } )
    } );

    describe( 'Objects /POST', function() {
        it( 'Should create an object succesfully', function( done ) {
            chai.request( server )
                .post( '/objects' )
                .send( { key: 'value', key1: 'value' } )
                .end( ( err, res ) => {
                    res.should.have.status( 201 );
                    res.should.be.an( 'object' );
                    res.body.should.have.property( 'id' );
                    done();
                } );
        } );

        it( 'Should return 400 for an empty body', function( done ) {
            chai.request( server )
                .post( '/objects' )
                .send( null )
                .end( ( err, res ) => {
                    res.should.have.status( 400 );
                    done();
                } )
        } )
    } );

    describe( 'Objects /GET/id', function() {
        it( 'should return a 404 for an invalid id', function( done ) {
            chai.request( server )
                .get( '/objects/invalidId' )
                .end( ( err, res ) => {
                    res.should.have.status( 404 );
                    done();
                } )
        } );

        it( 'should return a valid object', function( done ) {
            chai.request( server )
                .get( '/objects/' + allObjects[ 0 ].id )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    res.body.should.have.property( 'id' );
                    res.should.have.property( 'body' );
                    res.body.should.be.an( 'object' );
                    done();
                } );
        } );
    } );

    describe( 'Objects /PUT/id', function() {
        let uuid = require( 'uuid' );
        let generatedId = uuid();

        it( 'should return a valid response for creating a new object', function( done ) {
            chai.request( server )
                .put( '/objects/' + generatedId )
                .send( { key: 'value' } )
                .end( ( err, res ) => {
                    res.should.have.status( 201 );
                    res.body.should.have.property( 'id' );
                    res.body.id.should.equal( generatedId );
                    res.body.should.have.property( 'body' );
                    res.body.body.should.have.property( 'key' );
                    done();
                } );
        } );

        it( 'should give a 200 and return the updated object when one already exists', function( done ) {
            let testingObject = allObjects[ 0 ];
            chai.request( server )
                .put( '/objects/' + testingObject.id )
                .send( { key: 'value2' } )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    res.body.should.have.property( 'id' );
                    res.body.id.should.equal( testingObject.id );
                    res.body.body.key.should.equal( 'value2' );
                    done();
                } )
        } );
    } );

    describe( 'OBJECTS /DELETE/id', function() {
        let testingObject = allObjects[ 0 ];
        it( 'should return a 404 if the object does not exist', function( done ) {
            chai.request( server )
                .delete( '/objects/SomethingInvalidThatDoesntExist' )
                .end( ( err, res ) => {
                    res.should.have.status( 404 );
                    done();
                } );
        } );

        it( 'should return 200 if the object was deleted', function( done ) {
            chai.request( server )
                .delete( '/objects/' + allObjects[ 0 ].id )
                .end( ( err, res ) => {
                    res.should.have.status( 200 );
                    done();
                } )
        } )
    } );
} );
