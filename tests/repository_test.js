process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require( 'chai' );
let chaiHttp = require( 'chai-http' );
let should = chai.should();

chai.use( chaiHttp );


let database = require( '../app/storage/redis.storage.js' );
let createddatabase = null;

describe( 'database all()', function() {
    it( 'should return an array of all entries with', function( done ) {
        database.all()
            .then( ( entries ) => {
                entries.should.be.an( 'array' );
                done();
            } );
    } )
} );

describe( 'database create', function() {
    it( 'should create an entry and give us an id', function( done ) {
        database.create( { test: 1 } )
            .then( ( result ) => {
                result.should.have.property( 'id' );
                result.should.have.property( 'body' );
                result.body.should.have.property( 'test' );
                createddatabase = result;
                done();
            } );
    } )
} );


describe( 'database put', function() {
    it( 'should update our created database with the new id', function() {
        database.put( createddatabase.id, { test4: 4 }, function( done ) {
            database.find( createddatabase.id )
                .then( ( result ) => {
                    result.body.should.have.property( 'test4' );
                    result.body.should.not.have.property( 'test' );
                    done();
                } )
        } );
    } );

    it( 'should create a new database with our specified id', function( done ) {
        let ourID = 'test123';
        database.put( ourID, { test5: 4 } )
            .then( () => {
                database.find( ourID )
                    .then( ( result ) => {
                        console.log( result.body );
                        result.body.should.have.property( 'test5' );
                        result.body.should.not.have.property( 'test' );
                        done();
                    } )
            } );
    } )
} );

