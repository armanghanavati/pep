import React from "react";
import TissDataDoc from "../components/tissDataDoc/TissDataDoc";
class TissDataDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <TissDataDoc />        
      </div>
    );
  }
}

export default TissDataDocs;