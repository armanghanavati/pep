import React from "react";
import StoreKalaMojoodiReport from "../components/storeKala/StoreKalaMojoodiReport";
class StoreKalaMojoodiReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <StoreKalaMojoodiReport />
      </div>
    );
  }
}

export default StoreKalaMojoodiReports;