import * as Types from './PersonActionTypes';

export function clearPerson() {
  return {
    type: Types.PERSON_DETAIL_CLEAR
  };
}

export function getPerson(id) {
  return {type: Types.PERSON_DETAIL_GET_REQUEST, id};
}

export function getPersonSuccess(response) {
  return {type: Types.PERSON_DETAIL_GET_SUCCESS, response};
}

export function getPersonFailure(error) {
  return {type: Types.PERSON_DETAIL_GET_FAILURE, error};
}

export function getRelated(id) {
  return {type: Types.PERSON_RELATED_GET_REQUEST, id};
}

export function getRelatedSuccess(response) {
  return {type: Types.PERSON_RELATED_GET_SUCCESS, response};
}

export function getRelatedFailure(error) {
  return {type: Types.PERSON_RELATED_GET_FAILURE, error};
}
