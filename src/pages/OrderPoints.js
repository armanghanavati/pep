import React from "react";
import OrderPoint from "../components/orderPoint/OrderPoint";
class OrderPoints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>                
        <OrderPoint />
      </div>
    );
  }
}

export default OrderPoints;
