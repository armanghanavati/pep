import React from "react";
import OrderPointSupplierReport from "../components/orderSupplier/OrderPointSupplierReport";
class OrderPointSupplierReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <OrderPointSupplierReport />
      </div>
    );
  }
}
export default OrderPointSupplierReports;