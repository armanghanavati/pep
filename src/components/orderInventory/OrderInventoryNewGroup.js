import React from "react";
import { connect } from "react-redux";
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
import SelectBox from "devextreme-react/select-box";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";

import Wait from "../common/Wait";

class OrderInventoryNewGroup extends React.Component{
    constructor(props){
        super(props);
        this.state={
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        }
    }
    render(){
        return(
            <div className="standardMargin" style={{ direction: "rtl" }}>

            </div>
        )
    }
}

export default OrderInventoryNewGroup;