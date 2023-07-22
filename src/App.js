
import React from 'react'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { connect } from "react-redux";
import jwt from 'jwt-decode' 
import Home from './pages/Home'
import MainMenuList from './components/common/MainMenuList'
import VersionCO from './components/common/VersionCO'
import { Login } from './api/UserApi';
import { userActions } from './redux/reducers/user/user-slice';
import { authUser } from './redux/reducers/user/user-actions';
import { Row } from 'reactstrap';

class App extends React.Component {

  componentDidMount= async ()=>{    
    this.getParamsFromUrl();    
    // alert(this.props.user.userId)
    // this.saveUserData(2121,"pedrammamad")
  }





  getParamsFromUrl = async ()=>{
    const params = new Proxy(new URLSearchParams(window.location.search), {      
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const Token = params.token;    
    let data={
      username: params.u,
      password: params.p
    }
    let resAuthUser=await authUser(data,"Not Token Generated Yet.")
    const userData = jwt (Token);
    let Vals=Object.values(userData);
    const UserId=Vals[1];    
    const permissions=resAuthUser.permissions;

    //------------------------------------------------------------------    
    
    // let data={
    //   username: "pedram",
    //   password: "123456"
    // }
    // let resAuthUser=await authUser(data,"Not Token Generated Yet.")
    // const Token=resAuthUser.token;
    // const userData = jwt (Token);
    // let Vals=Object.values(userData);
    // const UserId=Vals[1];
    // const permissions=resAuthUser.permissions;
    //------------------------------------------------------------------

    this.saveUserData(UserId,Token,permissions);
  }

  saveUserData=(userId,token,permissions)=>{    
    this.props.dispatch(userActions.setUser({
      userId,
      token,
      permissions
    }));   
  }


  render(){
    return (    
      <div className='mainBack'>        
      {/* <ComThree /> */} 
            
        <Home />      
               
        
      </div>
      
    );
  }
} 

const mapStateToProps=(state)=>({  
  user:state.users
});


export default connect(mapStateToProps)(App);