import React from "react";
import ItemsSupplier from "../components/itemSupplier/ItemSupplier";
class ItemsSuppliers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <ItemsSupplier />
      </div>
    );
  }
}

export default ItemsSuppliers;