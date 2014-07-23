#!/bin/bash 

# if on Mac OS, remember to install homebrew and then
# brew install coreutils

PATH_TO_CSV=$(dirname $(greadlink -f '$0'))
# NEO_DB=/Users/cristina/Documents/NT/neo4j-community-2.1.2
# NEO_DB=your/path/to/neo

echo "LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/nodes/genre_nodes.csv' 
AS line 
FIELDTERMINATOR '|'
WITH line
CREATE (g:Genre {id:toInt(line.id), name:line.name});

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/nodes/person_nodes.csv' 
AS line 
FIELDTERMINATOR '|'
CREATE (p:Person {id:toInt(line.id), name:line.name, poster_image:line.poster_image, born:toInt(line.born)});

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/nodes/movie_nodes.csv' 
AS line 
FIELDTERMINATOR '|'
CREATE (m:Movie {id:toInt(line.id), title:line.title, poster_image:line.poster_image, born:line.born, tagline:line.tagline, summary:line.summary, released:toInt(line.released), duration:toInt(line.duration), rated:line.rated});

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/nodes/keyword_nodes.csv' 
AS line 
FIELDTERMINATOR '|'
CREATE (m:Keyword {id:toInt(line.id), name:line.name});

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/rels/acted_in_rels.csv' 
AS line 
FIELDTERMINATOR '|'
MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
MERGE (p)-[:ACTED_IN {role:line.roles}]->(m);

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/rels/directed_rels.csv' 
AS line 
FIELDTERMINATOR '|'
MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
MERGE (p)-[:DIRECTED]->(m);

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/rels/has_genre_rels.csv' 
AS line 
FIELDTERMINATOR '|'
MATCH (m:Movie {id:toInt(line.movie_id)}), (g:Genre{id:toInt(line.genre_id)})
MERGE (m)-[:HAS_GENRE]->(g);

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/rels/produced_rels.csv' 
AS line 
FIELDTERMINATOR '|'
MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
MERGE (p)-[:PRODUCED]->(m);

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/rels/writer_of_rels.csv' 
AS line 
FIELDTERMINATOR '|'
MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
MERGE (p)-[:WRITER_OF]->(m);

LOAD CSV WITH HEADERS
FROM 'file:${PATH_TO_CSV}/rels/has_keyword_rels.csv' 
AS line 
FIELDTERMINATOR '|'
MATCH (m:Movie {id:toInt(line.movie_id)}), (k:Keyword {id:toInt(line.keyword_id)})
MERGE (m)-[:HAS_KEYWORD]->(k);
" > ${PATH_TO_CSV}/all_the_cypher.cyp

set -e

if [[ -z "$NEO_DB" ]]; then
  echo "Make sure you set \$NEO_DB before running this script"
  echo "you can use 'echo \$(dirname \$(greadlink -f '\$0'))' to find it"
  echo "e.g. (careful with the spaces) export NEO_DB=\"/path/to/neo4j\""
  exit 1
fi

echo "starting up Neo4j instance at ${NEO_DB}"
echo "grabbing data from ${PATH_TO_CSV}/all_the_cypher.cyp"

${NEO_DB}/bin/neo4j status
if [ $? -ne 0 ]; then
  echo "Neo4j not started. Run ${NEO_DB}/bin/neo4j start before running this script" 
fi

${NEO_DB}/bin/neo4j-shell --file ${PATH_TO_CSV}/all_the_cypher.cyp

