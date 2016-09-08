import React, {PropTypes} from 'react';
import _ from 'lodash';
import ValidationUtils from '../../utils/ValidationUtils';

export default class InputValidator extends React.Component {

  constructor() {
    super();

    this.validation = {
      isValid: true,
      message: '',
      inputState: 'input-empty'
    };

    this.state = {
      isValid: true,
      message: '',
      inputState: 'input-empty'
    };

    this.onBlurValidate = this.onBlurValidate.bind(this);
    this.getRequiredErrorMsg = this.getRequiredErrorMsg.bind(this);
    this.validate = this.validate.bind(this);
    this.setValidationState = this.setValidationState.bind(this);
    this.getValidationMessage = this.getValidationMessage.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  getInput() {
    var {children} = this.props;
    return (children && !children.length) ? children : null;
  }

  componentDidMount() {
    var {registerValidator} = this.context;

    if (registerValidator) {
      registerValidator({
        owner: this,
        message: this.props.message,
        validate: this.validate
      });
    }
  }

  componentWillUnmount() {
    if (this.context.unregisterValidator) {
      this.context.unregisterValidator(this);
    }
  }

  setValidationState(message) {
    var state = {message, isValid: !message};
    this.validation = state;
    this.setState(state);
  }

  getValidationMessage() {
    return _.cloneDeep(this.validation.message);
  }

  isValid() {
    return this.validation.isValid;
  }

  validate() {
    var {props, state} = this;
    var input = this.getInput(), message;

    if (input) {
      var {value, type, required} = input.props;

      if (required && !value && value !== 0  && value !== false) {
        message = this.getRequiredErrorMsg();
      }
      else if (type === 'email') {
        message = ValidationUtils.checkEmail(value);
      }
      else if (type === 'url') {
        message = ValidationUtils.checkUrl(value);
      }
      else if (type === 'number') {
        var {min, max} = input.props;
        if (min && Number(value) < Number(min)) {
          message = (this.props.fieldName || 'This field') + ' is less than ' + min;
        }
        if (max && Number(value) > Number(max)) {
          message = (this.props.fieldName || 'This field') + ' is greater than ' + max;
        }
      }
    }

    if (props.required && !props.children.props.value) {
      message = this.getRequiredErrorMsg();
    }

    if (!message && this.props.customValidation) {
      message = this.props.customValidation();
    }

    this.setValidationState(message);

    if (this.props.onValidated) {
      this.props.onValidated();
    }

    //toggles input border color
    if (message || !this.validation.isValid) {
      this.setState({inputState: 'input-error'});
    } else if (input && input.props.value) {
      this.setState({inputState: 'input-correct'});
    } else {
      this.setState({inputState: 'input-empty'});
    }
  }
  
  getRequiredErrorMsg() {
    return (this.props.fieldName || 'This field') + ' is required';
  }

  onBlurValidate() {
    this.validate();
  }

  render() {
    var {props, state} = this;
    var isChildInput = !!this.getInput();

    var children = (isChildInput && props.shouldValidateOnBlur) ?
      React.Children.map(props.children, function (child) {
        return React.cloneElement(child, {
          onBlur: this.onBlurValidate
        });
      }.bind(this)) : props.children;

    return (
      <div className={`validation ${this.props.className} ${this.state.inputState}`}>
        {children}
        <div ref="msg" className="validation-msg">
          {this.getErrorFromProps() || state.message}
        </div>
      </div>
    );
  }
  
  getErrorFromProps() {
    var {errors} = this.props;
    
    if(errors) {
      if(Array.isArray(errors)) {
        return errors.join(', ');
      }
      else {
        return errors.toString();
      }
    }
  }
}

InputValidator.displayName = 'InputValidator';

InputValidator.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object]),
  isValid: PropTypes.bool,
  shouldValidateOnBlur: PropTypes.bool,
  errors: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string]),
  customValidation: PropTypes.func,
  onValidated: PropTypes.func,
  fieldName: PropTypes.string,
  required: PropTypes.bool
};

InputValidator.contextTypes = {
  registerValidator: PropTypes.func,
  unregisterValidator: PropTypes.func
};
