import React from "react";
import AuthenticatedPage from "./AuthenticatedPage.jsx";
import {connect} from "react-redux";

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var {profile} = this.props;

    if(!profile) {
      return null;
    }

    return (
      <div className="nt-profile">
        <div className="small-12 medium-2 large-2 columns">
          <div className="nt-profile-gravatar">
              <img src={_.get(profile, 'avatar.fullSize')}/>
          </div>
        </div>
        <div className="columns small-12 medium-10 large-10 columns">
          <div className="nt-profile-first-name">
            User Name: {profile.username}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    profile: _.get(state, 'profile.profile')
  };
}

Profile.displayName = 'Profile';

export default connect(mapStateToProps)(AuthenticatedPage(Profile));
