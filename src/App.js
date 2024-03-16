import React from "react";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import {
  Row,
  Col,
  Card,
  Label,
  TabContent, TabPane, Nav, NavItem, NavLink,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { connect } from "react-redux";
import jwt from "jwt-decode";
import Home from "./pages/Home";
import VersionCO from "./components/common/VersionCO";
import Login from "./pages/Login";
import { userActions } from "./redux/reducers/user/user-slice";
import { authUser } from "./redux/reducers/user/user-actions";
import { hubConnectionActions } from "./redux/reducers/hubConnection/hubConnection-slice"
import { checkTokenExpire } from "./utiliy/GlobalMethods";
import { HubConnectionBuilder } from '@microsoft/signalr';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateRedirectHome: false,
      stateRedirectLogin: true,
      hubConnection: null,
      stateSignalNotification: false,
      message: "",
    };
  }
  componentDidMount = async () => {
    // await this.getParamsFromUrl();    
    await this.fn_CheckUrlProtocol();
    let token = this.props.User.token
    await checkTokenExpire(token);
    await this.fn_CheckIsLogin();
    const hubConnection = new HubConnectionBuilder().withUrl(`${window.snapApi}/chatHub?userId=${sessionStorage.getItem("UserId")}`).withAutomaticReconnect().build();
    this.setState({ hubConnection }, () => {
      this.state.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while establishing connection :('));
      this.state.hubConnection.on('ReceiveMessage', (message) => {
        this.setState({ stateSignalNotification: true, message: message })
      });
    });
    this.props.dispatch(
      hubConnectionActions.setHubConnection({
        hubConnection
      })
    );
  };

  fn_CheckUrlProtocol = () => {
    const HOST_NAME = window.location.hostname;
    const PROTOCOL = window.location.protocol;
    if (HOST_NAME !== "localhost" && HOST_NAME !== "127.0.0.1" && PROTOCOL !== "https:") {
      window.location.replace(window.location.href.replace("http:", "https:"));
    }
  }

  fn_CheckIsLogin = async () => {
    const USER_ID = sessionStorage.getItem("UserId");
    const TOKEN = sessionStorage.getItem("Token");
    const PERMISSIONS = JSON.parse(sessionStorage.getItem("Permissions"));
    if (USER_ID != null && TOKEN != null && PERMISSIONS != null) {
      await this.saveUserData();
      this.setState({
        stateRedirectLogin: false,
        stateRedirectHome: true,
      });
    }
  };

  getParamsFromUrl = async () => {
    // const params = new Proxy(new URLSearchParams(window.location.search), {
    //   get: (searchParams, prop) => searchParams.get(prop),
    // });
    // const Token = params.token;
    // let data={
    //   username: params.u,
    //   password: params.p
    // }
    // let resAuthUser=await authUser(data,"Not Token Generated Yet.")
    // const userData = jwt (Token);
    // let Vals=Object.values(userData);
    // const UserId=Vals[1];
    // const permissions=resAuthUser.permissions;

    //-------------------Config For Debug------------------------------

    let data = {
      username: "pedram",
      password: "123456",
    };
    let resAuthUser = await authUser(data, "Not Token Generated Yet.");
    const Token = resAuthUser.token;
    const userData = jwt(Token);
    let Vals = Object.values(userData);
    const UserId = Vals[1];
    const permissions = resAuthUser.permissions;
    //------------------------------------------------------------------

    await this.saveUserData(UserId, Token, permissions);
    this.setState({ stateRenderComponent: true });
  };

  // saveUserData=(userId,token,permissions)=>{
  //   this.props.dispatch(userActions.setUser({
  //     userId,
  //     token,
  //     permissions
  //   }));
  // }

  saveUserData = () => {
    const userId = sessionStorage.getItem("UserId");
    const token = sessionStorage.getItem("Token");
    const permissions = JSON.parse(sessionStorage.getItem("Permissions"));
    // alert(userId)
    this.props.dispatch(
      userActions.setUser({
        userId,
        token,
        permissions,
      })
    );
  };

  closeSignalNotif = () => {
    this.setState({
      stateSignalNotification: false
    })
  }
  render() {
    return (
      <div className="mainBack">
        {/* <ComThree /> */}
        {this.state.stateRedirectHome && <Home />}
        {this.state.stateRedirectLogin && <Login />}
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
  //Hub_conneciton: state.hubConnections
});

export default connect(mapStateToProps)(App);
