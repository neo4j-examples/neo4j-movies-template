import settings from '../config/settings';
import axios from './axios';

const {apiBaseURL} = settings;

export default class ProfileApi {

  static getProfile() {
    return axios.get(`${apiBaseURL}/users/me`);
  }

  static getProfileRatings() {
    return axios.get(`${apiBaseURL}/movies/rated`);
  }

  static getProfileRecommendations() {
    return axios.get(`${apiBaseURL}/movies/recommended`);
  }
}
