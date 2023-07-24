import React from 'react';
import { connect } from "react-redux";
import "devextreme/dist/css/dx.light.css";
import TreeList, {
    Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, Lookup,
  } from 'devextreme-react/tree-list';
import Drawer from 'devextreme-react/drawer';
import {    
    Row,
    Col,   
    Input, 
} from 'reactstrap';
import List from 'devextreme-react/list.js';
import NavigationList from './NavigationList.js';
import MainMenu from './MainMenu.js'

import { ticketActions } from '../../redux/reducers/ticket/ticket-slice.js';
import { paymentActions } from '../../redux/reducers/payment/payment-slice.js';

class MainMenuList extends React.Component {
    constructor(props) {
        super(props);     
        this.state={
            testValue:null,
        }    
    }
    
    MainMenu_onClick=(e)=>{
        alert(JSON.stringify(e.data))
    }

    mnuItem_onClick=(e)=>{
        const { itemData, itemElement, itemIndex } = e;        
        if(itemData.name=="mnuCartable"){            
            this.props.dispatch(ticketActions.enableNewTicket());  
            this.props.dispatch(paymentActions.disableConfirmPayment()); 
            this.props.dispatch(paymentActions.disableRequestPayment());     
        }
        else if(itemData.name=="mnuHome"){            
            window.location ="http://coapp:8181/";     
        }
        else if(itemData.name=="mnuRecieveTickets"){            
            this.props.dispatch(ticketActions.disableNewTicket());  
        }
        else if(itemData.name=="mnuExit"){              
            this.props.dispatch(ticketActions.enableNewTicket());     
        }
        else if(itemData.name=="mnuRequestPayment"){
            this.props.dispatch(paymentActions.enableRequestPayment());
            this.props.dispatch(paymentActions.disableConfirmPayment());
            this.props.dispatch(ticketActions.disableNewTicket());
        }
        else if(itemData.name=="mnuConfirmPayment"){
            this.props.dispatch(paymentActions.enableConfirmPayment());
            this.props.dispatch(paymentActions.disableRequestPayment());
            this.props.dispatch(ticketActions.disableNewTicket());
        }
    }

    render() {      
        let counter=this.props.counter;        

        const navigation = [
            { id: 4, text: 'صفحه اصلی',name:'mnuHome', icon: 'home' },
            { id: 2, text: 'کارتابل',name:'mnuCartable', icon: 'product' },
            { id: 5, text: 'درخواست پرداخت',name:'mnuRequestPayment', icon: 'product' },            
            { id: 6, text: 'خروج',name:'mnuExit', icon: 'product' },
          ];

        return (
            <div className="list" style={{ width: '250px' }}>                                                
                <List                
                    dataSource={navigation}
                    hoverStateEnabled={false}
                    activeStateEnabled={false}
                    focusStateEnabled={false}
                    className="panel-list dx-theme-accent-as-background-color" 
                    onItemClick={this.mnuItem_onClick}
                />


            {/* <TreeList
                dataSource={tasks}
                showBorders={true}
                columnAutoWidth={true}                
                keyExpr="Task_ID"
                parentIdExpr="Task_Parent_ID"
                // id="tasks"
                rtlEnabled={true}
                onRowClick={this.MainMenu_onClick}
            >
                <SearchPanel visible={true} />
                <HeaderFilter visible={true} />                

                <Column dataField="Task_Subject" caption="منو اصلی" />                                       
            </TreeList> */}
                
                
          </div>
        );
    }
}

const mapStateToProps=(state)=>({      
    stateTicket:state.ticket.stateOfNewTicket ,
});


export default connect(mapStateToProps)(MainMenuList);
