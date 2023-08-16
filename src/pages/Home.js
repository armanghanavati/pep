import React from "react";
import { connect } from "react-redux";
import "../assets/CSS/style.css";
import "../assets/CSS/mainDrawer_style.css";
import List from "devextreme-react/list";
import { Row, Col } from "reactstrap";
import { locale } from "devextreme/localization";
import Toolbar, { Item } from "devextreme-react/toolbar";
import SelectBox from "devextreme-react/select-box";

import MainMenu from "../components/common/MainMenu";
import logo from "../assets/images/LOGO.jpg";

class Home extends React.Component {
  render() {
    locale("fa-IR");
    return (
      <div className="mainRow">
        <Row>
          <Toolbar>
            <Item location="center">
              <img src={logo} style={{ width: "235px", margin: "auto" }} />
            </Item>
            <Item location="left">
              <div style={{marginLeft:'25px',width:'200px'}}>                
                <SelectBox
                  // dataSource={this.props.TicketSubject.parentTicketSubjects}
                  displayExpr="subject"
                  placeholder="انتخاب شرکت"
                  valueExpr="id"
                  searchEnabled={true}
                  rtlEnabled={true}
                  // onValueChange={this.cmbTicketSubjectParent_onChange}
                />                
              </div>
            </Item>
          </Toolbar>
        </Row>
        <Row>
          <Col>
            <MainMenu />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users,
  stateTicket: state.ticket.stateOfNewTicket,
  stateRequestPayment: state.payment.stateOfRequestPayment,
  stateConfirmPayment: state.payment.stateOfConfirmPayment,
});

export default connect(mapStateToProps)(Home);
