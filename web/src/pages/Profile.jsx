import React from "react";
import AuthenticatedPage from "./AuthenticatedPage.jsx";
import Loading from "../components/Loading.jsx";
import {Link} from "react-router";
import UserRating from "../components/UserRating.jsx";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import _ from "lodash";
import * as ProfileActions from "../redux/actions/ProfileActions";

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getProfileRatings();
  }

  render() {
    var {profile, isFetching, ratedMovies} = this.props.profile;
    var {profileRateMovie, profileDeleteMovieRating} = this.props;

    if (!profile) {
      return null;
    }

    return (
      <div className="nt-profile">
        {/*isFetching ? <Loading/> : null*/}
        <div className="row">
          <div className="nt-box">
            <div className="nt-box-title">
              My Profile
            </div>
            <div className="nt-box-row">
              <div className="row">
                <div className="small-12 medium-2 large-2 columns">
                  <div className="nt-profile-gravatar">
                    <img src={_.get(profile, 'avatar.fullSize')}/>
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
        {
          !_.isEmpty(ratedMovies) ?
            <div className="row">
              <div className="nt-box">
                <div className="nt-box-title">
                  My rated movies
                </div>
                <div className="nt-box-row">
                  <div className="row">
                    {ratedMovies.map((movie, i, array) => {
                      return (
                        <div key={movie.id}
                             className={'columns small-4' + ((i == array.length-1) ? ' end' : '')}>
                          <div className="nt-profile-movie">
                            <Link to={`/movie/${movie.id}`}>
                              <img src={movie.posterImage} className="nt-profile-movie-cover"/>
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

                        </div>
                      )
                    })}
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
