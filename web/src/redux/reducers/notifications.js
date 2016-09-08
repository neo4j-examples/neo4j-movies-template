import _ from 'lodash';
import { NotificationActionTypes } from '../actions/NotificationActionTypes';

export default function notifications(state = [], action) {
  switch (action.type) {
    case NotificationActionTypes.CREATE_NOTIFICATION:
      return [
        ...state,
        {...action.notification}
      ];
    case NotificationActionTypes.DISMISS_NOTIFICATION:
      return _.without(state, action.notification);
    default:
      return state;
  }
}
