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
import { checkTokenExpire } from "./utiliy/GlobalMethods";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateRedirectHome: false,
      stateRedirectLogin: true,
    };
  }
  componentDidMount = async () => {
    // await this.getParamsFromUrl();    
    //await this.fn_CheckUrlProtocol();
    // alert(this.fn_counterDecimal(421.56))
    let token = this.props.User.token
    await checkTokenExpire(token);
    await this.fn_CheckIsLogin();
  };

  // -----------------------------------------------------------------------------------
  fn_IntPart(num){    
    let sah=0;
    let mod=1;
    while(mod>=1){
      sah=Math.floor(num/10);
      mod=num % 10;
      if(mod>=1){
        sah=num-mod;        
        sah=sah+Math.floor(mod/1);
        mod=num % 1;
      }
      else
        sah=sah*10;
    }
    return sah;
  }

  fn_counterDecimal(num){
    let sah=this.fn_IntPart(num)                
    let dec=num-sah;       
    let counterDecimal=0;
    let strDec='';
    while(dec>0){
      var newNum=dec*10;
      var sahNew=this.fn_IntPart(newNum);      
      strDec+=sahNew
      dec=newNum-sahNew;
      counterDecimal++;
    }
    alert(strDec)
    return counterDecimal;
  }
  // -----------------------------------------------------------------------------------

  fn_CheckUrlProtocol = () => {
    const HOST_NAME = window.location.hostname;
    const PROTOCOL = window.location.protocol;
    if (HOST_NAME !== "localhost"  && HOST_NAME !== "127.0.0.1" && PROTOCOL !== "https:") {
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

  render() {
    return (
      <div className="mainBack">
        {/* <ComThree /> */}
        {this.state.stateRedirectHome && <Home />}
        {this.state.stateRedirectLogin && <Login />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  //Hub_conneciton: state.hubConnections
});

export default connect(mapStateToProps)(App);
