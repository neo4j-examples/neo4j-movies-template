import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationType} from '../../redux/actions/NotificationActionTypes';

export default class Notification extends Component {

  constructor(props) {
    super(props);
    this.dismiss = this.dismiss.bind(this);
  }

  componentDidMount() {
    var {notification, dismiss, timeout} = this.props;

    this.dismissNotification = setTimeout(function () {
      dismiss(notification);
    }, timeout);
  }

  dismiss() {
    this.props.dismiss(this.props.notification);
    clearTimeout(this.dismissNotification);
  }

  render() {
    var {notification} = this.props;

    if (!notification) {
      return null;
    }

    //can use enum key or value
    var classes = NotificationType[notification.type] || notification.type;

    return (
      <div data-alert className={'alert-box ' + classes}>
        {notification.message}
        <button className="buttonLink close" onClick={this.dismiss}>&times;</button>
      </div>
    );
  }
}


Notification.displayName = 'Notification';
Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  timeout: PropTypes.number,
  dismiss: PropTypes.func
};
Notification.defaultProps = {
  timeout: 6000
};
