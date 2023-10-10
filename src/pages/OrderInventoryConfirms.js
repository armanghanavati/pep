import React from "react";
import OrderInventoryConfirm from '../components/orderInventory/OrderInventoryConfirm'
class OrderInventoryConfirms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <OrderInventoryConfirm />
      </div>
    );
  }
}

export default OrderInventoryConfirms;
