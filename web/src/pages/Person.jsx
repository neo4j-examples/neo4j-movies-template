import React from 'react';
import _ from 'lodash';
import Loading from '../components/Loading.jsx';
import Carousel from '../components/Carousel.jsx';
import { Link } from 'react-router-dom';
import * as PersonActions from '../redux/actions/PersonActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Person extends React.Component {
  componentWillMount() {
    var {id} = this.props.match.params;
    this.props.getPerson(id);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.match.params.id !== this.props.match.params.id) {
      var {id} = nextProps.match.params;
      this.props.getPerson(id);
    }
  }

  componentWillUnmount() {
    this.props.clearPerson();
  }

  render() {
    var {person} = this.props;
    var {detail, isFetching} = person;

    return (
      <div className="nt-person">
        {isFetching ? <Loading/> : null}
        {detail ?
          <div>
            <div className="row">
              <div className="large-12 columns">
                <h2 className="nt-person-header">{detail.name}</h2>
              </div>
            </div>
            <div className="row">
              <div className="small-12 medium-3 columns nt-person-aside">
                <img className="nt-person-poster"
                  src={detail.posterImage}
                  alt="" />
              </div>
              <div className="small-12 medium-9 columns nt-person-main">
                <div>
                  <div className="nt-box">
                    <div className="nt-box-title">
                      Bio
                    </div>
                  </div>

                  <div className="nt-box">
                    <div className="nt-box-title">
                      Related People
                    </div>
                    <div className="nt-box-row">
                      {isFetching ? <Loading/> : null}
                      {this.renderRelatedPeople(detail.related)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.renderRelatedMovies('Acted In', detail.actedIn)}
            {this.renderRelatedMovies('Directed', detail.directed)}
            {this.renderRelatedMovies('Produced', detail.produced)}
            {this.renderRelatedMovies('Wrote', detail.wrote)}
          </div>
          : null
        }
      </div>
    );
  }

  renderRelatedPeople(actors) {
    return (
      <Carousel>
        {
          actors.map(a => {
            return (
              <div key={a.id}>
                <Link to={`/person/${a.id}`}>
                  <img src={a.posterImage} alt="" />
                </Link>
                <div className="nt-carousel-actor-name"><Link to={`/person/${a.id}`}>{a.name}</Link></div>
                <div className="nt-carousel-actor-role">{a.role}</div>
              </div>
            );
          })
        }
        </Carousel>
    );
  }

  renderRelatedMovies(sectionTitle, movies) {
    var shown = _.filter(movies, m => {
      return !!m.name;
    });

    if (_.isEmpty(shown)) {
      return null;
    }

    return (
      <div className="row nt-person-movies">
        <div className="large-12 columns">
          <div className="nt-box">
            <div className="nt-box-title">
              {sectionTitle}
            </div>
            <Carousel>
              {
                movies.map(m => {
                  return (
                    <div key={m.id}>
                      <Link to={`/movie/${m.id}`}>
                        <img src={m.posterImage} alt="" />
                      </Link>
                      <div className="nt-carousel-movie-title"><Link to={`/movie/${m.id}`}>{m.name}</Link></div>
                      {m.role ?
                        <div className="nt-carousel-movie-role">{m.role}</div>
                        : null
                      }
                    </div>
                  );
                })
              }
            </Carousel>
          </div>
        </div>
      </div>
    );
  }
}
Person.displayName = 'Person';

function mapStateToProps(state) {
  return {
    person: state.person
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PersonActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Person);
