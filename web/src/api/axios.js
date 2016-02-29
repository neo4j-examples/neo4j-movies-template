import axios from 'axios';
import humps from 'humps';

axios.interceptors.request.use(function (request) {
  if(request.data) {
    request.data = JSON.stringify(humps.decamelizeKeys(JSON.parse(request.data)));
  }
  return request;
});

axios.interceptors.response.use(function (response) {
  if(response.data) {
    return humps.camelizeKeys(response.data);
  }
});

module.exports = axios;

