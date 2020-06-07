import axios from 'axios';
import humps from 'humps';
import UserSession from '../UserSession';

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.patch['Content-Type'] = 'application/json';

instance.interceptors.request.use(function (request) {
  const authToken = UserSession.getToken();
  if (authToken) {
    if (request.headers && !request.headers.Authorization) {
      request.headers['Authorization'] = `Token ${authToken}`;
    }
  }

  if (request.data) {
    const data = typeof request.data === "string" ? JSON.parse(request.data) : request.data
    request.data = JSON.stringify(humps.decamelizeKeys(data));
  }
  return request;
});

instance.interceptors.response.use(function (response) {
  if (response.data) {
    return humps.camelizeKeys(response.data);
  }
});

export default instance;
