import React from 'react';
import _ from 'lodash';
import Loading from '../components/Loading.jsx';
import { Link } from 'react-router';
import * as PersonActions from '../redux/actions/PersonActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export default class Person extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    var {id} = this.props.params;
    this.props.getPerson(id);
    this.props.getRelated(id);
  }

  componentWillUnmount() {
    this.props.clearPerson();
  }

  render() {
    var {person} = this.props;
    var {detail, isFetching, related, isFetchingRelated} = person;

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
                     src={detail.posterImage}/>
              </div>
              <div className="small-12 medium-9 columns nt-person-main">
                <div>
                  <div className="nt-box">
                    <div className="nt-box-title">
                      Bio
                    </div>
                    <p className="nt-box-row">
                      <strong>Born: </strong><span>{detail.born}</span>
                    </p>
                  </div>

                  <div className="nt-box">
                    <div className="nt-box-title">
                      Related
                    </div>
                    <div className="nt-box-row">
                      {isFetching ? <Loading/> : null}
                      {this.renderRelatedPeople(related)}
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
      <ul>
        {
          actors.map(a => {
            return (
              <li key={a.id} className="nt-person-people">
                <Link to={`/person/${a.id}`}>
                  <img src={a.posterImage}/>
                </Link>
                <div className="nt-person-people-name"><Link to={`/person/${a.id}`}>{a.name}</Link></div>
                <div className="nt-person-people-role">{a.role}</div>
              </li>
            )
          })
        }
      </ul>);
  }

  renderRelatedMovies(sectionTitle, movies) {
    var shown = _.filter(movies, m => {
      return !!m.name
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
            <ul>
              {
                movies.map(m => {
                  return (
                    <li key={m.id} className="nt-person-movies-movie">
                      <Link to={`/movie/${m.id}`}>
                        <img src={m.posterImage}/>
                      </Link>
                      <div className="nt-person-movies-movie-title"><Link to={`/movie/${m.id}`}>{m.name}</Link></div>
                      {m.role ?
                        <div className="nt-person-movies-movie-role">{m.role}</div>
                        : null
                      }
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
    )
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