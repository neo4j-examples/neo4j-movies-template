import * as Types from './PersonActionTypes';
import PersonApi from '../../api/PersonApi';
import {callApi} from './ApiActions';

export function clearPerson() {
  return {
    type: Types.PERSON_DETAIL_CLEAR
  };
}

export function getPerson(id) {
  return callApi({
    types: [Types.PERSON_DETAIL_GET_REQUEST, Types.PERSON_DETAIL_GET_SUCCESS],
    callAPI: () => PersonApi.getPerson(id)
  });
}

export function getRelated(id) {
  return callApi({
    types: [Types.PERSON_RELATED_GET_REQUEST, Types.PERSON_RELATED_GET_SUCCESS],
    callAPI: () => PersonApi.getRelated(id)
  });
}
