import React from "react";
import OrderByUpload from "../components/orderInventory/OrderByUpload";
class OrdersByUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <OrderByUpload />
      </div>
    );
  }
}

export default OrdersByUpload;

