import React from "react";
import TicketSubjectUser from "../components/ticket/TicketSubjectUser";
class TicketSubjectUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <TicketSubjectUser />
      </div>
    );
  }
}

export default TicketSubjectUsers;