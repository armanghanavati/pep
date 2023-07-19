
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
import { Row } from 'reactstrap';

class App extends React.Component {

  componentDidMount= async ()=>{    
    this.getParamsFromUrl();    
    // alert(this.props.user.userId)
    // this.saveUserData(2121,"pedrammamad")
  }


  getParamsFromUrl=()=>{
    // const params = new Proxy(new URLSearchParams(window.location.search), {      
    //   get: (searchParams, prop) => searchParams.get(prop),
    // });
    // const Token = params.token;
    // const userData = jwt (Token);
    // let Vals=Object.values(userData);
    // const UserId=Vals[1];    

    var Token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGVkcmFtIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI0IiwianRpIjoiYTA3MjMzOWUtYjllZi00MTMxLTkyOGYtZDVhZTA1NmM2YWE3IiwiZXhwIjoxNjg5NzgzODgzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxMzkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxMzkifQ.KhqLz0CFzAIdXqgaXEI9ofNxxNHQLs31QTLcnADlLG4"
    var UserId=4;

    this.saveUserData(UserId,Token);
  }

  saveUserData=(userId,token)=>{    
    this.props.dispatch(userActions.setUser({
      userId,
      token      
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