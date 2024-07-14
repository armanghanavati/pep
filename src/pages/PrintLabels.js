import React from "react";
import PrintLabel from "../components/promotion/PrintLabel";
class PrintLabels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <PrintLabel />
      </div>
    );
  }
}

export default PrintLabels;
