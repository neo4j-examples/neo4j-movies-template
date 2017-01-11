import _ from 'lodash';
import humps from 'humps';

export default class ErrorUtils {
  static getApiErrors(apiError) {
    return humps.camelizeKeys(_.get(apiError, 'data', {})); 
  }
}
