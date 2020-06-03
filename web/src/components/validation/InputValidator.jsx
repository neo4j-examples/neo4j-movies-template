import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ValidationUtils from '../../utils/ValidationUtils'
import {ValidatorContext} from './ValidatedComponent'

class InputValidator extends React.Component {
  constructor() {
    super()

    this.validation = {
      isValid: true,
      message: '',
    }

    this.state = {
      message: '',
    }

    this.onBlurValidate = this.onBlurValidate.bind(this)
    this.getRequiredErrorMsg = this.getRequiredErrorMsg.bind(this)
    this.validate = this.validate.bind(this)
    this.setValidationState = this.setValidationState.bind(this)
    this.getValidationMessage = this.getValidationMessage.bind(this)
    this.isValid = this.isValid.bind(this)
  }

  getInput(props) {
    const {children} = typeof props === 'undefined' ? this.props : props
    return children && !children.length ? children : null
  }

  componentDidMount() {
    const {registerValidator} = this.props

    if (registerValidator) {
      registerValidator({
        owner: this,
        message: this.props.message,
        validate: this.validate,
      })
    }
  }

  componentWillUnmount() {
    const {unregisterValidator} = this.props
    if (unregisterValidator) {
      unregisterValidator(this)
    }
  }

  componentDidUpdate(prevProps) {
    const {shouldValidateOnValueChange} = this.props
    if (shouldValidateOnValueChange) {
      const prevValue = this.getInput(prevProps).props.value
      const currentValue = this.getInput().props.value
      if (prevValue !== currentValue) {
        this.validate()
      }
    }
  }

  setValidationState(message) {
    const state = {message, isValid: !message}
    this.validation = state
    this.setState(state)
  }

  getValidationMessage() {
    return _.cloneDeep(this.validation.message)
  }

  isValid() {
    return this.validation.isValid
  }

  validate() {
    const {children, fieldName, required, onValidated, customValidation} = this.props
    const input = this.getInput()
    let message

    if (input) {
      const {value, type, required} = input.props

      if (required && !value && value !== 0 && value !== false) {
        message = this.getRequiredErrorMsg()
      } else if (type === 'email') {
        message = ValidationUtils.checkEmail(value)
      } else if (type === 'url') {
        message = ValidationUtils.checkUrl(value)
      } else if (type === 'number') {
        const {min, max} = input.props
        if (min && Number(value) < Number(min)) {
          message = (fieldName || 'This field') + ' is less than ' + min
        }
        if (max && Number(value) > Number(max)) {
          message = (fieldName || 'This field') + ' is greater than ' + max
        }
      }
    }

    if (required && !children.props.value) {
      message = this.getRequiredErrorMsg()
    }

    if (!message && customValidation) {
      message = customValidation()
    }

    this.setValidationState(message)

    if (onValidated) {
      onValidated()
    }
  }

  getRequiredErrorMsg() {
    return (this.props.fieldName || 'This field') + ' is required'
  }

  onBlurValidate() {
    this.validate()

    const {onBlurValidators} = this.props
    if (!_.isEmpty(onBlurValidators)) {
      onBlurValidators.forEach(validatorCmp => validatorCmp.validate && validatorCmp.validate())
    }
  }

  render() {
    const {props, state} = this
    const isChildInput = !!this.getInput()

    const children =
      isChildInput && props.shouldValidateOnBlur
        ? React.Children.map(props.children, child => {
            return React.cloneElement(child, {
              onBlur: this.onBlurValidate,
            })
          })
        : props.children

    const isValid = !(this.getErrorFromProps() || state.message)

    return (
      <div className={`validation ${this.props.className} ${this.state.inputState}`}>
        {children}
        {!isValid && (<div ref="msg" className="validation-msg">
          {this.getErrorFromProps() || state.message}
        </div>)}
      </div>
    )
  }

  getErrorFromProps() {
    const {errors} = this.props

    if (errors) {
      if (Array.isArray(errors)) {
        return errors.join(', ')
      }

      return errors.toString()
    }
  }
}

InputValidator.displayName = 'InputValidator'

InputValidator.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  customValidation: PropTypes.func,
  onValidated: PropTypes.func,
  fieldName: PropTypes.string,
  fullWidth: PropTypes.bool,
  shouldValidateOnBlur: PropTypes.bool,
  shouldValidateOnValueChange: PropTypes.bool,
  onBlurValidators: PropTypes.array,
}

InputValidator.defaultProps = {
  fullWidth: true,
  shouldValidateOnBlur: false,
  shouldValidateOnValueChange: false,
}

InputValidator.contextTypes = {
  registerValidator: PropTypes.func,
  unregisterValidator: PropTypes.func,
}

export {InputValidator as InputValidatorCmp}

export default props => (
  <ValidatorContext.Consumer>
    {({registerValidator, unregisterValidator}) => {
      const {forwardRef} = props
      const contextProps = {
        registerValidator,
        unregisterValidator,
      }

      if (forwardRef) {
        contextProps.ref = forwardRef
      }
      return <InputValidator {...props} {...contextProps} />
    }}
  </ValidatorContext.Consumer>
)
