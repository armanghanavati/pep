import React, { Suspense } from "react";
import { connect } from "react-redux";
import DataSource from "devextreme/data/data_source";
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
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import { Button } from "devextreme-react/button";
import { Toast } from 'devextreme-react/toast';
import Wait from "../common/Wait";

import { addOpinion } from "../../redux/reducers/opinion/opinion-actions";
import {
    DataGridPageSizes, DataGridDefaultPageSize
    , DataGridDefaultHeight
    , ToastTime
    , ToastWidth
} from '../../config/config';
import SaveIcon from "../../assets/images/icon/save.png";

const notesLabel = { 'aria-label': 'Notes' };

class Opinion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        txtOpinionValue:null,        
      stateWait: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  txtOpinion_onChange=(e)=>{
    this.setState({txtOpinionValue:e.value})
  }

  btnAdd_onClick=async()=>{
    this.OpenCloseWait();
    const OBJ={
        opinionSubjectId:1,
        desc:this.state.txtOpinionValue,      
        userId:null  
    }
    const RTN_MSG=await addOpinion(OBJ,this.props.User.token);
    this.setState({        
        ToastProps: {
            isToastVisible: true,
            Message: RTN_MSG,
            Type: "success",
        }
    })
    this.OpenCloseWait();
  }

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } })
}

  render() {
    return (
      <div className="standardMargin" style={{ direction: "rtl" }}>
        <Toast
          visible={this.state.ToastProps.isToastVisible}
          message={this.state.ToastProps.Message}
          type={this.state.ToastProps.Type}
          onHiding={this.onHidingToast}
          displayTime={ToastTime}
          width={ToastWidth}
          rtlEnabled={true}
        />
        {this.state.stateWait && (
          <Row className="text-center">
            <Col style={{ textAlign: "center", marginTop: "10px" }}>
              <Wait />
            </Col>
          </Row>
        )}
        
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Col>
              <Label className="standardLabelFont">نظرات</Label>
              <TextArea
                height={400}
                width={800}
                defaultValue={this.state.txtOpinionValue}
                inputAttr={notesLabel}
                autoResizeEnabled={true}
                onValueChanged={this.txtOpinion_onChange}
              />
            </Col>
          </Row>
          <Row className="standardPadding">
            <Col xs="auto">
              <Button
                icon={SaveIcon}
                text="ثبت نظر"
                type="success"
                stylingMode="contained"
                rtlEnabled={true}
                onClick={this.btnAdd_onClick}
              />
            </Col>
          </Row>        
          </Card>        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Company: state.companies
});

export default connect(mapStateToProps)(Opinion);
