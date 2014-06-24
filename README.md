============================
Neo4j Movie Website Template
============================

This repository is a movie content browser powered by Neo4j. All movie content is consumed from a Neo4j REST API endpoint built using Neo4j Swagger.

* Neo4j: http://www.neo4j.org/download/
* Swagger: http://neo4j-swagger.tinj.com/
* Node.js: http://nodejs.org/
* Bootstrap: http://getbootstrap.com/
* Angular.js: http://angularjs.org/

### Prerequisites

* An instance of Neo4j (`>=2.0.3`) running locally - [http://www.neo4j.org/download](http://www.neo4j.org/download_thanks?edition=community&release=2.1.0-M01)
* Installed `node.js` and `npm` on your machine

### Usage

Follow the directions below for each component of the platform.

#### Database

* Extract the Neo4j store files located in `database/graph.db.zip` to your Neo4j data directory `neo4j/data`
* Start the Neo4j server at `http://localhost:7474`

#### Movies REST API

* From the terminal, go to the `api` directory of the project and run `npm install`, after `node_modules` are installed, run `node app`. The analytics REST API will be started at `http://localhost:3000`

#### Movies Website
* From the terminal, go to the `web` directory of the project and run `npm install`, after `node_modules` are installed, run `node app`. The analytics dashboard will be started at `http://localhost:5000`