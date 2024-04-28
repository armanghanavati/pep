import React from "react";
import { connect } from "react-redux";
import { HubConnectionBuilder } from '@microsoft/signalr';
import "../assets/CSS/style.css";
import "../assets/CSS/mainDrawer_style.css";
import List from "devextreme-react/list";
import { Row, Col, Button } from "reactstrap";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { locale } from "devextreme/localization";
import Toolbar, { Item } from "devextreme-react/toolbar";
import SelectBox from "devextreme-react/select-box";

import { companyActions } from "../redux/reducers/company/company-slice";
import { companyListCombo } from "../redux/reducers/company/company-actions";
import { userActions } from "../redux/reducers/user/user-slice";
import { hubConnectionActions } from "../redux/reducers/hubConnection/hubConnection-slice"
import MainMenu from "../components/common/MainMenu";
import logo from "../assets/images/LOGO.jpg";
import LogoutIcon from "../assets/images/icon/logout.svg"
import BurgerMenuIcon from "../assets/images/icon/burgerMenu.png"
import profile from "../assets/images/icon/profile.png"
import Profiles from "./Profiles";
import { prettyFormat } from "@testing-library/react";
import sound from '../assets/sound/message.mp3';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr1Interview: [],
      stateShowMainMenu: true,
      linkPath: null,
      linkComponent: null,
      profile: null,
      hubConnection: null,
      stateSignalNotification: false,
      message: ""
    };
  }
  audio = new Audio(sound)
  async componentDidMount() {
    await this.fn_SetState();
    const hubConnection = new HubConnectionBuilder().withUrl(`${window.snapApi}/chatHub?userId=${sessionStorage.getItem("UserId")}`).withAutomaticReconnect().build();
    this.setState({ hubConnection }, () => {
      this.state.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while establishing connection :('));
      this.state.hubConnection.on('ReceiveMessage', (message) => {
        this.setState({ stateSignalNotification: true, message: message })
        this.audio.muted = false; // without this line it's not working although I have "muted" in HTML
        this.audio.play();
      });
    });
    this.props.dispatch(
      hubConnectionActions.setHubConnection({
        hubConnection
      })
    );
    // this.audio.muted = false; // without this line it's not working although I have "muted" in HTML
    // this.audio.play();
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
    await this.saveUserData(null, null, null);
    window.location.reload(true);
  };
  btnProfile_onClick = async () => {
    this.setState({
      linkPath: "/Profiles",
      linkComponent: <Profiles />,
    });
    // alert(this.state.linkPath)
    //if (this.state.linkPath != null)
      document.getElementById("lnkProfile").click();
  }

  saveUserData = (userId, token, permissions) => {
    sessionStorage.setItem('UserId', userId);
    sessionStorage.setItem('Token', token);
    sessionStorage.setItem('Permissions', JSON.stringify(permissions));
    this.props.dispatch(
      userActions.setUser({
        userId,
        token,
        permissions,
      })
    );
  };

  btnShowHideMenu_onClick = () => {
    this.setState({ stateShowMainMenu: !this.state.stateShowMainMenu })
  }

  closeSignalNotif = () => {
    this.setState({
      stateSignalNotification: false
    })
  }

  render() {
    locale("fa-IR");
    return (
      <div className="mainRow">
        {/* <Row style={{position:'fixed',width:'100vh',top:'0',left:'0',zIndex:'9999',width:'100%'}}> */}
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
              <img src={profile} style={{ width: "23px", marginLeft: "20px", cursor: 'pointer' }} onClick={this.btnProfile_onClick} />
            </Item>
            <Item location="right">
              <img src={LogoutIcon} style={{ width: "23px", marginLeft: "20px", cursor: 'pointer' }} onClick={this.btnExit_onClick} />
            </Item>

            <Item location="after" widget="dxButton" >
              <img src={BurgerMenuIcon} style={{ width: "30px", marginRight: "10px", cursor: 'pointer' }} onClick={this.btnShowHideMenu_onClick} />
            </Item>

          </Toolbar>
        </Row>

        <Row className="textCenter">
          <Col xs="auto">
            <MainMenu showMainMenu={this.state.stateShowMainMenu} linkPath={this.state.linkPath} linkComponent={this.state.linkComponent} />
          </Col>
        </Row>
        {this.state.stateSignalNotification && (
          <Row style={{ backgroundColor: "lightblue", padding: "20px", position: "fixed", zIndex: "2", bottom: "0", height: "200px", width: "460px" }}>
            <Col xs="auto"><p style={{ fontSize: "16pt", cursor: "pointer" }} onClick={this.closeSignalNotif}>x</p></Col>
            <Col style={{ textAlign: "left" }}><span style={{ fontSize: "12pt", marginRight: "100px" }}>اطلاع</span></Col>
            <Row>
              <p style={{ fontSize: "16pt", textAlign: "justify" }}>{this.state.message}<span style={{ fontSize: '20pt', marginRight: "30px", fontStyle: "italic" }}>!</span></p>
            </Row>
          </Row>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Company: state.companies,
});

export default connect(mapStateToProps)(Home);
