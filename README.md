# README

This web app originally written by kbastani and theflipside.
The API is built with Express 4 and the frontend is witten with React. 
Feel encouraged to fork and update this repo! 

## The Model

### Nodes

* `Movie`
* `Person`
* `Genre`
* `Keyword`

### Relationships

* `(:Person)-[:ACTED_IN {role:"some role"}]->(:Movie)`
* `(:Person)-[:DIRECTED]->(:Movie)`
* `(:Person)-[:WRITER_OF]->(:Movie)`
* `(:Person)-[:PRODUCED]->(:Movie)`
* `(:MOVIE)-[:HAS_GENRE]->(:Genre)`

## Setup

### The database

* [Download Neo4j](http://neo4j.com/download/)
* Assuming you are in the root of this example project, run the following import script below to create a new database. This command will create a new `database` directory and populate with an example dataset. 

```
neo4j-import --into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

#### Troubleshooting

If the import script doesn't work, try this alternate command, updating Neo4j version as needed:

```
java -cp /Applications/Neo4j\ Community\ Edition.app/Contents/Resources/app/bin/neo4j-desktop-3.0.3.jar org.neo4j.tooling.ImportTool --into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

* Using the *Neo4j GUI*, select the database you just built, and run it!
* You should see a database populated with `Movie`, `Genre`, `Keyword`, and `Person` nodes.  

## API

From the root directory of this project:

* `cd api`
* `npm install`
* in `config.js`, update the `neo4j-local` and `neo4j-remote` URLs as needed
* `node app.js` starts the API
* Take a look at the docs at [http://localhost:3000/docs](http://localhost:3000/docs)

## Frontend

From the root directory of this project, set up and start the frontend with:

* `cd web`
* `npm install` (if `package.json` changed)
* `bower install` to install the styles
* `cp config/settings.example.js config/settings.js`
* `gulp` (starts the app on [http://localhost:4000/](http://localhost:4000/) )