import React from "react";
import UserCompany from "../components/userCompany/UserCompany";
class UserCompanies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>        
        <UserCompany />
      </div>
    );
  }
}

export default UserCompanies;