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
  Modal,
} from "reactstrap";
import Button from '@mui/material/Button';
import {sEPPaymentList, addSEPPayment, updateSEPPayment, ConfirmSEPPaymentAndSendlink} from '../../redux/reducers/payment/payment-action'
import DataGrid, {
    Column, Editing, Paging, Lookup, Scrolling,
    FilterRow,
    HeaderFilter,
    FilterPanel,
    FilterBuilderPopup,
    Pager,
    Selection,
    Grouping,
    GroupPanel,
    SearchPanel,
} from 'devextreme-react/data-grid';
import { connect } from "react-redux";
import Wait from '../common/Wait';

const filterBuilderPopupPosition = {
    of: window,
    at: 'top',
    my: 'top',
    offset: { y: 10 },
};

class PaymentRequestConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PaymenterName: null,
      PaymenterMobile:null,
      FactorSerial:null,
      FactorAmount:null,  
      SEPPayment:null,
      stateWait:false,   
      stateUpdateDelete:true,
      RowSelected:null,
      SEPPaymentId:null,
      stateDisableConfirm_btn:true,            
    };
  }

  async componentDidMount(){
    this.setState({
        SEPPayment:await sEPPaymentList(1, "werw")
    })
  }

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait })
  }

  PaymentNameHandleChange=(params) =>{
    this.setState({PaymenterName:params.target.value,stateDisableConfirm_btn:true})
  }

  PaymentMobileHandleChange=(params) =>{
    this.setState({PaymenterMobile:params.target.value,stateDisableConfirm_btn:true})
  }

  FactorSerialHandleChange=(params) =>{
    this.setState({FactorSerial:params.target.value,stateDisableConfirm_btn:true})
  }

  FactorAmountHandleChange=(params) =>{
    this.setState({FactorAmount:params.target.value,stateDisableConfirm_btn:true})
  }

  onRowUpdating_SEPPaymentGrd=(params)=>{
    // alert(JSON.stringify(params.oldData))
    
  }


  onClickCell_dxSEPPayment=(params)=>{
    console.log(JSON.stringify(params.data));
    this.setState({
      SEPPaymentId:params.data.id,      
      PaymenterName:params.data.payerName,
      PaymenterMobile:params.data.payerMobile,
      FactorSerial:params.data.documentSerial,
      FactorAmount:params.data.amountPay,
      stateUpdateDelete:true,
      RowSelected:params.data
    })
  }  
 
  onClick_UpdatePaymentRequest= async ()=>{
    let tempSelected=this.state.RowSelected
    let flag=true;
    let errMSG='';
    if(tempSelected.token!=null){
      errMSG += "کاربر گرامی این درخواست در حال انجام می باشد. شما قادر به ویرایش نیستید." + "<br>"
      flag=false;
    }
    if(this.state.SEPPaymentId==null){
      errMSG+="درخواستی برای ویرایش انتخاب نشده است."+"<br>";
      flag=false;      
    }    
    document.getElementById("ErrorUpdatePaymentRequest").innerHTML = errMSG;
    if(flag){
    let data = {
        id:this.state.SEPPaymentId,
        payerName:this.state.PaymenterName,
        payerMobile:this.state.PaymenterMobile,
        documentSerial:this.state.FactorSerial,
        amountPay:(this.state.FactorAmount).toString()
      }  

      this.setState({
        SEPPayment : await updateSEPPayment(data, "tesr")
      })
    }
  }



  onClick_ConfirmPaymentRequest = async () => {
    let data = {
        id:this.state.SEPPaymentId,
        userId:this.props.User.userId,
        payerName:this.state.PaymenterName,
        payerMobile:this.state.PaymenterMobile,
        documentSerial:this.state.FactorSerial,
        amountPay:(this.state.FactorAmount).toString()
    }   
    await ConfirmSEPPaymentAndSendlink(data, "ewrwe");
  }

  render() {
    return (
    <div style={{ direction: 'rtl' }}>
        {this.state.stateWait ?
          <Row className="text-center">
              <Col style={{ textAlign: 'center', marginTop: '10px' }}>
                  <Wait />
              </Col>
          </Row>
          : ''}
        <Card className="shadow bg-white border pointer">
          <p style={{ padding: "10px" }} className="title">
            درخواست پرداخت آنلاین وجه
          </p>
          
          <Row style={{ paddingRight: "10px" }}>
            <Col>
              <Label>نام پرداخت کننده</Label>
              <Input
                type="text"
                value={this.state.PaymenterName}
                onChange={this.PaymentNameHandleChange}
                placeholder="نام پرداخت کننده"
              />
            </Col>
            <Col>
                <Label>موبایل پرداخت کننده</Label>
                <Input
                    type="text"
                    value={this.state.PaymenterMobile}
                    onChange={this.PaymentMobileHandleChange}
                    placeholder="موبایل پرداخت کننده"
                />
            </Col>
            <Col>
                <Label>شماره فاکتور</Label>
                <Input
                    type="text"
                    value={this.state.FactorSerial}
                    onChange={this.FactorSerialHandleChange}
                    placeholder="شماره فاکتور"
                />            
            </Col>
            <Col>
                <Label>مبلغ پرداختی(ریال)</Label>
                <Input
                    type="text"
                    value={this.state.FactorAmount}
                    onChange={this.FactorAmountHandleChange}
                    placeholder="مبلغ پرداختی"
                />            
            </Col>
          </Row>
          <Row style={{ padding: '10px', direction: 'rtl' }}>
              <Col xs="auto">
                  <Button variant="contained"
                      sx={{ fontFamily: 'Tahoma', marginTop: '10px' }}
                      onClick={this.onClick_UpdatePaymentRequest}
                  >
                      ذخیره تغییرات
                  </Button>
              </Col>               
              {/* <Col xs="auto">
                  <Button variant="contained"
                      sx={{ fontFamily: 'Tahoma', marginTop: '10px' }}
                      onClick={this.onClick_DeletePaymentRequest}
                  >
                      حذف
                  </Button>
              </Col>                         */}
              <Col xs="auto">
                  <Button variant="contained"
                      sx={{ fontFamily: 'Tahoma', marginTop: '10px' }}
                      onClick={this.onClick_ConfirmPaymentRequest}
                      disabled={this.state.stateDisableConfirm_btn}
                  >
                      تایید برای پرداخت
                  </Button>
              </Col> 
          </Row>
          <Row style={{ padding: '10px' }}>
              <Col>
                  <p
                      id="ErrorUpdatePaymentRequest"
                      style={{ textAlign: "right", color: "red" }}
                  ></p>
              </Col>
          </Row>
        
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
            <p style={{ padding: "10px" }} className="title">
                درخواست های در انتظار تائید
            </p>
            <Row style={{ padding: '10px' }}>
                <DataGrid
                    id="gridSEPPayment"
                    dataSource={this.state.SEPPayment}
                    keyExpr="id"
                    allowColumnReordering={true}                            
                    showBorders={true}
                    onRowUpdating={this.onRowUpdating_SEPPaymentGrd}
                    onCellClick={this.onClickCell_dxSEPPayment}
                    // onCellDblClick={this.onCellDblClick_OrderPointInventory}
                    // onRowPrepared={this.onRowPrepared_OrderPointInventory}
                    // onSelectionChanged={this.onSelectionChanged}
                    rtlEnabled={true}
                    allowColumnResizing={true}                            
                    columnAutoWidth={true}
                    columnResizingMode="widget"
                    height={500}
                >
                    <Scrolling rowRenderingMode="virtual"
                        showScrollbar="always"
                        columnRenderingMode="virtual"
                    />                                                        
                    <Editing
                        mode="cell"
                        allowUpdating={true}
                    />                            
                    <FilterRow visible={true} />
                    <FilterPanel visible={true} />
                    <FilterBuilderPopup position={filterBuilderPopupPosition} />
                    <HeaderFilter visible={true} />                            
                    <Column dataField="payerName" allowEditing={false} caption={'نام پرداخت کننده'} />
                    <Column dataField="payerMobile" allowEditing={false} caption={'موبایل پرداخت کننده'} />
                    <Column dataField="documentSerial" allowEditing={false} caption={'شماره فاکتور'} />
                    <Column dataField="amountPay" allowEditing={false} caption={'مبلغ پرداختی(ریال)'} />
                </DataGrid>
            </Row>
        </Card>
      </div>
    );
  }
}

const mapStateToProps=(state)=>({  
    User:state.users,
  });
  
  export default connect(mapStateToProps)(PaymentRequestConfirm);
