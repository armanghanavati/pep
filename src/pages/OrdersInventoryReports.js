import React from "react";
import OrderInventoryReport from '../components/orderInventory/OrderInventoryReport'
class OrdersInventoryReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <OrderInventoryReport />        
      </div>
    );
  }
}

export default OrdersInventoryReports;
