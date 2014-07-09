# lettuce be real tea, this is a better way to get data in/out of your application. 

require 'rubygems'
require 'neography'

class Manager

  def initialize
  	Neography.configure do |config|
		  config.protocol             = "http://"
		  config.server               = "162.243.116.40/"
		  config.port                 = ""
	  end
  	@neo = Neography::Rest.new
  end

  def put_it_in(input = {})
  	file = File.open(input[:path],"w")
  	result = @neo.execute_query(input[:query])
  	file.puts result["columns"].join('|')
  	result["data"].each {|x| file.puts "#{x.join('|')}"} 
  end

end

queries = [
	{path:"./nodes/keyword_nodes.csv",
	query: "MATCH (n:`Keyword`) 
	RETURN DISTINCT id(n) AS id , n.name AS name 
	ORDER BY id ASC;"
	},
	{path:"./nodes/genre_nodes.csv",
	query: "MATCH (n:`Genre`) 
	RETURN DISTINCT id(n) AS id , n.name AS name 
	ORDER BY id ASC;"
	},
	{path:"./nodes/movie_nodes.csv",
	query: "MATCH (n:`Movie`) 
	RETURN DISTINCT id(n) AS id, n.title AS title, n.tagline AS tagline, n.poster_image AS poster_image, n.duration AS duration, n.rated AS rated
	ORDER BY id ASC;"
	},
	{path:"./nodes/person_nodes.csv",
	query: "MATCH (n:`Person`) 
	RETURN DISTINCT id(n) AS id, n.name AS name, n.born AS born 
	ORDER BY id ASC;"
	},
	{path:"./rels/acted_in_rels.csv",
	query: "MATCH (n:`Person`)-[r:ACTED_IN]-(m:`Movie`) 
	RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id, r.roles as roles 
	ORDER BY person_id ASC;"
	},
	{path:"./rels/directed_rels.csv",
	query: "MATCH (n:`Person`)-[r:DIRECTED]-(m:`Movie`) 
	RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id
	ORDER BY person_id ASC;"
	},
	{path:"./rels/produced_rels.csv",
	query: "MATCH (n:`Person`)-[r:PRODUCED]-(m:`Movie`) 
	RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id
	ORDER BY person_id ASC;"
	},
	{path:"./rels/writer_of_rels.csv",
	query: "MATCH (n:`Person`)-[r:WRITER_OF]-(m:`Movie`) 
	RETURN DISTINCT id(n) AS person_id, id(m) AS movie_id
	ORDER BY person_id ASC;"
	},
	{path:"./rels/has_keyword_rels.csv",
	query: "MATCH (m:`Movie`)-[r:HAS_KEYWORD]-(k:`Keyword`) 
	RETURN DISTINCT id(m) AS movie_id, id(k) AS keyword_id
	ORDER BY movie_id ASC;"
	},
	{path:"./rels/has_genre_rels.csv",
	query: "MATCH (m:`Movie`)-[r:HAS_GENRE]-(g:`Genre`) 
	RETURN DISTINCT id(m) AS movie_id, id(g) AS genre_id
	ORDER BY movie_id ASC;"
	},
	{path:"./what_to_what.csv",
	query: "MATCH (a)-[r]->(b)
	RETURN DISTINCT head(labels(a)) AS This, type(r) as To, head(labels(b)) AS That;"
	}
]
manjson = Manager.new

queries.each { |query| manjson.put_it_in(query) }
