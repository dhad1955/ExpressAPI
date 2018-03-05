process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require( 'chai' );
let chaiHttp = require( 'chai-http' );
let should = chai.should();

chai.use( chaiHttp );

let redis = require( 'redis' );

var client = redis.createClient( 6379, process.env.NODE_ENV === 'test' ? 'localhost' : 'redis' );

let model = require( '../app/models/objects.model.js' );
let createdModel = null;

describe( 'model all()', function() {
    it( 'should return an array of all entries with', function( done ) {
        model.all()
            .then( ( entries ) => {
                entries.should.be.an( 'array' );
                done();
            } );
    } )
} );

describe( 'model create', function() {
    it( 'should create an entry and give us an id', function( done ) {
        model.create( { test: 1 } )
            .then( ( result ) => {
                result.should.have.property( 'id' );
                result.should.have.property( 'body' );
                result.body.should.have.property( 'test' );
                createdModel = result;
                done();
            } );
    } )
} );


describe( 'model put', function() {
    it( 'should update our created model with the new id', function() {
        model.put( createdModel.id, { test4: 4 }, function( done ) {
            model.find( createdModel.id )
                .then( ( result ) => {
                    result.body.should.have.property( 'test4' );
                    result.body.should.not.have.property( 'test' );
                    done();
                } )
        } );
    } );

    it( 'should create a new model with our specified id', function( done ) {
        let ourID = 'test123';
        model.put( ourID, { test5: 4 } )
            .then( () => {
                model.find( ourID )
                    .then( ( result ) => {
                        console.log( result.body );
                        result.body.should.have.property( 'test5' );
                        result.body.should.not.have.property( 'test' );
                        done();
                    } )
            } );
    } )
} );

