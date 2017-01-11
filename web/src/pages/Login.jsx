import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import InputValidator from '../components/validation/InputValidator.jsx';
import validatedComponent from '../components/validation/ValidatedComponent.jsx';
import * as Actions from '../redux/actions/AuthActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      canSubmit: false
    };

    this.popup = null;

    this.changeUser = this.changeUser.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.login = this.login.bind(this);
    this.redirectIfAuthed = this.redirectIfAuthed.bind(this);
  }

  login(e) {
    e.preventDefault();

    if (this.context.isComponentValid()) {
      this.props.login(this.state.username, this.state.password);
    }
  }

  componentDidMount() {
    this.redirectIfAuthed(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectIfAuthed(nextProps);
  }

  redirectIfAuthed(props) {
    var {location, token} = props;
    if (token) {
      if (location.query.redirectTo) {
        this.context.router.push(location.query.redirectTo);
      }
      else {
        this.context.router.push('/');
      }
    }
  }

  render() {
    var {username, password, canSubmit} = this.state;
    var {errors} = this.props;

    return (
      <div className="ba-login row">
        <form noValidate>
          <div className="panel small-12 small-centered columns">
            <div className="row panel-title">
              <h3>Log In</h3>
            </div>
            <div className="row">
              <InputValidator fieldName="User name"
                              errors={errors.username}
                              shouldValidateOnBlur={true}>
                <input type="text"
                       placeholder="User name*"
                       required
                       value={username}
                       onChange={this.changeUser}/>
              </InputValidator>
            </div>
            <div className="row">
              <InputValidator fieldName="Password"
                              errors={errors.password}
                              shouldValidateOnBlur={true}>
                <input type="password"
                       name="password"
                       placeholder="Password*"
                       required
                       value={password}
                       onChange={this.changePassword}/>
              </InputValidator>
            </div>
            <div className="row text-center">
              <button className="btn"
                      type="submit"
                      name="submit-login"
                      onClick={this.login}
                      disabled={!canSubmit}>
                Submit
              </button>
            </div>
            <div className="row text-center">
              <Link to="/signup">Create an account</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }

  changeUser(event) {
    var canSubmit = this.state.password && event.target.value;
    this.setState({
      username: event.target.value,
      canSubmit: canSubmit
    });
  }

  changePassword(event) {
    var canSubmit = this.state.username && event.target.value;
    this.setState({
      password: event.target.value,
      canSubmit: canSubmit
    });
  }
}

Login.displayName = 'Login';

Login.propTypes = {
  query: PropTypes.object
};

Login.contextTypes = {
  router: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

function mapStateToProps(state) {
  return {...state.auth};
}

export default connect(mapStateToProps, mapDispatchToProps)(validatedComponent(Login));
