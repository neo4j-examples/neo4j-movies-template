import settings from "../../config/settings";
import axios from "./axios";

const {apiBaseURL} = settings;

export default class ProfileApi {

  static getProfile() {
    return axios.get(`${apiBaseURL}/users/me`);
  }

  // static updateProfile(id, update) {
  //   return axios.patch(`${apiBaseURL}/users/${id}`, update);
  // }
}
