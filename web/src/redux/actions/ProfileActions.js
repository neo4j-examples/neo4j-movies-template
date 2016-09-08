import * as Types from './ProfileActionTypes';

export function getProfile() {
  return {type: Types.PROFILE_GET};
}

export function getProfileSuccess(profile) {
  return {type: Types.PROFILE_GET_SUCCESS, payload: profile};
}

export function getProfileFailure(error) {
  return {type: Types.PROFILE_GET_FAILURE, error};
}

export function createProfile(profile) {
  return {type: Types.PROFILE_CREATE, payload: profile};
}

export function createProfileSuccess(profile) {
  return {type: Types.PROFILE_CREATE_SUCCESS, payload: profile};
}

export function createProfileFailure(error) {
  return {type: Types.PROFILE_CREATE_FAILURE, error};
}

export function createProfileInit() {
  return {type: Types.PROFILE_CREATE_INIT};
}
