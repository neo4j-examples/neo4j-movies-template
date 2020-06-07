import React from 'react';
import AuthenticatedPage from './AuthenticatedPage.jsx';
import {Link} from 'react-router-dom';
import UserRating from '../components/UserRating.jsx';
import Carousel from '../components/Carousel.jsx';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import * as ProfileActions from '../redux/actions/ProfileActions';

class Profile extends React.Component {
  componentDidMount() {
    this.props.getProfileRatings();
    this.props.getProfileRecommendations();
  }

  render() {
    var {profile, ratedMovies, recommendedMovies} = this.props.profile;
    var {profileRateMovie, profileDeleteMovieRating} = this.props;

    if (!profile) {
      return null;
    }

    return (
      <div className="nt-profile">
        {/*isFetching ? <Loading/> : null*/}
        <div className="row">
          <div className="small-12 columns">
            <div className="nt-box">
              <div className="nt-box-title">
                My Profile
              </div>
              <div className="nt-box-row">
                <div className="row">
                  <div className="small-12 medium-2 large-2 columns">
                    <div className="nt-profile-gravatar">
                      <img src={_.get(profile, 'avatar.fullSize')} alt="" />
                    </div>
                  </div>
                  <div className="small-12 medium-10 large-10 columns">
                    <div className="nt-profile-first-name">
                      User Name: {profile.username}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <div className="nt-box">
              <div className="nt-box-title">
                My rated movies
              </div>
              {!_.isEmpty(ratedMovies) ?
                <Carousel>
                  {ratedMovies.map((movie, i, array) => {
                    return (
                      <div key={movie.id}>
                        <Link to={`/movie/${movie.id}`}>
                          <img src={movie.posterImage} className="nt-profile-movie-cover" alt=""/>
                        </Link>
                        <div className="nt-profile-movie-title">
                          <Link to={`/movie/${movie.id}`}>
                            {movie.title}
                          </Link>
                        </div>
                        <div>
                          <UserRating movieId={movie.id}
                                      savedRating={movie.myRating}
                                      onSubmitRating={profileRateMovie}
                                      onDeleteRating={profileDeleteMovieRating}/>
                        </div>
                      </div>
                    );
                  })}
                </Carousel>
                :
                null
              }
            </div>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <div className="nt-box">
              <div className="nt-box-title">
                Recommended for me
              </div>
              {
                !_.isEmpty(recommendedMovies) ?
                  <Carousel>
                    {recommendedMovies.map(m => {
                      return (
                        <div key={m.id}>
                          <Link to={`/movie/${m.id}`}>
                            <img src={m.posterImage} alt="" />
                          </Link>
                          <div className="nt-carousel-movie-title">
                            <Link to={`/movie/${m.id}`}>{m.title}</Link>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                  :
                  null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: _.get(state, 'profile'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch);
}

Profile.displayName = 'Profile';

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedPage(Profile));
