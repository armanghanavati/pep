import React from "react";
import OrderInventoryOutRouteReport from '../components/orderInventory/OrderInventoryOutRouteReport'
class OrdersInventoryOutRouteReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <OrderInventoryOutRouteReport />        
      </div>
    );
  }
}

export default OrdersInventoryOutRouteReports;
