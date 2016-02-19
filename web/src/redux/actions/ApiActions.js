import {API_CALL, API_FAILURE} from './ApiActionTypes'

export function callApi(params) {
  return {
    type: API_CALL,
    ...params
  }
}

export function apiFailure(error) {
  return { error, type: API_FAILURE };
}