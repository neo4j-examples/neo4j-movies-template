import React from 'react';

export default class Person extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="nt-person">
        <h2>Person!</h2>
      </div>
    );
  }
}
Person.displayName = 'Person';
