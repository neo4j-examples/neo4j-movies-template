# README

This Neo4j-based node / react web app displays movie and person data in a manner similar to IMDB.
It is designed to serve as a template for further development projects. 
Feel encouraged to fork and update this repo! 

## The Model

![image of movie model](./img/model.png)

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

## Database Setup

### Unix _[Video Instructions](https://youtu.be/O71B2KcTD6A)_

* [Download Neo4j Community Edition: .tar Version](https://neo4j.com/download/other-releases/)
* [video instructions start here](https://youtu.be/O71B2KcTD6A)
* Set your `NEO4J_HOME` variable: `export NEO4J_HOME=/path/to/neo4j-community`
* Add constraints to your database: `$NEO4J_HOME/bin/neo4j-shell < setup.cql`
* From this project's root directory, run the import script:

```
$NEO4J_HOME/bin/neo4j-import --into $NEO4J_HOME/data/databases/graph.db --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

If you see `Input error: Directory 'neo4j-community-3.0.3/data/databases/graph.db' already contains a database`, delete the `graph.db` directory and try again.

* Start the database: `$NEO4J_HOME/bin/neo4j console`

### Windows

[Download Neo4j Community Edition](https://neo4j.com/download/)

`neo4j-import` does not come with Neo4j-Desktop (`.exe` on Windows, `.dmg` on OSX).
To get around this issue, find your OS [here](https://gist.github.com/jexp/4692ad9cd14b6d9c1cc8bffa079c98fa) and try using the alternate import command for your system.
Update the Neo4j version in the snippet with whatever you're using, and replacing `"$@"` or `%*` with: 

```
--into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

For example, this would be the alternate command for Windows on Neo4j 3.0.3:

```
"C:\Program Files\Neo4j Community\jre\bin\java" -cp "C:\Program Files\Neo4j Community\bin\neo4j-desktop-3.0.3.jar" org.neo4j.tooling.ImportTool --into database/ --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

Use the GUI to select and start your database. 

### Start the Database!

* Start Neo4j if you haven't already! 
* Set your username and password
* You should see a database populated with `Movie`, `Genre`, `Keyword`, and `Person` nodes.

## Node API

From the root directory of this project:

* `cd api`
* `npm install`
* in `config.js`, update the credentials for your database as needed
* `node app.js` starts the API
* Take a look at the docs at [http://localhost:3000/docs](http://localhost:3000/docs)

## Alternative: Flask API

From the root directory of this project:

* `cd flask-api`
* `pip install -r requirements.txt` (you should be using a virtualenv)
* set your neo4j database username `export MOVIE_DATABASE_USERNAME=myusername`
* set your neo4j database password `export MOVIE_DATABASE_PASSWORD=mypassword`
* `export FLASK_APP=app.py`
* `flask run` starts the API
* Take a look at the docs at [http://localhost:5000/docs](http://localhost:5000/docs)

## Frontend

From the root directory of this project, set up and start the frontend with:

* `cd web`
* `npm install` (if `package.json` changed)
* `bower install` to install the styles
* update config.settings.js file
** if you are using the Node API: `cp config/settings.example.js config/settings.js`
** if you are using the flask api then edit `config/settings.js` and change the `apiBaseUrl` to `http://localhost:5000/api/v0`
* `gulp` starts the app on [http://localhost:4000/](http://localhost:4000/)
