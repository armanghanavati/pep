import React from "react";
import OrderPointSupplierConfirmReport from "../components/orderSupplier/OrderPointSupplierConfirmReport";
class OrderPointSupplierConfirmReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>                
        <OrderPointSupplierConfirmReport />
      </div>
    );
  }
}
export default OrderPointSupplierConfirmReports;