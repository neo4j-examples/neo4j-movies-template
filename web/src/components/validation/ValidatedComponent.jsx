import React from 'react'
import _ from 'lodash'

/**
 * A higher ordered component containing boilerplate code for handling validation of internal input fields.
 *
 * About higher order components:
 * It's a way of implementing mixin-like enhancements for React components (mixins are not possible with ES6 and they have other issues)
 * Check here for more: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
 */
export const ValidatorContext = React.createContext({
  registerValidator: () => {},
  unregisterValidator: () => {},
})

const ValidatedComponent = ComposedComponent => {
  class ValidatedComponent extends React.Component {
    constructor() {
      super()
      this.validators = []
    }

    getValidationFormProps() {
      return {
        isComponentValid: this.isValid.bind(this),
        getValidationMessages: this.getValidationMessages.bind(this),
      }
    }

    getFieldValidatorContext() {
      return {
        registerValidator: this.onRegisterValidator.bind(this),
        unregisterValidator: this.onUnregisterValidator.bind(this),
      }
    }

    onRegisterValidator(validator) {
      this.validators.push(validator)
    }

    onUnregisterValidator(owner) {
      _.remove(this.validators, {owner})
    }

    isValid() {
      let isValid = true
      this.validators.forEach(v => {
        v.owner.validate()
        isValid = isValid && v.owner.isValid()
      })
      return isValid
    }

    getValidationMessages() {
      const results = []
      this.validators.forEach(v => {
        const message = v.owner.getValidationMessage()
        if (message) {
          results.push(message)
        }
      })

      return results
    }

    render() {
      const newProps = {...this.props, ...this.getValidationFormProps()}
      return (
        <ValidatorContext.Provider value={this.getFieldValidatorContext()}>
          <ComposedComponent {...newProps} />
        </ValidatorContext.Provider>
      )
    }
  }

  ValidatedComponent.displayName = 'ValidatedComponent'

  return ValidatedComponent
}

export default ValidatedComponent
