import React from "react";
import Zone from "../components/zone/Zone";
class Zones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <Zone />
      </div>
    );
  }
}

export default Zones;