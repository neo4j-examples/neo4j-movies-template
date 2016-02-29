import React from 'react';

export default class Loading extends React.Component {

  render() {
    return (
      <div className="sk-spinner sk-spinner-chasing-dots">
        <div className="sk-dot1"></div>
        <div className="sk-dot2"></div>
      </div>
    );
  }

}

Loading.displayName = 'Loading';
