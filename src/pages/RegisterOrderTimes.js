import React from "react";
import RegisterOrderTime from "../components/orderInventory/RegisterOrderTime";
class RegisterOrderTimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <RegisterOrderTime />
      </div>
    );
  }
}

export default RegisterOrderTimes;