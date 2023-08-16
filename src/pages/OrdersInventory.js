import React from "react";
import OrderInventory from '../components/orderInventory/OrderInventory'
class OrdersInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <OrderInventory />
      </div>
    );
  }
}

export default OrdersInventory;
