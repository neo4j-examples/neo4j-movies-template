import _ from 'lodash';
import {NotificationActionTypes, NotificationType} from './NotificationActionTypes';

export function create(type, message) {
  return {
    type: NotificationActionTypes.CREATE_NOTIFICATION,
    notification: {
      id: _.uniqueId(),
      message,
      type
    }
  };
}

export function createError(message) {
  return {
    type: NotificationActionTypes.CREATE_NOTIFICATION,
    notification: {
      id: _.uniqueId(),
      message,
      type: NotificationType.error
    }
  };
}

export function createSuccess(message) {
  return {
    type: NotificationActionTypes.CREATE_NOTIFICATION,
    notification: {
      id: _.uniqueId(),
      message,
      type: NotificationType.success
    }
  };
}

export function dismiss(notification) {
  return {
    type: NotificationActionTypes.DISMISS_NOTIFICATION,
    notification
  };
}
