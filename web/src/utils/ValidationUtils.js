export default class ValidationUtils {
  static checkEmail(email, message) {
    var regex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if (email && !regex.test(email)) {
      return message || 'Please enter a valid email address.';
    }
  }

  static checkUrl(url, message) {
    var regex = /^(http)s?(:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/igm;  // eslint-disable-line no-useless-escape
    if (url && !regex.test(url)) {
      return message || 'Please enter a valid URL. (ex. http(s)://domain.com)';
    }
  }
}
