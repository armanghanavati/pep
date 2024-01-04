import React from "react";
import TicketReport from "../components/ticket/TicketReport";
class TicketReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <TicketReport />
      </div>
    );
  }
}

export default TicketReports;