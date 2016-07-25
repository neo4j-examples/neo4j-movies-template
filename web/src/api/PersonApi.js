import settings from '../../config/settings';
import axios from './axios';
import _ from 'lodash';

const {apiBaseUrl} = settings;

export default class PersonApi {
  static getPerson(id) {
    return axios.get(`${apiBaseUrl}/people/${id}`);
  }
}


