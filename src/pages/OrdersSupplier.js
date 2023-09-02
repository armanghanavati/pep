import React from "react";
import OrderSupplier from "../components/orderSupplier/OrderSupplier";
class OrdersSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <OrderSupplier />
      </div>
    );
  }
}

export default OrdersSupplier;
