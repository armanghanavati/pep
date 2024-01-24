import React from "react";
import SnpOrder from "../components/snapp/SnpOrder";
class SnpOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <SnpOrder />
      </div>
    );
  }
}

export default SnpOrders;