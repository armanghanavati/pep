import React from 'react';
import { connect } from "react-redux";
import TreeView from 'devextreme-react/tree-view';
import 'devextreme/dist/css/dx.light.css';
import { paymentActions } from '../../redux/reducers/payment/payment-slice.js';


class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        MainMenuData:[],             
    };
  }

  async componentDidMount(){
    await this.getPermission();
  }

  getPermission=()=>{
    let tempPermission=this.props.User.permissions;
    
    let tempMainMenu=[];
    if(tempPermission!=null)
    for(let i=0;i<tempPermission.length;i++)
        if(tempPermission[i].objectTreeTypeName=='MainMenu'){
            let obj={
                Id:tempPermission[i].objectId,
                ParentId:tempPermission[i].objectParentId,
                Title:tempPermission[i].objectTitle,
                Name:tempPermission[i].objectName
            }
            tempMainMenu.push(obj);
        }
    // alert('Permissions='+JSON.stringify(tempMainMenu));
    this.setState({MainMenuData:tempMainMenu});
    return tempMainMenu;
  }

  mnuMainMenu_onClick=(e)=>{
    // alert(JSON.stringify(e.itemData))
    switch(e.itemData.Name){
        case 'cartable': this.props.dispatch(paymentActions.enableRequestPayment()); break;
    }
  }

  render() {
    return (
        <div style={{backgroundColor:'#34bdff',color:'white',height:'94vh'}}>
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
    );
  }  
  
}

const mapStateToProps=(state)=>({  
    User:state.users,    
});

export default connect(mapStateToProps)(MainMenu);
