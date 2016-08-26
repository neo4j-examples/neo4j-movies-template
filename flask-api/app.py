import os

from flask import Flask, g, request, send_from_directory, abort
from flask_cors import CORS
from flask_restful import Resource
from flask_restful_swagger_2 import Api, swagger, Schema

from neo4j.v1 import GraphDatabase, basic_auth


app = Flask(__name__)
api = Api(app, title='Neo4j Movie Demo API', api_version='0.0.10')
CORS(app)


driver = GraphDatabase.driver('bolt://localhost', auth=basic_auth(os.environ['MOVIE_DATABASE_USERNAME'], os.environ['MOVIE_DATABASE_PASSWORD']))


def get_db():
    if not hasattr(g, 'neo4j_db'):
        g.neo4j_db = driver.session()
    return g.neo4j_db


@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'neo4j_db'):
        g.neo4j_db.close()


class GenreModel(Schema):
    type = 'object'
    properties = {
        'id': {
            'type': 'integer',
        },
        'name': {
            'type': 'string',
        }
    }


class MovieModel(Schema):
    type = 'object'
    properties = {
        'id': {
            'type': 'integer',
        },
        'title': {
            'type': 'string',
        },
        'summary': {
            'type': 'string',
        },
        'released': {
            'type': 'integer',
        },
        'duration': {
            'type': 'integer',
        },
        'rated': {
            'type': 'string',
        },
        'tagline': {
            'type': 'string',
        },
        'poster_image': {
            'type': 'string',
        }
    }


class PersonModel(Schema):
    type = 'object'
    properties = {
        'id': {
            'type': 'integer',
        },
        'name': {
            'type': 'string',
        },
        'born': {
            'type': 'integer',
        },
        'poster_image': {
            'type': 'string',
        }
    }


def serialize_genre(genre):
    return {
        'id': genre['id'],
        'name': genre['name'],
    }


def serialize_movie(movie):
    return {
        'id': movie['id'],
        'title': movie['title'],
        'summary': movie['summary'],
        'released': movie['released'],
        'duration': movie['duration'],
        'rated': movie['rated'],
        'tagline': movie['tagline'],
        'poster_image': movie['poster_image'],
    }


def serialize_person(person):
    return {
        'id': person['id'],
        'name': person['name'],
        'born': person['born'],
        'poster_image': person['poster_image'],
    }


class ApiDocs(Resource):
    def get(self, path=None):
        if not path:
            path = 'index.html'
        return send_from_directory('swaggerui', path)

class GenreList(Resource):
    @swagger.doc({
        'tags': ['genres'],
        'summary': 'Find all genres',
        'description': 'Returns all genres',
        'responses': {
            '200': {
                'description': 'A list of genres',
                'schema': GenreModel,
            }
        }
    })
    def get(self):
        db = get_db()
        result = db.run('MATCH (genre:Genre) RETURN genre')
        return [serialize_genre(record['genre']) for record in result]


class Movie(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Find movie by ID',
        'description': 'Returns a movie',
        'parameters': [
            {
                'name': 'id',
                'description': 'movie id',
                'in': 'path',
                'type': 'integer',
            }
        ],
        'responses': {
            '200': {
                'description': 'A movie',
                'schema': MovieModel,
            },
            '404': {
                'description': 'movie not found'
            },
        }
    })
    def get(self, id):
        db = get_db()
        result = db.run(
            '''
            MATCH (movie:Movie {id: {id}})
            MATCH (movie)<-[r:ACTED_IN]-(a:Person) // movies must have actors
            MATCH (related:Movie)<--(a:Person) // movies must have related movies
            WHERE related <> movie
            OPTIONAL MATCH (movie)-[:HAS_KEYWORD]->(keyword:Keyword)
            OPTIONAL MATCH (movie)-[:HAS_GENRE]->(genre:Genre)
            OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)
            OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)
            OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)
            WITH DISTINCT movie, genre, keyword, d, p, w, a, r, related, count(related) AS countRelated
            ORDER BY countRelated DESC
            RETURN DISTINCT movie,
            collect(DISTINCT keyword) AS keywords,
            collect(DISTINCT d) AS directors,
            collect(DISTINCT p) AS producers,
            collect(DISTINCT w) AS writers,
            collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster_image, role:r.role}) AS actors,
            collect(DISTINCT related) AS related,
            collect(DISTINCT genre) AS genres
            ''', {'id': id}
        )
        for record in result:
            return {
                'id': record['movie']['id'],
                'title': record['movie']['title'],
                'summary': record['movie']['summary'],
                'released': record['movie']['released'],
                'duration': record['movie']['duration'],
                'rated': record['movie']['rated'],
                'tagline': record['movie']['tagline'],
                'poster_image': record['movie']['poster_image'],
                'genres': [serialize_genre(genre) for genre in record['genres']],
                'directors': [serialize_person(director)for director in record['directors']],
                'producers': [serialize_person(producer) for producer in record['producers']],
                'writers': [serialize_person(writer) for writer in record['writers']],
                'actors': [
                    {
                        'id': actor['id'],
                        'name': actor['name'],
                        'role': actor['role'],
                        'poster_image': actor['poster_image'],
                    } for actor in record['actors']
                ],
                'related': [serialize_movie(related) for related in record['related']],
            }
        return {'message': 'movie not found'}, 404


class MovieList(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Find all movies',
        'description': 'Returns a list of movies',
        'responses': {
            '200': {
                'description': 'A list of movies',
                'schema': {
                    'type': 'array',
                    'items': MovieModel,
                }
            }
        }
    })
    def get(self):
        db = get_db()
        result = db.run(
            '''
            MATCH (movie:Movie) RETURN movie
            '''
        )
        return [serialize_movie(record['movie']) for record in result]


class MovieListByGenre(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Find movie by genre id',
        'description': 'Returns a list of movies by genre',
        'parameters': [
            {
                'name': 'genre_id',
                'description': 'genre id',
                'in': 'path',
                'type': 'integer',
                'required': 'true'
            }
        ],
        'responses': {
            '200': {
                'description': 'A list of movies with the specified genre',
                'schema': {
                    'type': 'array',
                    'items': MovieModel,
                }
            }
        }
    })
    def get(self, genre_id):
        db = get_db()
        result = db.run(
            '''
            MATCH (movie:Movie)-[:HAS_GENRE]->(genre)
            WHERE genre.id = {genre_id}
            RETURN movie
            ''', {'genre_id': genre_id}
        )
        return [serialize_movie(record['movie']) for record in result]


class MovieListByDateRange(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Find movie by year range',
        'description': 'Returns a list of movies released between a range of years',
        'parameters': [
            {
                'name': 'start',
                'description': 'start year',
                'in': 'path',
                'type': 'string',
                'required': 'true'
            },
            {
                'name': 'end',
                'description': 'end year',
                'in': 'path',
                'type': 'string',
                'required': 'true'
            }
        ],
        'responses': {
            '200': {
                'description': 'A list of movies released between the specified years',
                'schema': {
                    'type': 'array',
                    'items': MovieModel,
                }
            }
        }
    })
    def get(self, start, end):
        db = get_db()
        result = db.run(
            '''
            MATCH (movie:Movie)
            WHERE movie.released > {start} AND movie.released < {end}
            RETURN movie
            ''', {'start': start, 'end': end}
        )
        return [serialize_movie(record['movie']) for record in result]


class MovieListByPersonActedIn(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Find movies by actor',
        'description': 'Returns a list of movies that a person has acted in.',
        'parameters': [
            {
                'name': 'person_id',
                'description': 'person id',
                'in': 'path',
                'type': 'integer',
                'required': 'true'
            },
        ],
        'responses': {
            '200': {
                'description': 'A list of movies the specified person has acted in',
                'schema': {
                    'type': 'array',
                    'items': MovieModel,
                }
            }
        }
    })
    def get(self, person_id):
        db = get_db()
        result = db.run(
            '''
            MATCH (actor:Person {id: {person_id}})-[:ACTED_IN]->(movie:Movie)
            RETURN DISTINCT movie
            ''', {'person_id': person_id}
        )
        return [serialize_movie(record['movie']) for record in result]


class MovieListByWrittenBy(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Find movies by writer',
        'description': 'Returns a list of movies writen by a person',
        'parameters': [
            {
                'name': 'person_id',
                'description': 'person id',
                'in': 'path',
                'type': 'integer',
                'required': 'true'
            },
        ],
        'responses': {
            '200': {
                'description': 'A list of movies the specified person has written',
                'schema': {
                    'type': 'array',
                    'items': MovieModel,
                }
            }
        }
    })
    def get(self, person_id):
        db = get_db()
        result = db.run(
            '''
            MATCH (actor:Person {id: {person_id}})-[:WRITER_OF]->(movie:Movie)
            RETURN DISTINCT movie
            ''', {'person_id': person_id}
        )
        return [serialize_movie(record['movie']) for record in result]


class MovieListByDirectedBy(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Find movies by director',
        'description': 'Returns a list of movies directed by a person',
        'parameters': [
            {
                'name': 'person_id',
                'description': 'person id',
                'in': 'path',
                'type': 'integer',
                'required': 'true'
            },
        ],
        'responses': {
            '200': {
                'description': 'A list of movies the specified person has directed',
                'schema': {
                    'type': 'array',
                    'items': MovieModel,
                }
            }
        }
    })
    def get(self, person_id):
        db = get_db()
        result = db.run(
            '''
            MATCH (actor:Person {id: {person_id}})-[:DIRECTED]->(movie:Movie)
            RETURN DISTINCT movie
            ''', {'person_id': person_id}
        )
        return [serialize_movie(record['movie']) for record in result]


class Person(Resource):
    @swagger.doc({
        'tags': ['people'],
        'summary': 'Find person by id',
        'description': 'Returns a person',
        'parameters': [
            {
                'name': 'id',
                'description': 'person id',
                'in': 'path',
                'type': 'integer',
                'required': True
            }
        ],
        'responses': {
            '200': {
                'description': 'A person',
                'schema': PersonModel,
            },
            '404': {
                'description': 'person not found'
            },
        }
    })
    def get(self, id):
        db = get_db()
        results = db.run(
            '''
            MATCH (person:Person {id: {id}})
            OPTIONAL MATCH (person)-[:DIRECTED]->(d:Movie)
            OPTIONAL MATCH (person)<-[:PRODUCED]->(p:Movie)
            OPTIONAL MATCH (person)<-[:WRITER_OF]->(w:Movie)
            OPTIONAL MATCH (person)<-[r:ACTED_IN]->(a:Movie)
            OPTIONAL MATCH (person)-->(movies)<-[relatedRole:ACTED_IN]-(relatedPerson)
            RETURN DISTINCT person,
            collect(DISTINCT { name:d.title, id:d.id, poster_image:d.poster_image}) AS directed,
            collect(DISTINCT { name:p.title, id:p.id, poster_image:p.poster_image}) AS produced,
            collect(DISTINCT { name:w.title, id:w.id, poster_image:w.poster_image}) AS wrote,
            collect(DISTINCT{ name:a.title, id:a.id, poster_image:a.poster_image, role:r.role}) AS actedIn,
            collect(DISTINCT{ name:relatedPerson.name, id:relatedPerson.id, poster_image:relatedPerson.poster_image, role:relatedRole.role}) AS related
            ''', {'id': id}
        )
        for record in results:
            return {
                'id': record['person']['id'],
                'name': record['person']['name'],
                'born': record['person']['born'],
                'poster_image': record['person']['poster_image'],
                'directed': [
                    {
                        'id': movie['id'],
                        'name': movie['name'],
                        'poster_image': movie['poster_image'],
                    } for movie in record['directed']
                ],
                'produced': [
                    {
                        'id': movie['id'],
                        'name': movie['name'],
                        'poster_image': movie['poster_image'],
                    } for movie in record['produced']
                ],
                'wrote': [
                    {
                        'id': movie['id'],
                        'name': movie['name'],
                        'poster_image': movie['poster_image'],
                    } for movie in record['wrote']
                ],
                'actedIn': [
                    {
                        'id': movie['id'],
                        'name': movie['name'],
                        'poster_image': movie['poster_image'],
                        'role': movie['role'],
                    } for movie in record['actedIn']
                ],
                'related': [
                    {
                        'id': person['id'],
                        'name': person['name'],
                        'poster_image': person['poster_image'],
                        'role': person['role'],
                    } for person in record['related']
                ],
            }
        return {'message': 'person not found'}, 404


class PersonList(Resource):
    @swagger.doc({
        'tags': ['people'],
        'summary': 'Find all people',
        'description': 'Returns a list of people',
        'responses': {
            '200': {
                'description': 'A list of people',
                'schema': {
                    'type': 'array',
                    'items': PersonModel,
                }
            }
        }
    })
    def get(self):
        db = get_db()
        results = db.run(
            '''
            MATCH (person:Person) RETURN person
            '''
        )
        return [serialize_person(record['person']) for record in results]


class PersonBacon(Resource):
    @swagger.doc({
        'tags': ['people'],
        'summary': 'Find all Bacon paths',
        'description': 'Returns all bacon paths from person 1 to person 2',
        'parameters': [
            {
                'name': 'name1',
                'description': 'Name of the origin user',
                'in': 'query',
                'type': 'string',
                'required': True,
            },
            {
                'name': 'name2',
                'description': 'Name of the target user',
                'in': 'query',
                'type': 'string',
                'required': True,
            }
        ],
        'responses': {
            '200': {
                'description': 'A list of people',
                'schema': {
                    'type': 'array',
                    'items': PersonModel,
                }
            }
        }
    })
    def get(self):
        name1 = request.args['name1']
        name2 = request.args['name2']
        db = get_db()
        results = db.run(
            '''
            MATCH p = shortestPath( (p1:Person {name:{name1} })-[:ACTED_IN*]-(target:Person {name:{name2} }) )
            WITH extract(n in nodes(p)|n) AS coll
            WITH filter(thing in coll where length(thing.name)> 0) AS bacon
            UNWIND(bacon) AS person
            RETURN DISTINCT person
            ''', {'name1': name1, 'name2': name2}
        )
        return [serialize_person(record['person']) for record in results]


api.add_resource(ApiDocs, '/docs', '/docs/<path:path>')
api.add_resource(GenreList, '/api/v0/genres')
api.add_resource(Movie, '/api/v0/movies/<int:id>')
api.add_resource(MovieList, '/api/v0/movies')
api.add_resource(MovieListByGenre, '/api/v0/movies/genre/<int:genre_id>/')
api.add_resource(MovieListByDateRange, '/api/v0/movies/daterange/<string:start>/<string:end>')
api.add_resource(MovieListByPersonActedIn, '/api/v0/movies/acted_in_by/<int:person_id>')
api.add_resource(MovieListByWrittenBy, '/api/v0/movies/written_by/<int:person_id>')
api.add_resource(MovieListByDirectedBy, '/api/v0/movies/directed_by/<int:person_id>')
api.add_resource(Person, '/api/v0/people/<int:id>')
api.add_resource(PersonList, '/api/v0/people')
api.add_resource(PersonBacon, '/api/v0/people/bacon')
