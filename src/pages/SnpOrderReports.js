import React from "react";
import SnpOrderReport from "../components/snapp/SnpOrderReport";
class SnpOrderReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <SnpOrderReport />
      </div>
    );
  }
}

export default SnpOrderReports;