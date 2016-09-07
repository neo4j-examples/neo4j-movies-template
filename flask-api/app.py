import binascii
import hashlib
import os
import re
import sys
import uuid
from functools import wraps

from flask import Flask, g, request, send_from_directory, abort, request_started
from flask_cors import CORS
from flask_restful import Resource, reqparse
from flask_restful_swagger_2 import Api, swagger, Schema

from neo4j.v1 import GraphDatabase, basic_auth, ResultError

from . import config


app = Flask(__name__)
app.config['SECRET_KEY'] = 'super secret guy'
api = Api(app, title='Neo4j Movie Demo API', api_version='0.0.10')
CORS(app)


driver = GraphDatabase.driver('bolt://localhost', auth=basic_auth(config.DATABASE_USERNAME, str(config.DATABASE_PASSWORD)))


def get_db():
    if not hasattr(g, 'neo4j_db'):
        g.neo4j_db = driver.session()
    return g.neo4j_db


@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'neo4j_db'):
        g.neo4j_db.close()


def set_user(sender, **extra):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        g.user = {'id': None}
        return
    match = re.match(r'^Token (\S+)', auth_header)
    if not match:
        return {'message': 'invalid authorization format. Follow `Token <token>`'}, 401
    token = match.group(1)

    db = get_db()
    results = db.run(
        '''
            MATCH (user:User {api_key: {api_key}}) RETURN user
            ''', {'api_key': token}
    )
    try:
        g.user = results.single()['user']
    except ResultError:
        return {'message': 'invalid authorization key'}, 401
request_started.connect(set_user, app)


def login_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return {'message': 'no authorization provided'}, 401
        return f(*args, **kwargs)
    return wrapped


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
        },
        'my_rating': {
            'type': 'integer',
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


class UserModel(Schema):
    type = 'object'
    properties = {
        'id': {
            'type': 'string',
        },
        'username': {
            'type': 'string',
        },
        'avatar': {
            'type': 'object',
        }
    }


def serialize_genre(genre):
    return {
        'id': genre['id'],
        'name': genre['name'],
    }


def serialize_movie(movie, my_rating=None):
    return {
        'id': movie['id'],
        'title': movie['title'],
        'summary': movie['summary'],
        'released': movie['released'],
        'duration': movie['duration'],
        'rated': movie['rated'],
        'tagline': movie['tagline'],
        'poster_image': movie['poster_image'],
        'my_rating': my_rating,
    }


def serialize_person(person):
    return {
        'id': person['id'],
        'name': person['name'],
        'born': person['born'],
        'poster_image': person['poster_image'],
    }


def serialize_user(user):
    return {
        'id': user['id'],
        'username': user['username'],
        'avatar': {
            'full_size': 'https://www.gravatar.com/avatar/{}?d=retro'.format(hash_avatar(user['username']))
        }
    }


def hash_password(username, password):
    if sys.version[0] == 2:
        s = '{}:{}'.format(username, password)
    else:
        s = '{}:{}'.format(username, password).encode('utf-8')
    return hashlib.sha256(s).hexdigest()


def hash_avatar(username):
    if sys.version[0] == 2:
        s = username
    else:
        s = username.encode('utf-8')
    return hashlib.md5(s).hexdigest()


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
                'name': 'Authorization',
                'in': 'header',
                'type': 'string',
                'default': 'Token <token goes here>',
            },
            {
                'name': 'id',
                'description': 'movie id',
                'in': 'path',
                'type': 'integer',
                'required': True,
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
            OPTIONAL MATCH (movie)<-[my_rated:RATED]-(me:User {id: {user_id}})
            OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)
            OPTIONAL MATCH (related:Movie)<--(a:Person) WHERE related <> movie
            OPTIONAL MATCH (movie)-[:HAS_KEYWORD]->(keyword:Keyword)
            OPTIONAL MATCH (movie)-[:HAS_GENRE]->(genre:Genre)
            OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)
            OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)
            OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)
            WITH DISTINCT movie,
            my_rated,
            genre, keyword, d, p, w, a, r, related, count(related) AS countRelated
            ORDER BY countRelated DESC
            RETURN DISTINCT movie,
            my_rated.rating AS my_rating,
            collect(DISTINCT keyword) AS keywords,
            collect(DISTINCT d) AS directors,
            collect(DISTINCT p) AS producers,
            collect(DISTINCT w) AS writers,
            collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster_image, role:r.role}) AS actors,
            collect(DISTINCT related) AS related,
            collect(DISTINCT genre) AS genres
            ''', {'id': id, 'user_id': g.user['id']}
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
                'my_rating': record['my_rating'],
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


class MovieListRatedByMe(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'A list of movies the authorized user has rated.',
        'description': 'A list of movies the authorized user has rated.',
        'parameters': [
            {
                'name': 'Authorization',
                'in': 'header',
                'type': 'string',
                'default': 'Token <token goes here>',
                'required': True
            },
        ],
        'responses': {
            '200': {
                'description': 'A list of movies the authorized user has rated',
                'schema': {
                    'type': 'array',
                    'items': MovieModel,
                }
            }
        }
    })
    @login_required
    def get(self):
        db = get_db()
        result = db.run(
            '''
            MATCH (:User {id: {user_id}})-[rated:RATED]->(movie:Movie)
            RETURN DISTINCT movie, rated.rating as my_rating
            ''', {'user_id': g.user['id']}
        )
        return [serialize_movie(record['movie'], record['my_rating']) for record in result]


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


class Register(Resource):
    @swagger.doc({
        'tags': ['users'],
        'summary': 'Register a new user',
        'description': 'Register a new user',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'username': {
                            'type': 'string',
                        },
                        'password': {
                            'type': 'string',
                        }
                    }
                }
            },
        ],
        'responses': {
            '201': {
                'description': 'Your new user',
                'schema': UserModel,
            },
            '400': {
                'description': 'Error message(s)',
            },
        }
    })
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if not username:
            return {'username': 'This field is required.'}, 400
        if not password:
            return {'password': 'This field is required.'}, 400

        db = get_db()

        results = db.run(
            '''
            MATCH (user:User {username: {username}}) RETURN user
            ''', {'username': username}
        )
        try:
            results.single()
        except ResultError:
            pass
        else:
            return {'username': 'username already in use'}, 400

        results = db.run(
            '''
            CREATE (user:User {id: {id}, username: {username}, password: {password}, api_key: {api_key}}) RETURN user
            ''',
            {
                'id': str(uuid.uuid4()),
                'username': username,
                'password': hash_password(username, password),
                'api_key': binascii.hexlify(os.urandom(20)).decode()
            }
        )
        user = results.single()['user']
        return serialize_user(user), 201


class Login(Resource):
    @swagger.doc({
        'tags': ['users'],
        'summary': 'Login',
        'description': 'Login',
        'parameters': [
            {
                'name': 'body',
                'in': 'body',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'username': {
                            'type': 'string',
                        },
                        'password': {
                            'type': 'string',
                        }
                    }
                }
            },
        ],
        'responses': {
            '200': {
                'description': 'succesful login'
            },
            '400': {
                'description': 'invalid credentials'
            }
        }
    })
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if not username:
            return {'username': 'This field is required.'}, 400
        if not password:
            return {'password': 'This field is required.'}, 400

        db = get_db()
        results = db.run(
            '''
            MATCH (user:User {username: {username}}) RETURN user
            ''', {'username': username}
        )
        try:
            user = results.single()['user']
        except ResultError:
            return {'username': 'username does not exist'}, 400

        expected_password = hash_password(user['username'], password)
        if user['password'] != expected_password:
            return {'password': 'wrong password'}, 400
        return {
            'token': user['api_key']
        }


class UserMe(Resource):
    @swagger.doc({
        'tags': ['users'],
        'summary': 'Get your user',
        'description': 'Get your user',
        'parameters': [{
            'name': 'Authorization',
            'in': 'header',
            'type': 'string',
            'required': True,
            'default': 'Token <token goes here>',
        }],
        'responses': {
            '200': {
                'description': 'the user',
                'schema': UserModel,
            },
            '401': {
                'description': 'invalid / missing authentication',
            },
        }
    })
    @login_required
    def get(self):
        return serialize_user(g.user)


class RateMovie(Resource):
    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Rate a movie from',
        'description': 'Rate a movie from 0-5 inclusive',
        'parameters': [
            {
                'name': 'Authorization',
                'in': 'header',
                'type': 'string',
                'required': True,
                'default': 'Token <token goes here>',
            },
            {
                'name': 'id',
                'description': 'movie id',
                'in': 'path',
                'type': 'integer',
            },
            {
                'name': 'body',
                'in': 'body',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'rating': {
                            'type': 'integer',
                        },
                    }
                }
            },
        ],
        'responses': {
            '200': {
                'description': 'movie rating saved'
            },
            '401': {
                'description': 'invalid / missing authentication'
            }
        }
    })
    @login_required
    def post(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('rating', choices=list(range(0, 6)), type=int, required=True, help='A rating from 0 - 5 inclusive (integers)')
        args = parser.parse_args()
        rating = args['rating']

        db = get_db()
        results = db.run(
            '''
            MATCH (u:User {id: {user_id}}),(m:Movie {id: {movie_id}})
            MERGE (u)-[r:RATED]->(m)
            SET r.rating = {rating}
            RETURN m
            ''', {'user_id': g.user['id'], 'movie_id': id, 'rating': rating}
        )
        return {}

    @swagger.doc({
        'tags': ['movies'],
        'summary': 'Delete your rating for a movie',
        'description': 'Delete your rating for a movie',
        'parameters': [
            {
                'name': 'Authorization',
                'in': 'header',
                'type': 'string',
                'required': True,
                'default': 'Token <token goes here>',
            },
            {
                'name': 'id',
                'description': 'movie id',
                'in': 'path',
                'type': 'integer',
            },
        ],
        'responses': {
            '204': {
                'description': 'movie rating deleted'
            },
            '401': {
                'description': 'invalid / missing authentication'
            }
        }
    })
    @login_required
    def delete(self, id):
        db = get_db()
        db.run(
            '''
            MATCH (u:User {id: {user_id}})-[r:RATED]->(m:Movie {id: {movie_id}}) DELETE r
            ''', {'movie_id': id, 'user_id': g.user['id']}
        )
        return {}, 204


api.add_resource(ApiDocs, '/docs', '/docs/<path:path>')
api.add_resource(GenreList, '/api/v0/genres')
api.add_resource(Movie, '/api/v0/movies/<int:id>')
api.add_resource(RateMovie, '/api/v0/movies/<int:id>/rate')
api.add_resource(MovieList, '/api/v0/movies')
api.add_resource(MovieListByGenre, '/api/v0/movies/genre/<int:genre_id>/')
api.add_resource(MovieListByDateRange, '/api/v0/movies/daterange/<string:start>/<string:end>')
api.add_resource(MovieListByPersonActedIn, '/api/v0/movies/acted_in_by/<int:person_id>')
api.add_resource(MovieListByWrittenBy, '/api/v0/movies/written_by/<int:person_id>')
api.add_resource(MovieListByDirectedBy, '/api/v0/movies/directed_by/<int:person_id>')
api.add_resource(MovieListRatedByMe, '/api/v0/movies/rated')
api.add_resource(Person, '/api/v0/people/<int:id>')
api.add_resource(PersonList, '/api/v0/people')
api.add_resource(PersonBacon, '/api/v0/people/bacon')
api.add_resource(Register, '/api/v0/register')
api.add_resource(Login, '/api/v0/login')
api.add_resource(UserMe, '/api/v0/users/me')
