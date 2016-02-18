import settings from '../../config/settings';
import axios from './axios';
import _ from 'lodash';

const {apiBaseUrl} = settings;

export default class MoviesApi {
  constructor() {
  }

  static getGenres() {
    return axios.get(`${apiBaseUrl}/genres`);
  }

  static getMoviesByGenres(genreNames) {
    return MoviesApi.getGenres()
      .then(genres => {
        var movieGenres = _.filter(genres, g => {
          return genreNames.indexOf(g.name) > -1
        });

        return Promise.all(
          movieGenres.map(genre => {
              return axios.get(`${apiBaseUrl}/movies/genre/${genre.id}/`);
            }
          ))
          .then(genreResults => {
            var result = {};
            genreResults.forEach((movies, i) => {
              result[movieGenres[i].name] = movies;
            });

            return result;
          })
      });
  }

  static getFeaturedMovies() {
    return Promise.all([
      axios.get(`${apiBaseUrl}/movies/1`),
      axios.get(`${apiBaseUrl}/movies/28`),
      axios.get(`${apiBaseUrl}/movies/68`)
    ]);
  }

  static getMovie(id) {
      return axios.get(`${apiBaseUrl}/movies/${id}`);
  }
}


