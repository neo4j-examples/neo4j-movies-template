import React from 'react';
import _ from 'lodash';
import Loading from '../components/Loading.jsx';
import { Link } from 'react-router';
import * as MovieActions from '../redux/actions/MovieActions';
import { bindActionCreators } from 'redux';

import { connect } from 'react-redux';


class Movie extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    var {id} = this.props.params;
    this.props.getMovie(id);
  }

  componentWillUnmount() {
    this.props.clearMovie();
  }


  render() {
    var {isFetching, movie} = this.props;

    return (
      <div className="nt-movie">
        {isFetching ? <Loading/> : null}
        {movie ?
          <div>
            <div className="row">
              <div className="large-12 columns">
                <h2 className="nt-movie-title">{movie.title}</h2>
              </div>
            </div>
            <div className="row">
              <div className="small-12 medium-4 columns nt-movie-aside">
                <img className="nt-movie-poster"
                     src={movie.posterImage}/>
                <div className="nt-box">
                  <div className="nt-box-title">
                    Storyline
                  </div>
                  <p className="nt-box-row">
                    <strong>Tagline: </strong><span>{movie.tagline}</span>
                  </p>
                  <p className="nt-box-row">
                    <strong>Keywords: </strong><span>{this.getKeywordsText(movie)}</span>
                  </p>
                </div>
              </div>
              <div className="small-12 medium-8 columns nt-movie-main">
                <div>
                  <div className="nt-box">
                    <div className="nt-box-title">
                      Movie Details
                    </div>
                    <p className="nt-box-row">
                      <strong>Rated: </strong><span>{movie.rated}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Duration: </strong><span>{`${movie.duration} mins`}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Genres: </strong>
                    </p>
                    <p className="nt-box-row">
                      <strong>Directed By: </strong>
                      <span>{this.renderPeople(movie.directors)}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Written By: </strong>
                      <span>{this.renderPeople(movie.writers)}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Produced By: </strong>
                      <span>{this.renderPeople(movie.producers)}</span>
                    </p>
                  </div>
                  <div className="nt-box">
                    <div className="nt-box-title">
                      Cast
                    </div>
                    <div>{this.renderCast(movie.actors)}</div>
                  </div>
                </div>
              </div>
              <div className="small-12 columns">
                <div className="nt-box">
                  <div className="nt-box-title">
                    Related
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          null
        }
      </div>
    );
  }

  getKeywordsText(movie) {
    _.filter(movie.keywords, k => {
        return !!k.name
      })
      .join(', ');
  }

  renderCast(actors) {
    return (
      <ul>
        {
          actors.map(a => {
            return (
              <li key={a.id} className="nt-movie-actor">
                <Link to={`/person/${a.id}`}>
                  <img src={a.posterImage}/>
                </Link>
                <div className="nt-movie-actor-name"><Link to={`/person/${a.id}`}>{a.name}</Link></div>
                <div className="nt-movie-actor-role">{a.role}</div>
              </li>
            )
          })
        }
      </ul>);
  }

  renderPeople(people) {
    return people.map((p, i) => {
      return <span key={p.id}>
        <Link to={`/person/${p.id}`}>{p.name}</Link>
        {i < people.length - 1 ? <span>, </span> : null}
      </span>
    })
  }
}
Movie.displayName = 'Movie';

function mapStateToProps(state) {
  return {
    movie: state.movies.detail,
    isFetching: state.movies.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch);
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Movie);