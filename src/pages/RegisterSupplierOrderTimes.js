import React from "react";
import RegisterSupplierOrderTime from "../components/orderInventory/RegisterSupplierOrderTime";
class RegisterSupplierOrderTimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <RegisterSupplierOrderTime />
      </div>
    );
  }
}

export default RegisterSupplierOrderTimes;