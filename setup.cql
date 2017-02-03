// setup for movie template 

CREATE CONSTRAINT ON (n:Movie) ASSERT n.id IS UNIQUE;

CREATE CONSTRAINT ON (n:Person) ASSERT n.id IS UNIQUE;

CREATE CONSTRAINT ON (n:Keyword) ASSERT n.id IS UNIQUE;

CREATE CONSTRAINT ON (n:User) ASSERT n.id IS UNIQUE;

CREATE CONSTRAINT ON (n:User) ASSERT n.username IS UNIQUE;

CREATE CONSTRAINT ON (n:Genre) ASSERT n.id IS UNIQUE;

CREATE CONSTRAINT ON ()-[r:RATED]-() ASSERT exists(r.rating);

// LOAD CSV WITH HEADERS FROM 'file:///ratings.csv' AS line
// MATCH (m:Movie {id:toInt(line.movie_id)})  
// MERGE (u:User {id:line.user_id, username:line.user_username}) // user ids are strings
// MERGE (u)-[r:RATED]->(m)
// SET r.rating = toInt(line.rating)
// RETURN m.title, r.rating, u.username;
