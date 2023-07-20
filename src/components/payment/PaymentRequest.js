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
import { connect } from "react-redux";
import {
  sEPPaymentList,
  addSEPPayment,
  updateSEPPayment,
  ConfirmSEPPaymentAndSendlink,
} from "../../redux/reducers/payment/payment-action";
import { checkPermission } from "../../redux/reducers/user/user-actions";
import Wait from "../common/Wait";
const filterBuilderPopupPosition = {
  of: window,
  at: "top",
  my: "top",
  offset: { y: 10 },
};
class PaymentRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PaymenterName: null,
      PaymenterMobile: null,
      FactorSerial: null,
      FactorAmount: null,
      SEPPayment: null,
      stateWait: false,
      stateUpdateDelete: true,
      RowSelected: null,
      SEPPaymentId: null,
      stateDisable_btnConfirmPaymentRequest:false,
      stateDisable_btnUpdatePaymentRequest:false,
      stateDisable_btnAddSEPPayment:false,
      stateDisable_showSEPPayment:false,
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    this.fn_UpdateSEPPaymentList();       
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
        switch(perm[i].objetName){
          case 'payment.confirm':this.setState({stateDisable_btnConfirmPaymentRequest:true});break;
          case 'payment.update' :this.setState({stateDisable_btnUpdatePaymentRequest:true});break;
          case 'payment.insert' :this.setState({stateDisable_btnAddSEPPayment:true});break;
          case 'payment.show' :this.setState({stateDisable_showSEPPayment:true});break;
        }
      }   
  }

  fn_UpdateSEPPaymentList=async()=>{    
    if(this.state.stateDisable_showSEPPayment)
      this.setState({
        SEPPayment: await sEPPaymentList(1,this.props.User.token),
      });
  }
  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  txtPaymentName_onChange = (params) => {
    this.setState({ PaymenterName: params.target.value });
  };

  txtPaymentMobile_onChange = (params) => {
    this.setState({ PaymenterMobile: params.target.value });
  };

  txtFactorSerial_onChange = (params) => {
    this.setState({ FactorSerial: params.target.value });
  };

  txtFactorAmount_onChange = (params) => {
    this.setState({ FactorAmount: params.target.value });
  };

  btnAddSEPPayment_onClick = async () => {
    const data = {
      userIdInsert: this.props.User.userId,
      payerName: this.state.PaymenterName,
      payerMobile: this.state.PaymenterMobile,
      documentSerial: this.state.FactorSerial,
      amountPay: this.state.FactorAmount,
    };
    await addSEPPayment(data, this.props.User.token);
    this.fn_UpdateSEPPaymentList();
  };

  grdSEPPayment_onClickCell = (params) => {
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
      PaymenterMobile: "",
      FactorSerial: "",
      FactorAmount: "",
      stateUpdateDelete: false,
    });
  };

  btnUpdatePaymentRequest_onClick = async () => {
    let tempSelected = this.state.RowSelected;
    let flag = true;
    let errMSG = "";
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
      this.setState({
        SEPPayment: tempSEPPayment,
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

  render() {       

    return (
      <div className="standardMargin" style={{ direction: "rtl" }}>
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
          <p style={{ padding: "10px" }} className="title">
            درخواست پرداخت آنلاین وجه
          </p>
          <Row style={{ padding: "10px" }}>
            {this.state.stateDisable_btnAddSEPPayment &&
              <Col>
                <Button
                  variant="contained"
                  sx={{ fontFamily: "Tahoma", marginTop: "10px" }}
                  onClick={this.btnNewSEPPayment_onClick}
                >
                  جدید
                </Button>
              </Col>}
          </Row>
          <Row style={{ paddingRight: "10px" }}>
            <Col>
              <Label>نام پرداخت کننده</Label>
              <Input
                type="text"
                value={this.state.PaymenterName}
                onChange={this.txtPaymentName_onChange}
                placeholder="نام پرداخت کننده"
              />
            </Col>
            <Col>
              <Label>موبایل پرداخت کننده</Label>
              <Input
                type="text"
                value={this.state.PaymenterMobile}
                onChange={this.txtPaymentMobile_onChange}
                placeholder="موبایل پرداخت کننده"
              />
            </Col>
            <Col>
              <Label>شماره فاکتور</Label>
              <Input
                type="text"
                value={this.state.FactorSerial}
                onChange={this.txtFactorSerial_onChange}
                placeholder="شماره فاکتور"
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
            </Col>
          </Row>
          {!this.state.stateUpdateDelete ? (
            <Row style={{ padding: "10px", direction: "rtl" }}>
              {this.state.stateDisable_btnAddSEPPayment &&
                <Col xs="auto">
                  <Button
                    variant="contained"
                    sx={{ fontFamily: "Tahoma", marginTop: "10px" }}
                    onClick={this.btnAddSEPPayment_onClick}
                  >
                    ثبت درخواست پرداخت
                  </Button>
                </Col>
              }
            </Row>
          ) : (
            <>
              <Row style={{ padding: "10px", direction: "rtl" }}>
                {this.state.stateDisable_btnUpdatePaymentRequest &&
                    <Col xs="auto">
                      <Button
                        variant="contained"
                        sx={{ fontFamily: "Tahoma", marginTop: "10px" }}
                        onClick={this.btnUpdatePaymentRequest_onClick}
                      >
                        ذخیره تغییرات
                      </Button>
                    </Col>      
                }                
                {this.state.stateDisable_btnConfirmPaymentRequest &&
                    <Col xs="auto">
                      <Button variant="contained"
                          sx={{ fontFamily: 'Tahoma', marginTop: '10px' }}
                          onClick={this.btnConfirmPaymentRequest_onClick}                      
                      >
                          تایید برای پرداخت
                      </Button>
                    </Col> 
                }
              </Row>
              <Row style={{ padding: "10px" }}>
                <Col>
                  <p
                    id="ErrorUpdatePaymentRequest"
                    style={{ textAlign: "right", color: "red" }}
                  ></p>
                </Col>
              </Row>
            </>
          )}
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <p style={{ padding: "10px" }} className="title">
            درخواست های در انتظار تائید
          </p>
          <Row style={{ padding: "10px" }}>
            <DataGrid
              id="gridSEPPayment"
              dataSource={this.state.SEPPayment}
              keyExpr="id"
              allowColumnReordering={true}
              showBorders={true}
              onRowUpdating={this.grdSEPPayment_onRowUpdating}
              onCellClick={this.grdSEPPayment_onClickCell}
              // onCellDblClick={this.onCellDblClick_OrderPointInventory}
              // onRowPrepared={this.onRowPrepared_OrderPointInventory}
              // onSelectionChanged={this.onSelectionChanged}
              rtlEnabled={true}
              allowColumnResizing={true}
              columnAutoWidth={true}
              columnResizingMode="widget"
              height={500}
            >
              <Scrolling
                rowRenderingMode="virtual"
                showScrollbar="always"
                columnRenderingMode="virtual"
              />
              <Editing mode="cell" allowUpdating={true} />
              <FilterRow visible={true} />
              <FilterPanel visible={true} />
              <FilterBuilderPopup position={filterBuilderPopupPosition} />
              <HeaderFilter visible={true} />
              <Column
                dataField="payerName"
                allowEditing={false}
                caption={"نام پرداخت کننده"}
              />
              <Column
                dataField="payerMobile"
                allowEditing={false}
                caption={"موبایل پرداخت کننده"}
              />
              <Column
                dataField="documentSerial"
                allowEditing={false}
                caption={"شماره فاکتور"}
              />
              <Column
                dataField="amountPay"
                allowEditing={false}
                caption={"مبلغ پرداختی(ریال)"}
              />
            </DataGrid>
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
