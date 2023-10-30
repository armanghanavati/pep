import React from "react";
import SupplierLocationContact from "../components/supplierLocationContact/SupplierLocationContact";
class SupplierLocationContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <SupplierLocationContact />
      </div>
    );
  }
}

export default SupplierLocationContacts;