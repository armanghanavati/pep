import React from "react";
import { connect } from "react-redux";
import jwt from "jwt-decode";
import { BrowserRouter as Router, Routes, Route, Link, Redirect, withRouter, Switch, HashHistory } from 'react-router-dom';

import "../assets/CSS/login.css";
import { Row, Col, Input } from "reactstrap";
import Fish from './Fish.js';
import logo from "../assets/images/LOGO.jpg";

import Home from "./Home";

import { authUser } from "../redux/reducers/user/user-actions";
import { userActions } from "../redux/reducers/user/user-slice";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errLoginMsg: "",
      txtUserNameValue: null,
      txtPasswordValue: null,
      stateRedirectHome: false,
      stateRedirectFish: false
    };
  }

  btnLogin_onClick = async () => {
    let data = {
      username: this.state.txtUserNameValue,
      password: this.state.txtPasswordValue,
    };
    let resAuthUser = await authUser(data, "Not Token Generated Yet.");
    if (resAuthUser.data != null) {
      const Token = resAuthUser.data.token;
      const userData = jwt(Token);
      let Vals = Object.values(userData);
      const UserId = Vals[1];
      const permissions = resAuthUser.data.permissions;

      await this.saveUserData(UserId, Token, permissions);
      this.setState({ stateRedirectHome: true });
    } else
      this.setState({
        errLoginMsg: resAuthUser.msg,
      });
  };

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

  txtUserName_onChange = (event) => {
    this.setState({
      txtUserNameValue: event.target.value.trim(),
      errLoginMsg: null,
    });
  };

  txtPassword_onChange = (event) => {
    this.setState({
      txtPasswordValue: event.target.value.trim(),
      errLoginMsg: null,
    });
  };

  txtPassword_onKeyPress = (event) => {
    let key = event.keyCode || event.which;
    if (key === 13) this.btnLogin_onClick();
  };

  render() {
    if (this.state.stateRedirectHome)
      return (
        <>
          <Home />
        </>
      );

    if (this.state.stateRedirectFish) {
      return (
        <>
          <Fish />
        </>
      );
    }
    return (
      <div
        style={{ paddingTop: "10%", background: "#0ca3d2", minHeight: "100vh" }}
      >
        <div className="login">
          <h1>صفحه ورود</h1>
          <div style={{ direction: "rtl" }}>
            <Row>
              <img
                src={logo}
                style={{
                  width: "270px",
                  margin: "auto",
                  alignItems: "center",
                  textAlign: "center",
                }}
              />
            </Row>
            <p></p>
            <Row>
              <Col>
                <Input
                  type="text"
                  name="login"
                  value={this.state.txtUserNameValue}
                  onChange={this.txtUserName_onChange}
                  placeholder="نام کاربری"
                />
              </Col>
            </Row>
            <p></p>
            <Row>
              <Col>
                <Input
                  type="password"
                  name="password"
                  value={this.state.txtPasswordValue}
                  onKeyPress={this.txtPassword_onKeyPress}
                  onChange={this.txtPassword_onChange}
                  placeholder="رمز عبور"
                />
              </Col>
            </Row>

            <p></p>
            <Row className="submit">
              <Col>
                <input
                  type="submit"
                  name="commit"
                  value="ورود"
                  onClick={this.btnLogin_onClick}
                />
              </Col>
              <Col>
                <label style={{ fontSize: "13px" }}>
                  <input type="checkbox" name="remember_me" id="remember_me" />
                  مرا به خاطر بیاور
                </label>
              </Col>
            </Row>
            <p></p>
            <Row>
              <Col>
                {/* <Link id='lnkRoute' to='Fish'>
                  
                  fish
                </Link>                                
                <Routes>                                                  
                  <Route exact path='/Fish' element={<Fish />}></Route>            
                </Routes>
                 */}
                <input type="submit" name="commit" value="مشاهده فیش حقوقی" onClick={() => this.setState({ stateRedirectFish: true })} />
              </Col>
            </Row>
            <p></p>
            <Row style={{ color: "red", fontSize: "12px" }}>
              <Col>{this.state.errLoginMsg}</Col>
            </Row>
          </div>
        </div>

        <Row className="login-help">
          <p>فناوری اطلاعات شرکت پیوند</p>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users,
});

export default connect(mapStateToProps)(Login);
