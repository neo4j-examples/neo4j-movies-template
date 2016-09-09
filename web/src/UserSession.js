class UserSession {
  static setToken(token) {
    if (token) {
      window.localStorage.setItem('token', token);
    } else {
      window.localStorage.removeItem('token');
    }
  }

  static getToken() {
    return window.localStorage.getItem('token');
  }
}

export default UserSession;
