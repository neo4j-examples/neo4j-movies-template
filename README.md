# README

This web app originally written by kbastani and theflipside. The API is built with Express 3 and the frontend is witten with React. 
Feel encouraged to fork and update this repo! 

## The Model

### Nodes

* Movie
* Person
* Genre
* Keyword

### Relationships

* `(:Person)-[:ACTED_IN {role:"some role"}]->(:Movie)`
* `(:Person)-[:DIRECTED]->(:Movie)`
* `(:Person)-[:WRITER_OF]->(:Movie)`
* `(:Person)-[:PRODUCED]->(:Movie)`
* `(:MOVIE)-[:HAS_GENRE]->(:Genre)`

## The Data

### Setting up the database

* Download Neo4j: http://neo4j.com/download/
* Verify that it worked by running the Neo4j browser: http://localhost:7474/browser/
* Assumning you are in the root directory, run the following import script to create a new database:

```
neo4j-import --into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

* Using the Neo4j GUI, select the database you just built, and run it!
* You should see a database populated with Movie, Genre, Keyword, and Person nodes.  

## API

Start the API by running `node api/app.js`

Look at the docs at http://localhost:3000/docs

* `cd api`
* `npm install` (if `package.json` changed)
* in `config.js`, update the `neo4j-local` and `neo4j-remote` URLs as needed
* `node app.js` starts the API
* Take a look at the docs at http://localhost:3000/docs

## Front-end

Start the app with:

* `cd web`
* `npm install` (if `package.json` changed)
* `bower install` to install the styles
* copy `config/settings.example.js` to `settings.js`
* `gulp` (starts the app on http://localhost:4000/)