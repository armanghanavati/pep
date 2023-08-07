import React from 'react';
import { connect } from "react-redux";
import TreeView from 'devextreme-react/tree-view';
import {    
  Row,
  Col,    
} from 'reactstrap';
import 'devextreme/dist/css/dx.light.css';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import { paymentActions } from '../../redux/reducers/payment/payment-slice.js';
import { REAL_COMPONENT } from '../../config/configComponent.js';

var permTest=[
  {
      "id": 0,
      "objectId": 12,
      "objectName": "cartable.show",
      "permissionName": "show",
      "access": "cartable.show",
      "objectTitle": "کارتابل",
      "objectParentId": null,
      "objectTreeTypeId": 1,
      "objectTreeTypeName": "MainMenu",
      "linkName":"Ticket",
      "linkComponent":"<Ticket />",
      "linkPath":"/Ticket"
  },
  {
      "id": 0,
      "objectId": 4,
      "objectName": "order.show",
      "permissionName": "show",
      "access": "order.show",
      "objectTitle": "سفارشات",
      "objectParentId": null,
      "objectTreeTypeId": 1,
      "objectTreeTypeName": "MainMenu",
      "linkName":null,
      "linkComponent":"",
      "linkPath":null
  },
  {
      "id": 0,
      "objectId": 5,
      "objectName": "order_inv.show",
      "permissionName": "show",
      "access": "order_inv.show",
      "objectTitle": "سفارش از انبار",
      "objectParentId": 4,
      "objectTreeTypeId": 1,
      "objectTreeTypeName": "MainMenu",
      "linkName":"PaymentRequest",
      "linkComponent":"<PaymentRequest />",
      "linkPath":"/PaymentRequest"
  }
]

class MainMenu extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
        MainMenuData:[],  
        currentItem:permTest[0],    
        linkPath:null,
        linkComponent:null,
        stateDenyPermission:false    
    };
  }

  async componentDidMount(){        
    await this.getPermission();   
    await this.fn_Routing();
  }

  fn_Routing=async()=>{
    const ORG_URL=window.location.href;
    const URL=ORG_URL.split('/');
    const LINK_PATH = ORG_URL.substring(ORG_URL.indexOf(URL[3]),ORG_URL.length);
    const LINK_COMPONENT=URL[URL.length-1];

    const PERMISSIONS=this.props.User.permissions
    for(let i=0;i<PERMISSIONS.length;i++)
      if(PERMISSIONS[i].linkName==LINK_COMPONENT){                  
        this.setState({
          linkPath:'/'+LINK_PATH,   
          stateDenyPermission:false   
        })    
        await this.fn_FindLinkComponent(LINK_COMPONENT);            
        document.getElementById('lnkRoute').click();
      }      
  }
  
  fn_FindLinkComponent=(linkParams)=>{
    for(let i=0;i<REAL_COMPONENT.length;i++)    
      if(REAL_COMPONENT[i].strComponent==linkParams)
        this.setState({linkComponent:REAL_COMPONENT[i].orgComponent})
  }
  fn_ConvertLinkComponent=async(perm)=>{
    // let temp=permTest;
    let temp=perm;
    for(let i=0;i<temp.length;i++)
      for(let j=0;j<REAL_COMPONENT.length;j++)
        if(temp[i].LinkComponent==REAL_COMPONENT[j].strComponent){   
          temp[i].LinkComponent=REAL_COMPONENT[j].orgComponent;   
          // alert('test')
        }               
    // permTest=temp  
    return temp;  
  }

  getPermission=async()=>{
    let tempPermission=this.props.User.permissions;
    // let tempPermission=permTest;
    
    let tempMainMenu=[];
    if(tempPermission!=null)
    for(let i=0;i<tempPermission.length;i++)
        if(tempPermission[i].objectTreeTypeName=='MainMenu'){
            let obj={
                Id:tempPermission[i].objectId,
                ParentId:tempPermission[i].objectParentId,
                Title:tempPermission[i].objectTitle,
                Name:tempPermission[i].objectName,
                LinkName: tempPermission[i].linkName,
                LinkComponent: tempPermission[i].linkComponent,
                LinkPath:tempPermission[i].linkName!=null ? '/'+tempPermission[i].linkName : null,
            }
            tempMainMenu.push(obj);
        }
    // alert('Permissions='+JSON.stringify(tempMainMenu));
    let convertedPerm=await this.fn_ConvertLinkComponent(tempMainMenu);   
    this.setState({MainMenuData:convertedPerm});    
    console.log('Permissions='+JSON.stringify(convertedPerm));
    return convertedPerm;
  }

  mnuMainMenu_onClick=(e)=>{
    // alert(JSON.stringify(e.itemData))
    // switch(e.itemData.Name){
    //     case 'cartable': this.props.dispatch(paymentActions.enableRequestPayment()); break;
    // }        
    
      this.setState({
        currentItem: e.itemData ,
        linkPath:'/'+e.itemData.LinkName,
        linkComponent:e.itemData.LinkComponent
      });                
      
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.currentItem !== this.state.currentItem )
      document.getElementById('lnkRoute').click();
  }


  render() {
    const { currentItem } = this.state;
    return (
        <>
          <Row>
            <Col xs='auto' style={{backgroundColor:'#34bdff',color:'white',height:'94vh'}}>
              <div style={{paddingTop:'10px'}}>
                <TreeView id="simple-treeview"
                    items={this.state.MainMenuData}
                    dataStructure="plain"
                    displayExpr="Title"
                    parentIdExpr="ParentId"
                    keyExpr="Id"
                    width={300}                
                    rtlEnabled={true}
                    selectionMode='single'                
                    searchEnabled={true}                                 
                    onItemClick={this.mnuMainMenu_onClick}                                      
                />                 
              </div>
            </Col>
            {/* {currentItem.LinkName!==null ? */}
              <Col>        
                {/* <p id="PermissionDeny" style={{textAlign:'center',padding:'30px',color:'red',fontSize:'20px'}} ></p>     */}
                <div style={{color:'black'}}>                   
                  {/* <Link id='lnkRoute' to={this.state.currentItem.LinkPath}></Link>                                
                  <Routes>                                                  
                    <Route exact path={this.state.currentItem.LinkPath} element={this.state.currentItem.LinkComponent}></Route>            
                  </Routes> */}
                  <Link id='lnkRoute' to={this.state.linkPath}></Link>                                
                  <Routes>                                                  
                    <Route exact path={this.state.linkPath} element={this.state.linkComponent}></Route>            
                  </Routes>
                </div>
              </Col> 
             {/* : null}  */}
          </Row>         
      </>
    );
  }  
  
}

const mapStateToProps=(state)=>({  
    User:state.users,    
});

export default connect(mapStateToProps)(MainMenu);
