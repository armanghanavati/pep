import React from "react";
import OrderSupplierConfirm from "../components/orderSupplier/OrderSupplierConfirm";
class OrderSupplierConfirms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>                
        <OrderSupplierConfirm />
      </div>
    );
  }
}

export default OrderSupplierConfirms;
