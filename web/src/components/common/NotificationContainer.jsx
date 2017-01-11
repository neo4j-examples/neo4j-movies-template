import React from 'react';
import Notification from './Notification.jsx';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NotificationActions from '../../redux/actions/NotificationActions';

const NotificationContainer = ({dismiss, notifications}) => {
    return (
      <div className="notification-container">
        {
          notifications.map((notification, index) => <Notification key={index} notification={notification} dismiss={dismiss}/>)
        }
      </div>
    );
};

NotificationContainer.displayName = 'NotificationContainer';

function mapStateToProps(state) {
  return {
    notifications: state.notifications
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NotificationActions, dispatch);
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer);

