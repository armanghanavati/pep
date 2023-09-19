import React from "react";
import { connect } from "react-redux";
import '../../assets/CSS/style.css'
import {
  Row,
  Col,
  Card,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

class OrderInventoryLogs extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }

    renderTableLogsModalHeader() {
        let head = {
            fullName: 'کاربر ویرایش کننده',
            firstValue: 'مقدار اولیه',
            secondValue: 'مقدار ویرایش شده',
            description: 'توضیحات',
            persianDate: 'تاریخ و ساعت ویرایش',
        }
        let header = Object.values(head);
        return header.map((key, index) => {
            return <th className='thPublic' key={index}>{key.toUpperCase()}</th>
        })
    }

    renderTableLogsModalData() {
        let LOGS=this.props.LogsOrderPointInventory.LogsOfOPI;
        if(LOGS==null)
            LOGS=[]
        return LOGS.map((LogsTable, index) => {
            const { fullName, firstValue, secondValue, persianDate, description } = LogsTable //destructuring
            return (
                <tr className='trPublic'>
                    <td className='tdPublic'>{fullName}</td>
                    <td className='tdPublic'>{firstValue}</td>
                    <td className='tdPublic' >{secondValue}</td>
                    <td className='tdPublic' >{description}</td>
                    <td className='tdPublic'>{persianDate}</td>
                </tr>
            )
        })
    }

    render(){
        return(
            <div style={{ textAlign: 'center',alignItems:'center', direction: 'rtl' }}>                
                <table className='tablePublic'>
                    <thead>
                        <tr className='trPublic'>{this.renderTableLogsModalHeader()}</tr>
                    </thead>
                    <tbody>
                        {this.renderTableLogsModalData()}
                    </tbody>
                </table>                
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    User: state.users,            
    Company: state.companies,    
    LogsOrderPointInventory: state.logsOrderPointInventories,
  });
  
  export default connect(mapStateToProps)(OrderInventoryLogs);