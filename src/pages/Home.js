import React from "react";
import { connect } from "react-redux";
import "../assets/CSS/style.css";
import "../assets/CSS/mainDrawer_style.css";
import List from "devextreme-react/list";
import { Row, Col, Button } from "reactstrap";
import { locale } from "devextreme/localization";
import Toolbar, { Item } from "devextreme-react/toolbar";
import SelectBox from "devextreme-react/select-box";

import { companyActions } from "../redux/reducers/company/company-slice";
import { companyListCombo } from "../redux/reducers/company/company-actions";
import { userActions } from "../redux/reducers/user/user-slice";

import MainMenu from "../components/common/MainMenu";
import logo from "../assets/images/LOGO.jpg";
import LogoutIcon from "../assets/images/icon/logout.svg"

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr1Interview: [],
    };
  }

  async componentDidMount() {
    await this.fn_SetState();
  }

  fn_SetState = async () => {
    const companyCombo = await companyListCombo(this.props.User.token);
    if (companyCombo !== null) {
      const currentCompanyId = companyCombo[0].id;
      this.props.dispatch(
        companyActions.setCurrentCompanyId({
          currentCompanyId,
        })
      );
    }
    this.props.dispatch(
      companyActions.setCompanyCombo({
        companyCombo,
      })
    );
  };

  cmbCompany_onChange = (e) => {
    let currentCompanyId = parseInt(e);
    this.props.dispatch(
      companyActions.setCurrentCompanyId({
        currentCompanyId,
      })
    );
  };

  btnExit_onClick = async () => {
    // alert("exit");
    await this.saveUserData(null,null,null);
    window.location.reload(true);
  };

  saveUserData = (userId, token, permissions) => {
    sessionStorage.setItem('UserId',userId);
    sessionStorage.setItem('Token',token);
    sessionStorage.setItem('Permissions',JSON.stringify(permissions));
    this.props.dispatch(
      userActions.setUser({
        userId,
        token,
        permissions,
      })
    );
  };

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
              <div style={{ marginLeft: "25px", width: "200px" }}>
                <SelectBox
                  dataSource={this.props.Company.companyCombo}
                  displayExpr="label"
                  placeholder="انتخاب شرکت"
                  valueExpr="id"
                  value={this.props.Company.currentCompanyId}
                  searchEnabled={true}
                  rtlEnabled={true}
                  onValueChange={this.cmbCompany_onChange}
                  className="fontStyle"
                />
              </div>
            </Item>
            <Item location="right">
              {/* <Button
                text="خروج"
                type="success"
                stylingMode="contained"
                rtlEnabled={true}
                onClick={this.btnExit_onClick}
              /> */}
     
              <img src={LogoutIcon} style={{ width: "23px", marginLeft: "20px" ,cursor:'pointer'}}  onClick={this.btnExit_onClick} />
           
            </Item>
          </Toolbar>
        </Row>
        <Row className="textCenter">
          <Col xs="auto">
            <MainMenu />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(Home);
