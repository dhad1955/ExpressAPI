process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require( 'chai' );
let chaiHttp = require( 'chai-http' );
let should = chai.should();

chai.use( chaiHttp );

let redis = require( 'redis' );

var client = redis.createClient( 6379, process.env.NODE_ENV === 'test' ? 'localhost' : 'redis' );

let repository = require( '../app/repositories/objects.repository.js' );
let createdrepository = null;

describe( 'repository all()', function() {
    it( 'should return an array of all entries with', function( done ) {
        repository.all()
            .then( ( entries ) => {
                entries.should.be.an( 'array' );
                done();
            } );
    } )
} );

describe( 'repository create', function() {
    it( 'should create an entry and give us an id', function( done ) {
        repository.create( { test: 1 } )
            .then( ( result ) => {
                result.should.have.property( 'id' );
                result.should.have.property( 'body' );
                result.body.should.have.property( 'test' );
                createdrepository = result;
                done();
            } );
    } )
} );


describe( 'repository put', function() {
    it( 'should update our created repository with the new id', function() {
        repository.put( createdrepository.id, { test4: 4 }, function( done ) {
            repository.find( createdrepository.id )
                .then( ( result ) => {
                    result.body.should.have.property( 'test4' );
                    result.body.should.not.have.property( 'test' );
                    done();
                } )
        } );
    } );

    it( 'should create a new repository with our specified id', function( done ) {
        let ourID = 'test123';
        repository.put( ourID, { test5: 4 } )
            .then( () => {
                repository.find( ourID )
                    .then( ( result ) => {
                        console.log( result.body );
                        result.body.should.have.property( 'test5' );
                        result.body.should.not.have.property( 'test' );
                        done();
                    } )
            } );
    } )
} );

