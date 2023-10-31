import React from "react";
import Opinion from "../components/opinion/Opinion";
class Opinions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>                
        <Opinion />
      </div>
    );
  }
}

export default Opinions;
