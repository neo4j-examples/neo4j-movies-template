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

### Downloading Neo4j

#### Mac

Option 1: Use [homebrew](brew.sh) to install Neo4j:

`brew install neo4j`

Option 2: Use Neo4j Desktop

* [Download Neo4j Community Edition](https://neo4j.com/download/)

#### Linux

* [Download Neo4j Community Edition](https://neo4j.com/download/other-releases/)

#### Windows

* [Download Neo4j Community Edition](https://neo4j.com/download/)

### Importing Data

Assuming you are in the root of this example project, run the import script below to create a new database. 
The following command will use the data from the `/csv` directory to create a new `database` directory containing the movie database. 

```
neo4j-import --into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

#### Troubleshooting: 'neo4j-import: command not found'

##### Linux

You may have to add your database directory to your `PATH`.
Try `export PATH=$PATH:/.../neo4j-community-3.0.1/bin`

[_source_](http://stackoverflow.com/questions/37741272/neo4j-import-command-not-found-with-neo4j-3-0-1)

##### Neo4j-Desktop on Mac and Windows

If the import script doesn't work and you installed Neo4j-Desktop (Neo4j-Desktop (`.exe` on Windows, `.dmg` on OSX), find your OS [here](https://gist.github.com/jexp/4692ad9cd14b6d9c1cc8bffa079c98fa) and try using the alternate import command for your system.
Update the Neo4j version in the snippet with whatever you're using, and replacing `"$@"` or `%*` with 

```
--into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

For example, this would be the alternate command for Mac OS on Neo4j 3.0.3:

```
java -cp /Applications/Neo4j\ Community\ Edition.app/Contents/Resources/app/bin/neo4j-desktop-3.0.3.jar org.neo4j.tooling.ImportTool --into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

### Start the Database!

* Start Neo4j! 
* Set your username and password
* You should see a database populated with `Movie`, `Genre`, `Keyword`, and `Person` nodes.

## API

From the root directory of this project:

* `cd api`
* `npm install`
* in `config.js`, update the credentials for your database as needed
* `node app.js` starts the API
* Take a look at the docs at [http://localhost:3000/docs](http://localhost:3000/docs)

## Frontend

From the root directory of this project, set up and start the frontend with:

* `cd web`
* `npm install` (if `package.json` changed)
* `bower install` to install the styles
* `cp config/settings.example.js config/settings.js`
* `gulp` (starts the app on [http://localhost:4000/](http://localhost:4000/) )
