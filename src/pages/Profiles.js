import React from "react";
import Profile from "../components/user/Profile";
class Profiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <Profile />
      </div>
    );
  }
}

export default Profiles;
