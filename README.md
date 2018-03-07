## Brief
Develop a CRUD REST/HTTP API proof-of-concept (POC) application which stores data in an in-memory database and serves this back in JSON format.

## How to run
1. docker-compose build
2. docker-compose up
4. See endpoints below

## To develop / run tests
1. docker-compose build
2. docker-compose up
3. npm install
4. npm test


## Endpoints

- **[<code>GET</code> /objects](http://localhost:3000/objects)**
- **[<code>POST</code> /objects](http://localhost:3000/objects/)**
- **[<code>GET</code> /objects/:id](http://localhost:3000/objects/:id)**
- **[<code>PUT</code> /objects/:id](http://localhost:3000/objects/:id)**
- **[<code>DELETE</code> /objects/:id](http://localhost:3000/objects/:id)**
