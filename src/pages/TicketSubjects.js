import React from "react";
import TicketSubject from "../components/ticket/TicketSubject";
class TicketSubjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <TicketSubject />
      </div>
    );
  }
}

export default TicketSubjects;