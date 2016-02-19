import React from 'react';
import Loading from '../components/Loading.jsx';

import * as MovieActions from '../redux/actions/MovieActions'
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
        <div className="row">
          <div className="large-12 columns">
            {isFetching ? <Loading/> : null}
            {movie ?
              <div>
                <h2>{movie.title}</h2>
                <img src={movie.posterImage} />
                <p><strong>Tagline:</strong>{movie.tagline}</p>
              </div>
              :
              null
            }
          </div>
        </div>
      </div>
    );
  }
}
Movie.displayName = 'Movie';

function mapStateToProps(state) {
  return {
    movie: state.movies.detail,
    isFetching: state.movies.isFetching
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch)
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Movie);