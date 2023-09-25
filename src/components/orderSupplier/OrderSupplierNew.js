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

import { itemGroupListCombo } from "../../redux/reducers/itemGroup/itemGroup-actions";
import { itemListComboByItemGroupId } from "../../redux/reducers/item/item-action";
import { supplierListComboByItemId } from "../../redux/reducers/supplier/supplier-action";
import { insertNewDataOrderPointSupplier } from "../../redux/reducers/orderPointSupplier/orderPointSupplier-actions";
import { locationListOrderSupplierComboNew
,locationListOrderSupplierComboNewOutRoute } from "../../redux/reducers/location/location-actions";
import Wait from "../common/Wait";

import { Gfn_BuildValueComboMulti } from "../../utiliy/GlobalMethods";

import SaveIcon from '../../assets/images/icon/save.png'

class OrderSupplierNew extends React.Component{
    constructor(props){
        super(props);
        this.state={
            cmbLocationGroups:null,
            cmbLocation:null,
            cmbLocationValue:null,
            cmbItemGroup:null,
            cmbItemGroupValue:null,
            cmbItems:null,
            cmbItemValue:null,
            cmbSuppliers:null,
            cmbSupplierValue:null,
            txtOrderNumberValue:null,
            txtGiftNumberValue:null,
            lblQtyPerPack:null,
            lblRetailStoreMojoodi:null,
            lblSetadMojoodi:null,
            ToastProps: {
                isToastVisible: false,
                Message: "",
                Type: "",
            },
        }
    }

    componentDidMount(){
        this.fn_CheckRequireState();
    }
    
    fn_CheckRequireState = async () => {            
        this.setState({      
            cmbLocationGroups:
                    this.props.isOutRoute ? 
                        await locationListOrderSupplierComboNewOutRoute(this.props.Company.currentCompanyId,this.props.User.token)
                    :
                        await locationListOrderSupplierComboNew(this.props.Company.currentCompanyId,this.props.User.token)
        });
    };

    cmbLocationGroup_onChange = async (e) => {     
        const TEMP_LocationGroup = this.state.cmbLocationGroups;
        let tempLocation = [];        
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
            if (e == TEMP_LocationGroup[j].id)
              tempLocation.push(TEMP_LocationGroup[j]);
        this.setState({
          cmbLocation: tempLocation,
          cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
        });
    };

    cmbLocation_onChange=async (e)=>{
        this.setState({
            cmbLocationValue:e,
            cmbItemGroupValue:null,
            cmbItemValue:null,
            txtOrderNumberValue:null,
            cmbSupplierValue:null,
            cmbItemGroup:await itemGroupListCombo(this.props.User.token)
        })        
    }

    cmbItemGroup_onChange=async(e)=>{
        document.getElementById("errLocation").innerHTML = "";        
        if (this.state.cmbLocationValue == null || this.state.cmbLocationValue =="")
            document.getElementById("errLocation").innerHTML = "فروشگاه را انتخاب نمائید.";                            
    
        else{
            const OBJ={
                ItemGroupId:e,                
                LocationId:this.state.cmbLocationValue
            }
            this.setState({
                cmbItemGroupValue:e,
                cmbItems:await itemListComboByItemGroupId(OBJ,this.props.User.token)
            });
        }
    }

    txtOrderNumber_onChanege=(e)=>{
        this.setState({txtOrderNumberValue:e.value})
    }

    txtGiftNumber_onChanege=(e)=>{
        this.setState({txtGiftNumberValue:e.value})
    }

    cmbItem_onChange=async(e)=>{
        const data={
            ItemId:e
        }
        const tempItems=this.state.cmbItems;
        for(let i=0;i<tempItems.length;i++)
            if(tempItems[i].id==e)
                this.setState({
                    lblQtyPerPack:tempItems[i].qtyPerPack,
                    lblRetailStoreMojoodi:tempItems[i].mojoodi,
                    lblSetadMojoodi:tempItems[i].mojoodiSetad
                })
        this.setState({
            cmbItemValue:e,
            cmbSuppliers:await supplierListComboByItemId(data,this.props.User.token)
        })
    }
    cmbSupplier_onChange=async(e)=>{
        this.setState({
            cmbSupplierValue:e
        });
    }

    fn_CheckFinalValidation=()=>{        
        let flagSend = true;
        document.getElementById("errLocation").innerHTML = ""; 
        document.getElementById("errItem").innerHTML = ""; 
        document.getElementById("errSupplier").innerHTML = ""; 
        document.getElementById("errOrderNumber").innerHTML = ""; 
        if (this.state.cmbLocationValue === null  || this.state.cmbLocationValue == "") {
            const msg= "فروشگاه را انتخاب نمائید.";
            document.getElementById("errLocation").innerHTML = msg; 
            flagSend = false;
        }
        if (this.state.cmbItemValue == null  || this.state.cmbItemValue == "") {
            const msg= "کالا را انتخاب نمائید.";
            document.getElementById("errItem").innerHTML = msg; 
            flagSend = false;
        }
        if (this.state.cmbSupplierValue == null || this.state.cmbSupplierValue == "") {
            const msg= "تامین کننده را انتخاب نمائید."
            document.getElementById("errSupplier").innerHTML = msg; 
            flagSend = false;
        }
        if (this.state.txtOrderNumberValue == null || this.state.cmbSupplierValue == "") {
            const msg= "تعداد سفارش را وارد نمائید." 
            document.getElementById("errOrderNumber").innerHTML = msg; 
            flagSend = false;
        }

        let errMSG = '';        
        if (this.state.txtOrderNumberValue > this.state.lblSetadMojoodi) {
            errMSG += "تعداد سفارش از موجودی ستاد بیشتر است." + "<br>";
            flagSend = false;
        }
        if(this.state.txtOrderNumberValue%this.state.lblQtyPerPack!==0 || this.state.txtOrderNumberValue<=0){
            errMSG+='تعداد سفارش باید ضریبی از واحد بسته بندی باشد.'
            flagSend=false;
        }     
        document.getElementById("InserNewOrderValidation").innerHTML = errMSG; 
        return flagSend;
    }

    btnSaveOrder_onClick=async()=>{
        const flag_insert=await this.fn_CheckFinalValidation();
        if(flag_insert){
            let data = {
                locationId: this.state.cmbLocationValue,
                supplierId: this.state.cmbSupplierValue,
                productId: this.state.cmbItemValue,
                numberOrder: this.state.txtOrderNumberValue,
                giftQTYOrder:this.state.txtGiftNumberValue,
                userId: this.props.User.userId
            }
            alert(JSON.stringify(await insertNewDataOrderPointSupplier(data,this.props.User.userId)))
        }        
    }

    render(){
        return(
            <div style={{ direction: "rtl" }}>         
                <Row>
                    <Col>
                        <Label className="standardLabelFont">گروه فروشگاه</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbLocationGroups}
                            displayExpr="label"    
                            placeholder="گروه فروشگاه"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbLocationGroup_onChange}
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
                            value={this.state.cmbLocationValue}                                   
                            onValueChange={this.cmbLocation_onChange}
                        />
                        <Label id="errLocation" className="standardLabelFont errMessage" />
                    </Col>
                </Row>      
                <Row>
                    <Col>
                        <Label className="standardLabelFont">گروه کالا</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbItemGroup}
                            displayExpr="label"    
                            placeholder="گروه کالا"
                            value={this.state.cmbItemGroupValue}
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbItemGroup_onChange}
                        />                        
                    </Col>
                    <Col>
                        <Label className="standardLabelFont">کالا</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbItems}
                            displayExpr="label"    
                            placeholder="کالا"
                            valueExpr="id"
                            value={this.state.cmbItemValue}
                            searchEnabled={true}
                            rtlEnabled={true}                                        
                            onValueChange={this.cmbItem_onChange}
                        />
                        <Label id="errItem" className="standardLabelFont errMessage" />
                    </Col>                    
                </Row>
                <Row>
                    <Col>
                        <Label className="standardLabelFont">تعداد در کارتن: {this.state.lblQtyPerPack}</Label>      
                    </Col>                    
                    <Col>
                        <Label className="standardLabelFont">موجودی فروشگاه: {this.state.lblRetailStoreMojoodi}</Label>      
                    </Col>                    
                    <Col>
                        <Label className="standardLabelFont">موجودی ستاد: {this.state.lblSetadMojoodi}</Label>      
                    </Col>                    
                </Row>
                <Row className="standardSpaceTop">     
                    <Col xs="auto">
                        <Label className="standardLabelFont">تامین کننده</Label>                            
                        <SelectBox 
                            dataSource={this.state.cmbSuppliers}
                            displayExpr="label"    
                            placeholder="تامین کننده"
                            valueExpr="id"
                            searchEnabled={true}
                            rtlEnabled={true}                  
                            value={this.state.cmbSupplierValue}                      
                            onValueChange={this.cmbSupplier_onChange}
                        />
                        <Label id="errSupplier" className="standardLabelFont errMessage" />
                    </Col>           
                    <Col xs="auto"> 
                        <Label className="standardLabelFont">تعداد</Label>
                        <TextBox
                            value={this.state.txtOrderNumberValue}
                            showClearButton={true}
                            placeholder="تعداد سفارش"
                            rtlEnabled={true}
                            valueChangeEvent="keyup"
                            onValueChanged={this.txtOrderNumber_onChanege}
                        />  
                        <Label id="errOrderNumber" className="standardLabelFont errMessage" />
                    </Col> 
                    <Col xs="auto"> 
                        <Label className="standardLabelFont">تعداد جایزه</Label>
                        <TextBox
                            value={this.state.txtGiftNumberValue}
                            showClearButton={true}
                            placeholder="تعداد جایزه"
                            rtlEnabled={true}
                            valueChangeEvent="keyup"
                            onValueChanged={this.txtGiftNumber_onChanege}
                        />  
                        {/* <Label id="errOrderNumber" className="standardLabelFont errMessage" /> */}
                    </Col>                    
                </Row>
                
                <Row className="standardSpaceTop">                
                  <Col xs="auto">
                    <Button
                      icon={SaveIcon}
                      text="ثبت"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnSaveOrder_onClick}
                    />
                  </Col>                
                  <Col xs="auto">
                    <Label id="InserNewOrderValidation" className="standardLabelFont errMessage" />
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
    ItemGroup:state.itemGroups,
    Company: state.companies,    
  });
  
export default connect(mapStateToProps)(OrderSupplierNew);
