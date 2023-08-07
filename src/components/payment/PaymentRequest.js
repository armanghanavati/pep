import React from "react";
import {
  Input,
  Container,
  Row,
  Col,
  Card,
  CardDeck,
  CardImg,
  CardBody,
  CardTitle,
  Label,
  TabContent, TabPane, Nav, NavItem, NavLink,  
  Modal, ModalHeader, ModalBody, ModalFooter 
} from "reactstrap";
import classnames from 'classnames';
import Button from "@mui/material/Button";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  Scrolling,
  FilterRow,
  HeaderFilter,
  FilterPanel,
  FilterBuilderPopup,
  Pager,
  Selection,
  Grouping,
  GroupPanel,
  SearchPanel,
} from "devextreme-react/data-grid";
import { Toast } from 'devextreme-react/toast';
import { connect } from "react-redux";
import {
  allSEPPaymentList,
  sEPPaymentList,
  addSEPPayment,
  updateSEPPayment,
  ConfirmSEPPaymentAndSendlink,
} from "../../redux/reducers/payment/payment-action";
import { checkPermission } from "../../redux/reducers/user/user-actions";
import Wait from "../common/Wait";
import { Gfn_NumberDetect,Gfn_convertENunicode,Gfn_ConvertToPersian } from "../../utiliy/GlobalMethods";
import { DataGridPaymentcolumns } from "./Payment-Config";
import { DataGridPageSizes,DataGridDefaultPageSize
  ,DataGridDefaultHeight 
  ,ToastTime
  ,ToastWidth
} from '../../config/config';

class PaymentRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PaymenterName: null,
      PaymenterMobile: null,
      FactorSerial: null,
      FactorAmount: null,      
      SEPPayment: null,
      SEPPaymendGridData:null,
      stateWait: false,
      stateUpdateDelete: true,
      RowSelected: null,
      SEPPaymentId: null,
      stateDisable_btnConfirmPaymentRequest:false,
      stateDisable_btnUpdatePaymentRequest:false,
      stateDisable_btnAddSEPPayment:false,
      stateDisable_showSEPPayment:false,
      activeTab:null,
      ToastProps:{
        isToastVisible:false,
        Message:"",
        Type:"",
      },
    };
  }

  async componentDidMount() {
    // await this.fn_GetPermissions();
    // const SEPPAYMENT=await this.fn_UpdateSEPPaymentList();       
    // this.tabPayment_onChange('1',SEPPAYMENT)   
  }

  // fn_GetPermissions=()=>{
  //   const perm=this.props.User.permissions;
  //   let enable_btnPeymentConfirm=false;
  //   if(perm!=null)
  //     for(let i=0;i<perm.length;i++){
  //       switch(perm[i].value){
  //         case 'permission.payment.confirm':this.setState({stateDisable_btnConfirmPaymentRequest:true}); break;
  //       }
  //     }   
  // }

  fn_GetPermissions=()=>{
    const perm=this.props.User.permissions;
    let enable_btnPeymentConfirm=false;
    if(perm!=null)
      for(let i=0;i<perm.length;i++){
        switch(perm[i].objectName){
          case 'payment.confirm':this.setState({stateDisable_btnConfirmPaymentRequest:true});break;
          case 'payment.update' :this.setState({stateDisable_btnUpdatePaymentRequest:true});break;
          case 'payment.insert' :this.setState({stateDisable_btnAddSEPPayment:true});break;
          case 'payment.show' :this.setState({stateDisable_showSEPPayment:true});break;
        }
      }   
  }

  fn_UpdateSEPPaymentList=async()=>{    
    if(this.state.stateDisable_showSEPPayment){
      const SEPPAYMENT=await allSEPPaymentList(1,this.props.User.token)
      this.setState({
        SEPPayment: SEPPAYMENT,
      });
      return SEPPAYMENT;
    }
  }
  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  txtPaymentName_onChange = (params) => {
    this.setState({ PaymenterName: params.target.value });
  };

  txtPaymentMobile_onChange = (params) => {
    // this.setState({ PaymenterMobile: params.target.value });
    const num = params.target.value;    
    const flag=isNaN(num)==false ? false : true;    
    document.getElementById("errPayerMobile").innerHTML = ""; 
    if(flag){
      this.setState({ PaymenterMobile:null});
      document.getElementById("errPayerMobile").innerHTML = "شماره موبایل باید عددی باشد.";
    }
    else
      this.setState({ PaymenterMobile:num});   
  };

  txtFactorSerial_onChange = (params) => {
    this.setState({ FactorSerial: params.target.value });
  };

  txtFactorAmount_onChange = (params) => {    
    const num = params.target.value;    
    const flag=isNaN(num)==false ? false : true;    
    document.getElementById("errPaymentAmount").innerHTML = ""; 
    if(flag){
      this.setState({ FactorAmount:null});
      document.getElementById("errPaymentAmount").innerHTML = "مبلغ باید عددی باشد"; 
    }
    else
      this.setState({ FactorAmount:num});                       
    
  };

  btnAddSEPPayment_onClick = async () => {
    let flag = true;
    let errMSG = "";
    document.getElementById("errPayerName").innerHTML = "";
    document.getElementById("errPayerMobile").innerHTML = "";
    document.getElementById("errPaymentAmount").innerHTML = "";    
    if(this.state.PaymenterName.trim()==''){
      document.getElementById("errPayerName").innerHTML = "نام پرداخت کننده را وارد نمائید."; 
      flag=false;
    }
    if(this.state.PaymenterMobile==null){
      document.getElementById("errPayerMobile").innerHTML = "موبایل پرداخت کننده را وارد نمائید."; 
      flag=false;
    }
    if(this.state.FactorAmount==null){
      document.getElementById("errPaymentAmount").innerHTML = "مبلغ پرداخت را وارد نمائید."; 
      flag=false;
    }  
    if(flag){
      const data = {
        userIdInsert: this.props.User.userId,
        payerName: this.state.PaymenterName,
        payerMobile: this.state.PaymenterMobile,
        documentSerial: this.state.FactorSerial,
        amountPay: this.state.FactorAmount,
      };
      await addSEPPayment(data, this.props.User.token);
      const SEPPAYMENT=await this.fn_UpdateSEPPaymentList();       
      this.tabPayment_onChange('1',SEPPAYMENT)  
      this.setState({        
        ToastProps:{  
            isToastVisible:true,              
            Message:"درخواست پرداخت ثبت گردید.",
            Type:"success",
        }
      })
      this.fn_UpdateSEPPaymentList();
    }
  };

  grdSEPPayment_onClickRow = (params) => {
    console.log(JSON.stringify(params.data));
    this.setState({
      SEPPaymentId: params.data.id,
      PaymenterName: params.data.payerName,
      PaymenterMobile: params.data.payerMobile,
      FactorSerial: params.data.documentSerial,
      FactorAmount: params.data.amountPay,
      stateUpdateDelete: true,
      RowSelected: params.data,
    });
  };

  btnNewSEPPayment_onClick = () => {
    this.setState({
      PaymenterName: "",
      PaymenterMobile: null,
      FactorSerial: "",
      FactorAmount: null,
      stateUpdateDelete: false,
    });
  };

  btnUpdatePaymentRequest_onClick = async () => {
    let tempSelected = this.state.RowSelected;
    let flag = true;
    let errMSG = "";
    document.getElementById("errPayerName").innerHTML = "";
    document.getElementById("errPayerMobile").innerHTML = "";
    document.getElementById("errPaymentAmount").innerHTML = "";    
    if(this.state.PaymenterName.trim()==''){
      document.getElementById("errPayerName").innerHTML = "نام پرداخت کننده را وارد نمائید."; 
      flag=false;
    }
    if(this.state.PaymenterMobile==null){
      document.getElementById("errPayerMobile").innerHTML = "موبایل پرداخت کننده را وارد نمائید."; 
      flag=false;
    }
    if(this.state.FactorAmount==null){
      document.getElementById("errPaymentAmount").innerHTML = "مبلغ پرداخت را وارد نمائید."; 
      flag=false;
    } 

    if (tempSelected.token != null) {
      errMSG +=
        "کاربر گرامی این درخواست در حال انجام می باشد. شما قادر به ویرایش نیستید." +
        "<br>";
      flag = false;
    }
    if (this.state.SEPPaymentId == null) {
      errMSG += "درخواستی برای ویرایش انتخاب نشده است." + "<br>";
      flag = false;
    }
    document.getElementById("ErrorUpdatePaymentRequest").innerHTML = errMSG;
    if (flag) {
      let data = {
        id: this.state.SEPPaymentId,
        payerName: this.state.PaymenterName,
        payerMobile: this.state.PaymenterMobile,
        documentSerial: this.state.FactorSerial,
        amountPay: this.state.FactorAmount.toString(),
      };
      let tempSEPPayment=[];
      tempSEPPayment.push(await updateSEPPayment(data, this.props.User.token));

      const SEPPAYMENT=await this.fn_UpdateSEPPaymentList();       

      this.tabPayment_onChange('1',SEPPAYMENT)  

      this.setState({
        SEPPayment: SEPPAYMENT,
      });
    }
  };

  
  btnConfirmPaymentRequest_onClick = async () => {
    let data = {
        id:this.state.SEPPaymentId,
        userId:this.props.User.userId,
        payerName:this.state.PaymenterName,
        payerMobile:this.state.PaymenterMobile,
        documentSerial:this.state.FactorSerial,
        amountPay:(this.state.FactorAmount).toString()
    }   
    await ConfirmSEPPaymentAndSendlink(data, this.props.User.token);
  }

  tabPayment_onChange=async(tab,allPayment)=> {
    if (this.state.activeTab !== tab) {                        
        this.setState({
          activeTab: tab
        });                 
    }   
    
    await this.fn_UpdateGrids(allPayment,tab)        
  }

  fn_UpdateGrids=async(allPayment,tab) =>{
    const tempAllPayment=allPayment;        
    let tempPayment=[];
    for(let i=0;i<tempAllPayment.length;i++)                            
        // if(tab ==1 && (tempAllPayment[i].sepStatusCode == 1 || tempAllPayment[i].ticketStatusCode == 5))        
            // tempTicket.push(tempAllPayment[i]);
        // else 
        if(tempAllPayment[i].sepStatusCode==tab)
          tempPayment.push(tempAllPayment[i]);           
    this.setState({SEPPaymendGridData:tempPayment})  
  }

  onHidingToast=()=>{
    this.setState({ToastProps:{isToastVisible:false}})
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
        {this.state.stateWait ? (
          <Row className="text-center">
            <Col style={{ textAlign: "center", marginTop: "10px" }}>
              <Wait />
            </Col>
          </Row>
        ) : (
          ""
        )}

        
                <Card className="shadow bg-white border pointer">
                  <Row className="standardPadding">   
                    <Row>                
                      <Label>
                        درخواست پرداخت آنلاین وجه
                      </Label>                
                    </Row>
                    {this.state.stateDisable_btnAddSEPPayment &&
                      <Row>                
                        <Col>
                          <Button
                            variant="contained"
                            sx={{ fontFamily: "Tahoma"}}
                            onClick={this.btnNewSEPPayment_onClick}
                          >
                            جدید
                          </Button>
                        </Col>
                      </Row>}
                      <Row className="standardPadding">
                        <Col>
                          <Label>نام پرداخت کننده</Label>
                          <Input
                            type="text"
                            value={this.state.PaymenterName}
                            onChange={this.txtPaymentName_onChange}
                            placeholder="نام پرداخت کننده"
                          />
                          <Label id="errPayerName" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>              
                          <Label>موبایل پرداخت کننده</Label>
                          <Input
                            type="text"
                            value={this.state.PaymenterMobile}
                            onChange={this.txtPaymentMobile_onChange}
                            placeholder="موبایل پرداخت کننده"
                          />
                          <Label id="errPayerMobile" className="standardLabelFont errMessage" />
                        </Col>
                        <Col>
                          <Label>شماره سند</Label>
                          <Input
                            type="text"
                            value={this.state.FactorSerial}
                            onChange={this.txtFactorSerial_onChange}
                            placeholder="شماره سند"
                          />
                        </Col>
                        <Col>              
                          <Label>مبلغ پرداختی(ریال)</Label>
                          <Input
                            type="text"
                            value={this.state.FactorAmount}
                            onChange={this.txtFactorAmount_onChange}
                            placeholder="مبلغ پرداختی"
                          />
                          <Label id="errPaymentAmount" className="standardLabelFont errMessage" />
                        </Col>
                      </Row>
                      {!this.state.stateUpdateDelete ? (
                          <Row>
                            {this.state.stateDisable_btnAddSEPPayment &&
                              <Col xs="auto">
                                <Button
                                  variant="contained"
                                  sx={{ fontFamily: "Tahoma"}}
                                  onClick={this.btnAddSEPPayment_onClick}
                                >
                                  ثبت درخواست پرداخت
                                </Button>
                              </Col>
                            }
                          </Row>
                        ) : (
                          <>
                            <Row>
                              {this.state.stateDisable_btnUpdatePaymentRequest &&
                                  <Col xs="auto">
                                    <Button
                                      variant="contained"
                                      sx={{ fontFamily: "Tahoma"}}
                                      onClick={this.btnUpdatePaymentRequest_onClick}
                                    >
                                      ذخیره تغییرات
                                    </Button>
                                  </Col>      
                              }                
                              {this.state.stateDisable_btnConfirmPaymentRequest &&
                                  <Col xs="auto">
                                    <Button variant="contained"
                                        sx={{ fontFamily: 'Tahoma'}}
                                        onClick={this.btnConfirmPaymentRequest_onClick}                      
                                    >
                                        تایید برای پرداخت
                                    </Button>
                                  </Col> 
                              }
                            </Row>
                            <Row>
                              <Col>
                                <p
                                  id="ErrorUpdatePaymentRequest"
                                  style={{ textAlign: "right", color: "red" }}
                                ></p>
                              </Col>
                            </Row>
                          </>
                        )}  
                  </Row>   
                </Card>
              
              <p></p>
            
                <Card className="shadow bg-white border pointer">
                  <Row className="standardPadding">
                    <Row>  
                      <Label className="title">
                          لیست درخواست های پرداخت
                      </Label>
                    </Row>

                    <Row>
                      <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.tabPayment_onChange('1',this.state.SEPPayment); }}
                                >
                                ثبت شده ها
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.tabPayment_onChange('2',this.state.SEPPayment); }}
                                >
                                تائید مجوز پرداخت
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => { this.tabPayment_onChange('3',this.state.SEPPayment); }}
                                >
                                  ارسال لینک پرداخت
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '4' })}
                                onClick={() => { this.tabPayment_onChange('4',this.state.SEPPayment); }}
                                >
                                  پرداخت شده و منتظر تائید بانک
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '9' })}
                                onClick={() => { this.tabPayment_onChange('9',this.state.SEPPayment); }}
                                >
                                  تائید نهایی پرداخت
                            </NavLink>
                        </NavItem>                  
                      </Nav>
                      <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                          <Row className="standardPadding">                    
                            <DataGrid
                                dataSource={this.state.SEPPaymendGridData}
                                defaultColumns={DataGridPaymentcolumns}
                                showBorders={true}
                                rtlEnabled={true}
                                allowColumnResizing={true}
                                onRowClick={this.grdSEPPayment_onClickRow}                                            
                                height={DataGridDefaultHeight}
                            >
                                <Scrolling rowRenderingMode="virtual"
                                    showScrollbar="always"
                                    columnRenderingMode="virtual"
                                />
                                
                                <Paging defaultPageSize={DataGridDefaultPageSize} />
                                <Pager
                                    visible={true}
                                    allowedPageSizes={DataGridPageSizes}
                                    showPageSizeSelector={true}
                                    showNavigationButtons={true} 
                                />
                                <FilterRow visible={true} />
                                <FilterPanel visible={true} />                                                                            
                            </DataGrid>                                                         
                          </Row>
                        </TabPane>
                        <TabPane tabId="2">
                          <Row className="standardPadding">                    
                            <DataGrid
                                dataSource={this.state.SEPPaymendGridData}
                                defaultColumns={DataGridPaymentcolumns}
                                showBorders={true}
                                rtlEnabled={true}
                                allowColumnResizing={true}
                                onRowClick={this.grdSEPPayment_onClickRow}                                            
                                height={DataGridDefaultHeight}
                            >
                                <Scrolling rowRenderingMode="virtual"
                                    showScrollbar="always"
                                    columnRenderingMode="virtual"
                                />
                                
                                <Paging defaultPageSize={DataGridDefaultPageSize} />
                                <Pager
                                    visible={true}
                                    allowedPageSizes={DataGridPageSizes}
                                    showPageSizeSelector={true}
                                    showNavigationButtons={true} 
                                />
                                <FilterRow visible={true} />
                                <FilterPanel visible={true} />                                                                            
                            </DataGrid>                                                         
                          </Row>
                        </TabPane>
                        <TabPane tabId="3">
                          <Row className="standardPadding">                    
                            <DataGrid
                                dataSource={this.state.SEPPaymendGridData}
                                defaultColumns={DataGridPaymentcolumns}
                                showBorders={true}
                                rtlEnabled={true}
                                allowColumnResizing={true}
                                onRowClick={this.grdSEPPayment_onClickRow}                                            
                                height={DataGridDefaultHeight}
                            >
                                <Scrolling rowRenderingMode="virtual"
                                    showScrollbar="always"
                                    columnRenderingMode="virtual"
                                />
                                
                                <Paging defaultPageSize={DataGridDefaultPageSize} />
                                <Pager
                                    visible={true}
                                    allowedPageSizes={DataGridPageSizes}
                                    showPageSizeSelector={true}
                                    showNavigationButtons={true} 
                                />
                                <FilterRow visible={true} />
                                <FilterPanel visible={true} />                                                                            
                            </DataGrid>                                                         
                          </Row>
                        </TabPane>
                        <TabPane tabId="4">
                          <Row className="standardPadding">                    
                            <DataGrid
                                dataSource={this.state.SEPPaymendGridData}
                                defaultColumns={DataGridPaymentcolumns}
                                showBorders={true}
                                rtlEnabled={true}
                                allowColumnResizing={true}
                                onRowClick={this.grdSEPPayment_onClickRow}                                            
                                height={DataGridDefaultHeight}
                            >
                                <Scrolling rowRenderingMode="virtual"
                                    showScrollbar="always"
                                    columnRenderingMode="virtual"
                                />
                                
                                <Paging defaultPageSize={DataGridDefaultPageSize} />
                                <Pager
                                    visible={true}
                                    allowedPageSizes={DataGridPageSizes}
                                    showPageSizeSelector={true}
                                    showNavigationButtons={true} 
                                />
                                <FilterRow visible={true} />
                                <FilterPanel visible={true} />                                                                            
                            </DataGrid>                                                         
                          </Row>
                        </TabPane>
                        <TabPane tabId="9">
                          <Row className="standardPadding">                    
                            <DataGrid
                                dataSource={this.state.SEPPaymendGridData}
                                defaultColumns={DataGridPaymentcolumns}
                                showBorders={true}
                                rtlEnabled={true}
                                allowColumnResizing={true}
                                onRowClick={this.grdSEPPayment_onClickRow}                                            
                                height={DataGridDefaultHeight}
                            >
                                <Scrolling rowRenderingMode="virtual"
                                    showScrollbar="always"
                                    columnRenderingMode="virtual"
                                />
                                
                                <Paging defaultPageSize={DataGridDefaultPageSize} />
                                <Pager
                                    visible={true}
                                    allowedPageSizes={DataGridPageSizes}
                                    showPageSizeSelector={true}
                                    showNavigationButtons={true} 
                                />
                                <FilterRow visible={true} />
                                <FilterPanel visible={true} />                                                                            
                            </DataGrid>                                                         
                          </Row>
                        </TabPane>                  
                      </TabContent>
                    </Row>
                  </Row>
                </Card>          
          
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
});

export default connect(mapStateToProps)(PaymentRequest);
