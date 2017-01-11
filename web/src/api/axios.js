import axios from 'axios';
import humps from 'humps';
import UserSession from '../UserSession';

axios.interceptors.request.use(function (request) {
  var authToken = UserSession.getToken();
  if (authToken) {
    if (request.headers && !request.headers.Authorization) {
      request.headers['Authorization'] = `Token ${authToken}`;
    }
  }

  if (request.data) {
    request.data = JSON.stringify(humps.decamelizeKeys(JSON.parse(request.data)));
  }
  return request;
});

axios.interceptors.response.use(function (response) {
  if (response.data) {
    return humps.camelizeKeys(response.data);
  }
});

module.exports = axios;