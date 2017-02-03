# README  

## Codeigniter 3 HMVC Template Movie  

This Neo4j-based php / codeigniter 3 HMV.  
Basically, this is a simple codeigniter application, providing a number of endpoints /graph, /search and /movie. These execute 
hard-coded Cypher queries against the Neo4j Server backend, and parse the results to provide JSON responses to the 
frontend JavaScript code.  

## Requisits System  
  + PHP >=5.6  
  + NEO4J >= 3.*
  + Linux Ubuntu >= 14.*

## Codeigniter API  
  + Codeigniter 3.*
  + HMVC  
  + Template  
  + Assets  
  
##LightSlider API
  From the root directory of this project:
    cd assets/
      sudo apt-get install npm
      npm install lightslider
  


##How to Install
  Clone this project and move files for /var/www/html
  + Example: From the Downloads directory
  * execute, sudo mv name-project/ /var/www/html
```   
          /var/www/html/    
                       application/..  
                       assets/..  
                       system/..  
                       user_guide/..  
                       ...  
```
###
## Alert, necessary changes  
   + Enable rewrite htaccess -> sudo a2enmod rewrite  
   + Modify file /etc/apache2/apache2.conf update for:  
```  
  <Directory />
	Options FollowSymLinks
	AllowOverride All => None
	Require all denied
</Directory>

<Directory /usr/share>
	AllowOverride All => None
	Require all granted
</Directory>

<Directory /var/www/>
	Options Indexes FollowSymLinks  
	AllowOverride All => None
	Require all granted
</Directory>

```
+ Replace All for None

## New password neo4j in    
        /var/www/html/application/libraries/Neo4j.php  
        
        
## The Model

![image of movie model](https://raw.githubusercontent.com/neo4j-examples/neo4j-movies-template/master/img/model.png)

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
* Watch the video until 1:57
* Set your `NEO4J_HOME` variable: `export NEO4J_HOME=Your-Neo4j-Directory`
* From this project's root directory, run the import script:

```
$NEO4J_HOME/bin/neo4j-import --into $NEO4J_HOME/data/databases/graph.db --nodes:Person csv/person_node.csv --nodes:Movie csv/movie_node.csv --nodes:Genre csv/genre_node.csv --nodes:Keyword csv/keyword_node.csv --relationships:ACTED_IN csv/acted_in_rels.csv --relationships:DIRECTED csv/directed_rels.csv --relationships:HAS_GENRE csv/has_genre_rels.csv --relationships:HAS_KEYWORD csv/has_keyword_rels.csv --relationships:PRODUCED csv/produced_rels.csv --relationships:WRITER_OF csv/writer_of_rels.csv --delimiter ";" --array-delimiter "|" --id-type INTEGER
```

If you see `Input error: Directory 'neo4j-community-3.0.3/data/databases/graph.db' already contains a database`, delete the `graph.db` directory and try again.

* Add [constraints](https://neo4j.com/docs/developer-manual/current/cypher/#query-constraints) to your database: `$NEO4J_HOME/bin/neo4j-shell < setup.cql -path $NEO4J_HOME/databases/graph.db`
* Start the database: `$NEO4J_HOME/bin/neo4j start`


##Page

![Page](https://github.com/lucasjovencio/codeigniter-neo4j-movies-template/blob/newsPagesMovie/assets/img/model-page.png)
