import React from "react";
import UserLocation from "../components/userLocation/UserLocation";
class UserLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <UserLocation />
      </div>
    );
  }
}

export default UserLocations;