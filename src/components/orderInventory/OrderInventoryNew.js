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
import TextBox from "devextreme-react/text-box";
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";

import Wait from "../common/Wait";

import { Gfn_BuildValueComboMulti } from "../../utiliy/GlobalMethods";

import SaveIcon from '../../assets/images/icon/save.png'

class OrderInventoryNew extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cmbLocation:null,
            cmbLocationValue:null,
            cmbItemGroupValue:null,
            cmbItemValue:null,
            cmbSupplierValue:null,
            txtOrderNumberValue:null,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        }
    }

    cmbRetailStoreGroup_onChange = async (e) => {     
        const TEMP_LocationGroup = this.props.Location.locationPermission;
        let tempLocation = [];        
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
            if (e == TEMP_LocationGroup[j].id)
              tempLocation.push(TEMP_LocationGroup[j]);
        this.setState({
          cmbLocation: tempLocation,
          cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
        });
    };

    cmbRetailStore_onChange=(e)=>{
        this.setState({cmbLocationGroupValue:e})
    }

    cmbItemGroup_onChange=(e)=>{
        document.getElementById("errRetailStore").innerHTML = "";        
        if (this.state.cmbLocationValue == null || this.state.cmbLocationValue =="")
            document.getElementById("errRetailStore").innerHTML = "فروشگاه را انتخاب نمائید.";        
    }

    txtOrderNumber_onChanege=(e)=>{
        this.setState({txtOrderNumberValue:e.value})
    }

    render(){
        return(
            <div style={{ direction: "rtl" }}>         
                <Row>
                    <Col>
                        <Label className="standardLabelFont">گروه فروشگاه</Label>                            
                        <SelectBox 
                            dataSource={this.props.Location.locationPermission}
                            displayExpr="label"    
                            placeholder="گروه فروشگاه"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbRetailStoreGroup_onChange}
                        />
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">فروشگاه</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbLocation}
                            displayExpr="label"    
                            placeholder="فروشگاه"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbRetailStore_onChange}
                        />
                        <Label id="errRetailStore" className="standardLabelFont errMessage" />
                    </Col>
                </Row>      
                <Row>
                    <Col>
                        <Label className="standardLabelFont">گروه کالا</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbLocation}
                            displayExpr="label"    
                            placeholder="گروه کالا"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbItemGroup_onChange}
                        />
                        <Label id="errItemGroup" className="standardLabelFont errMessage" />
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">کالا</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbLocation}
                            displayExpr="label"    
                            placeholder="کالا"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbItem_onChange}
                        />
                        <Label id="errItem" className="standardLabelFont errMessage" />
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">تامین کننده</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbLocation}
                            displayExpr="label"    
                            placeholder="تامین کننده"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbSupplier_onChange}
                        />
                        <Label id="errSupplier" className="standardLabelFont errMessage" />
                    </Col>
                </Row>
                <Row>                
                    <Col xs="auto"> 
                        <Label className="standardLabelFont">تعداد</Label>
                        <TextBox
                            value={this.state.txtOrderNumberValue}
                            showClearButton={true}
                            placeholder="تعداد"
                            rtlEnabled={true}
                            valueChangeEvent="keyup"
                            onValueChanged={this.txtOrderNumber_onChanege}
                        />  
                    </Col>
                    <Label id="errOrderNumber" className="standardLabelFont errMessage" />
                </Row>
                <Row className="standardSpaceTop">                
                  <Col xs="auto">
                    <Button
                      icon={SaveIcon}
                      text="ثبت"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnAdd_onClick}
                    />
                  </Col>                
              </Row>                      
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    User: state.users,
    Location: state.locations,
    Supplier: state.suppliers,
    Item: state.items,
    Company: state.companies,    
  });
  
export default connect(mapStateToProps)(OrderInventoryNew);
