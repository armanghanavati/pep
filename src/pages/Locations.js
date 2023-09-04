import React from "react";
import Location from "../components/location/Location";
class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <Location />
      </div>
    );
  }
}

export default Locations;
