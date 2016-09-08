import React from 'react';

/**
 * A higher ordered component containing boilerplate code for handling validation of internal input fields.
 *
 * About higher order components:
 * It's a way of implementing mixin-like enhancements for React components (mixins are not possible with ES6 and they have other issues)
 * Check here for more: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
 */
var ValidatedComponent = (ComposedComponent) => {

  ComposedComponent.contextTypes = ComposedComponent.contextTypes || {};
  ComposedComponent.contextTypes.isComponentValid = React.PropTypes.func;
  ComposedComponent.contextTypes.getValidationMessages = React.PropTypes.func;

  class ValidatedComponent extends React.Component {
    constructor() {
      super();
      this.validators = [];
    }

    getChildContext() {
      return {
        isComponentValid: this.isValid.bind(this),
        getValidationMessages: this.getValidationMessages.bind(this),
        registerValidator: this.onRegisterValidator.bind(this),
        unregisterValidator: this.onUnregisterValidator.bind(this)
      };
    }

    onRegisterValidator(validator) {
      this.validators.push(validator);
    }

    onUnregisterValidator(owner) {
      _.remove(this.validators, {owner});
    }

    isValid() {
      var isValid = true;
      this.validators.forEach(v => {
        v.owner.validate();
        isValid = isValid && v.owner.isValid();
      });
      return isValid;
    }

    getValidationMessages() {
      var results = [];
      this.validators.forEach(v => {
        var message = v.owner.getValidationMessage();
        if (message) {
          results.push(message);
        }
      });

      return results;
    }

    render() {
      return <ComposedComponent ref="composedComponent" {...this.props}/>;
    }
  }

  ValidatedComponent.childContextTypes = {
    isComponentValid: React.PropTypes.func.isRequired,
    getValidationMessages: React.PropTypes.func.isRequired,
    registerValidator: React.PropTypes.func.isRequired,
    unregisterValidator: React.PropTypes.func.isRequired
  };

  ValidatedComponent.displayName = 'ValidatedComponent';

  return ValidatedComponent;
};

export default ValidatedComponent;
