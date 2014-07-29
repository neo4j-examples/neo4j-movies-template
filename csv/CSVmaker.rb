# lettuce be real tea, this is a better way to get data in/out of your application.

require 'rubygems'
require 'neography'
PATH_FROM_CSV = "file:#{File.expand_path File.dirname(__FILE__)}"
PATH_TO_CSV = File.expand_path File.dirname(__FILE__)

@neo_out = Neography::Rest.new({:protocol => "http://", :server => "162.243.116.40/", :port => ""})
@neo_in = Neography::Rest.new({:protocol => "http://", :server => "localhost", :port => "7474"})

def neo_out_to_csv(input = {})
	file = File.open(input[:path],"w")
	result = @neo_out.execute_query(input[:query_in])
	file.puts result["columns"].join('|')
	result["data"].each {|x| file.puts "#{x.join('|')}"}
end

def csv_in_to_neo(input = {})
  @neo_in.execute_query(input[:query_out])
end

def pull
	@data.each { |things| neo_out_to_csv(things) }
end

def push
	@data.each { |things| csv_in_to_neo(things) }
end

def ping_source
	puts @neo_out.execute_query("RETURN 'source, checking in: '")["data"][0][0] + @neo_out.configuration
  # add message for when there's no connection
end

def ping_target
	puts @neo_in.execute_query("RETURN 'target, checking in: '")["data"][0][0] + @neo_in.configuration
  # add message for when there's no connection
end

@data = [
  {path:"#{PATH_TO_CSV}/nodes/keyword_nodes.csv",
  query_in: "MATCH (n:`Keyword`)
  RETURN DISTINCT id(n) AS id , n.name AS name
  ORDER BY id ASC;",
  query_out: "LOAD CSV WITH HEADERS
  FROM '#{PATH_FROM_CSV}/nodes/keyword_nodes.csv'
  AS line
  FIELDTERMINATOR '|'
  CREATE (m:Keyword {id:toInt(line.id), name:line.name});"
  },
  {path:"#{PATH_TO_CSV}/nodes/genre_nodes.csv",
  query_in: "MATCH (n:`Genre`)
  RETURN DISTINCT id(n) AS id , n.name AS name
  ORDER BY id ASC;",
  query_out: "LOAD CSV WITH HEADERS
    FROM '#{PATH_FROM_CSV}/nodes/genre_nodes.csv'
    AS line
    FIELDTERMINATOR '|'
    WITH line
    CREATE (g:Genre {id:toInt(line.id), name:line.name});"
  },
  {path:"#{PATH_TO_CSV}/nodes/movie_nodes.csv",
  query_in: "MATCH (n:`Movie`)
  RETURN DISTINCT id(n) AS id, n.title AS title, n.tagline AS tagline, n.poster_image AS poster_image, n.duration AS duration, n.rated AS rated
  ORDER BY id ASC;",
  query_out:
    "LOAD CSV WITH HEADERS
    FROM '#{PATH_FROM_CSV}/nodes/movie_nodes.csv'
    AS line
    FIELDTERMINATOR '|'
    CREATE (m:Movie {id:toInt(line.id), title:line.title, poster_image:line.poster_image, born:line.born, tagline:line.tagline, summary:line.summary, released:toInt(line.released), duration:toInt(line.duration), rated:line.rated});"
  },
  {
    path:"#{PATH_TO_CSV}/nodes/person_nodes.csv",
    query_in: "MATCH (n:`Person`)
    RETURN DISTINCT id(n) AS id, n.name AS name, n.born AS born, n.poster_image AS poster_image
    ORDER BY id ASC;",
    query_out:"LOAD CSV WITH HEADERS
      FROM '#{PATH_FROM_CSV}/nodes/person_nodes.csv'
      AS line
      FIELDTERMINATOR '|'
      CREATE (p:Person {id:toInt(line.id), name:line.name, poster_image:line.poster_image, born:toInt(line.born)});"
      },
  {
    path:"#{PATH_TO_CSV}/rels/acted_in_rels.csv",
    query_in: "MATCH (n:`Person`)-[r:ACTED_IN]-(m:`Movie`)
    RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id, r.roles as roles
    ORDER BY person_id ASC;",
    query_out:
      "LOAD CSV WITH HEADERS
      FROM '#{PATH_FROM_CSV}/rels/acted_in_rels.csv'
      AS line
      FIELDTERMINATOR '|'
      MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
      MERGE (p)-[:ACTED_IN {role:line.roles}]->(m);"
      },
  {
    path:"#{PATH_TO_CSV}/rels/directed_rels.csv",
    query_in: "MATCH (n:`Person`)-[r:DIRECTED]-(m:`Movie`)
    RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id
    ORDER BY person_id ASC;",
    query_out:"LOAD CSV WITH HEADERS
      FROM '#{PATH_FROM_CSV}/rels/directed_rels.csv'
      AS line
      FIELDTERMINATOR '|'
      MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
      MERGE (p)-[:DIRECTED]->(m);"
      },
  {
    path:"#{PATH_TO_CSV}/rels/produced_rels.csv",
    query_in: "MATCH (n:`Person`)-[r:PRODUCED]-(m:`Movie`)
    RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id
    ORDER BY person_id ASC;",
    query_out:"LOAD CSV WITH HEADERS
      FROM '#{PATH_FROM_CSV}/rels/produced_rels.csv'
      AS line
      FIELDTERMINATOR '|'
      MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
      MERGE (p)-[:PRODUCED]->(m);"
      },
  {
    path:"#{PATH_TO_CSV}/rels/writer_of_rels.csv",
    query_in: "MATCH (n:`Person`)-[r:WRITER_OF]-(m:`Movie`)
    RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id
    ORDER BY person_id ASC;",
    query_out:"LOAD CSV WITH HEADERS
      FROM '#{PATH_FROM_CSV}/rels/writer_of_rels.csv'
      AS line
      FIELDTERMINATOR '|'
      MATCH (p:Person {id:toInt(line.person_id)}), (m:Movie {id:toInt(line.movie_id)})
      MERGE (p)-[:WRITER_OF]->(m);"
      },
  {
    path:"#{PATH_TO_CSV}/rels/has_keyword_rels.csv",
    query_in: "MATCH (m:`Movie`)-[r:HAS_KEYWORD]-(k:`Keyword`)
    RETURN DISTINCT id(m) AS movie_id, id(k) AS keyword_id
    ORDER BY movie_id ASC;",
    query_out:"LOAD CSV WITH HEADERS
      FROM '#{PATH_FROM_CSV}/rels/has_keyword_rels.csv'
      AS line
      FIELDTERMINATOR '|'
      MATCH (m:Movie {id:toInt(line.movie_id)}), (k:Keyword {id:toInt(line.keyword_id)})
      MERGE (m)-[:HAS_KEYWORD]->(k);"
      },
  {
    path:"#{PATH_TO_CSV}/rels/has_genre_rels.csv",
    query_in: "MATCH (m:`Movie`)-[r:HAS_GENRE]-(g:`Genre`)
    RETURN DISTINCT id(m) AS movie_id, id(g) AS genre_id
    ORDER BY movie_id ASC;",
    query_out:"LOAD CSV WITH HEADERS
      FROM '#{PATH_FROM_CSV}/rels/has_genre_rels.csv'
      AS line
      FIELDTERMINATOR '|'
      MATCH (m:Movie {id:toInt(line.movie_id)}), (g:Genre{id:toInt(line.genre_id)})
      MERGE (m)-[:HAS_GENRE]->(g);"
      },
  {
    path:"#{PATH_TO_CSV}/what_to_what.csv",
    query_in: "MATCH (a)-[r]->(b)
    RETURN DISTINCT head(labels(a)) AS This, type(r) as To, head(labels(b)) AS That;",
    query_out: "MATCH (a)-[r]->(b)
    RETURN DISTINCT head(labels(a)) AS This, type(r) as To, head(labels(b)) AS That;"
  }
]
