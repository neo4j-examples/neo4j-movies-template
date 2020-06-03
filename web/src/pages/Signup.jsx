import React from 'react';
import { withRouter } from 'react-router';
import validatedComponent from '../components/validation/ValidatedComponent.jsx';
import InputValidator from '../components/validation/InputValidator.jsx';
import * as Actions from '../redux/actions/ProfileActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class Signup extends React.Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      confirmPassword: ''
    };

    this.createUser = this.createUser.bind(this);
    this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
  }

  componentDidMount() {
    this.redirectIfAuthed(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.redirectIfAuthed(nextProps);
  }

  redirectIfAuthed(props) {
    var {match, history, auth} = props;
    if (auth.token) {
      if (match.params.redirectTo) {
        history.push(match.params.redirectTo);
      }
      else {
        history.push('/');
      }
    }
  }

  createUser(event) {
    event.preventDefault();
    var {username, password} = this.state;

    if (this.props.isComponentValid()) {
      this.props.createProfile({username, password});
    }
  }

  onChange(fieldName, e) {
    this.setState({[fieldName]: e.target.value});
  }

  validateConfirmPassword() {
    var {password, confirmPassword} = this.state;
    if (password !== confirmPassword) {
      return 'Both passwords must be equal';
    }
  }

  render() {
    var {state} = this;
    var {errors} = this.props;
    return (
      <div className="ba-signup row">
        <form noValidate>
          <div className="panel small-12 small-centered columns">
            <div className="row panel-title">
              <h3>Create an Account</h3>
            </div>
            <div className="row">
              <InputValidator fieldName="User name"
                              errors={errors.username}
                              shouldValidateOnBlur={true}>
              <input type="text"
                     name="name"
                     required
                     placeholder="User name*"
                     value={state.username}
                     onChange={this.onChange.bind(this, 'username')}/>
              </InputValidator>
            </div>
            <div className="row">
              <input type="password"
                     name="password"
                     placeholder="Password*"
                     required
                     onChange={this.onChange.bind(this, 'password')}
                     value={state.password}/>
            </div>
            <div className="row">
              <InputValidator fieldName="Password"
                              errors={errors.password}
                              shouldValidateOnBlur={true}
                              customValidation={() => {return this.validateConfirmPassword();}}>
              <input type="password"
                     name="password-confirm"
                     placeholder="Confirm Password*"
                     required
                     onChange={this.onChange.bind(this, 'confirmPassword')}
                     value={state.confirmPassword}/>
              </InputValidator>
            </div>
            <div className="row text-center">
              <button type="button"
                      name="btn-create"
                      className="ba-default-button"
                      onClick={this.createUser}>
                Create Account
              </button>
            </div>
          </div>
        </form>
        <div className="push"/>
      </div>
    );
  }
}

Signup.displayName = 'Signup';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

function mapStateToProps(state) {
  return {...state.signup,  auth: {...state.auth}};
}

export default connect(mapStateToProps, mapDispatchToProps)(validatedComponent(withRouter(Signup)));
