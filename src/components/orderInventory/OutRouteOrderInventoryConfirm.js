import React from "react";
import { Toast } from "devextreme-react/toast";
import { connect } from "react-redux";
import { Button } from "devextreme-react/button";
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
import {
  DataGridPageSizes,
  DataGridDefaultPageSize,
  DataGridDefaultHeight,
  ToastTime,
  ToastWidth,
  ALL_MOD,
  CHECK_BOXES_MOD,
  FILTER_BUILDER_POPUP_POSITION,
} from "../../config/config";
import { DataGridOrderPointInventoryColumns } from "./OrderInventory-config";

import Wait from "../common/Wait";

import { orderIventoryOutRouteList,updateGroupsOrderPointInventory,confirmRejectOrderInventoryOutRoute} from "../../redux/reducers/OrderPointInventory/orderPointInventory-actions";
import { logsOPITodayListByUserId } from "../../redux/reducers/logsOrderPointInventory/logsOrderPointInventory-actions";
import { remainOfEditInsertByLocationUser } from "../../redux/reducers/OrderPointInventory/orderPointInventory-actions";

import UpdateIcon from "../../assets/images/icon/update.png";
import ConfirmIcon from "../../assets/images/icon/confirm.png";
import RejectIcon from "../../assets/images/icon/reject2.png";
import SearchIcon from "../../assets/images/icon/search.png";


class OutRouteOrderInventoryConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        stateWait: false,
        stateShowRoute:false,
        OrderInventoryGridData:null,
        stateEnable_btnUpdate: false,
        stateEnable_btnConfirm:false,
        stateEnable_btnReject:false,
        stateEnable_show:false,
        OutRouteSelected:[],
        OrderPointInventoryEdited:[],
      ToastProps: {        
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }
  async componentDidMount(){    
    await this.fn_GetPermissions();
    this.showOrderInventoryOutRoute();
  }


  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "OutRoutOrderPointInventory.update":
            this.setState({ stateEnable_btnUpdate: true });
            break;                   
          case "OutRoutOrderPointInventory.show":
            this.setState({ stateEnable_show: true });
            break;
          case "OutRoutOrderPointInventory.confirm":
            this.setState({ stateEnable_btnConfirm: true });
            break;
          case "OutRoutOrderPointInventory.reject":
            this.setState({ stateEnable_btnReject: true });
            break;
        }
      }
  };


  showOrderInventoryOutRoute=async()=>{
    this.OpenCloseWait();
    if(this.state.stateEnable_show)
      this.setState({
          OrderInventoryGridData: await orderIventoryOutRouteList(this.props.User.token),
          stateShowRoute:true,
      })
    this.OpenCloseWait();
  }

  grdOrderPointInventory_onRowUpdating = async (params) => {
    // let FirstVal = 1;
    // console.log("Old Data=" + JSON.stringify(params.oldData));
    // console.log("New Data=" + JSON.stringify(params.newData));
    // let tempOrderPointInventoryEdited = this.state.OrderPointInventoryEdited;  

    // let flagEditRowCount = false;   

    // let flagPush = true;
    // for (let i = 0; i < tempOrderPointInventoryEdited.length; i++)
    //   if (tempOrderPointInventoryEdited[i].OrderPointInventoryId === params.oldData.id) {
    //     tempOrderPointInventoryEdited[i].OrderValue =
    //       params.newData.orderUser === undefined
    //         ? params.oldData.orderUser
    //         : params.newData.orderUser;
    //     tempOrderPointInventoryEdited[i].Description =
    //       params.newData.description === undefined
    //         ? params.oldData.description
    //         : params.newData.description;
    //     flagPush = false;
    //     break;
    //   }

    // let FlagError = true;
    // let errMsg = "";    
    // if (
    //   params.newData.orderUser > 0 &&
    //   params.newData.orderUser % params.oldData.itemsPerPack !== 0 &&
    //   params.newData.orderUser % params.oldData.itemsPerPack2 !== 0
    // ) {
    //   FlagError = false;      
    //   errMsg += "\nکاربر گرامی عدد سفارش باید مضربی از تعداد در بسته باشد.";
    // }
    // if (params.newData.orderUser < 0) {
    //   FlagError = false;      
    //   errMsg += "\n کاربر گرامی عدد سفارش باید بزرگتر یا مساوی با 0 باشد.";
    // }
    
    // if (flagPush)
    //   if (FlagError) {
    //     // alert( params.oldData.orderUser)
        
    //     let obj = {
    //       UserId: this.props.User.userId,
    //       OrderPointInventoryId: params.oldData.id,
    //       FirstValue:
    //         params.oldData.orderUser == null
    //           ? params.oldData.orderSystem
    //           : params.oldData.orderUser,
    //       OrderValue: params.newData.orderUser,
    //       Description:
    //         params.oldData.description === null
    //           ? ""
    //           : params.oldData.description,
    //     };
    //     tempOrderPointInventoryEdited.push(obj);
    //   } else {
    //     params.cancel = true;
    //     alert(errMsg);
    //   }

    // console.log(
    //   "Edited Params=" + JSON.stringify(tempOrderPointInventoryEdited)
    // );
    // this.setState({
    //   OrderPointInventoryEdited: tempOrderPointInventoryEdited,
    // });
    let FirstVal = 1;
    console.log("Old Data=" + JSON.stringify(params.oldData));
    console.log("New Data=" + JSON.stringify(params.newData));
    let tempOrderPointInventoryEdited = this.state.OrderPointInventoryEdited;   
   
    // alert('edited='+tempOrderPointInventoryEdited.length+
    //         '\nMaxEdit='+AuthOBJ.orderInventoryEditRowCount+
    //         '\nRelaLogs='+(this.state.RealLogs).length)

    let flagEditRowCount = false;  
    let FlagError = true;
    let flagCount=true;
    let errMsg = "";
    // ------------------------------------------------    
    const OBJ_COUNT={
      LocationId:params.oldData.locationId
    }
    const REMAIN_ORDER = await remainOfEditInsertByLocationUser(OBJ_COUNT,this.props.User.token);    
    
    if (tempOrderPointInventoryEdited.length >= REMAIN_ORDER && !flagEditRowCount) {
      flagCount = false;
      errMsg += "کاربر گرامی ظرفیت سفارش گذاری فروشگاه تکمیل شده است";
    }
    // ------------------------------------------------    
    if (
      params.newData.orderUser > 0 &&
      // params.newData.orderUser % params.oldData.itemsPerPack !== 0 &&      
      params.newData.orderUser % (params.oldData.itemsPerPack2==0 ? params.oldData.itemsPerPack : params.oldData.itemsPerPack2) !== 0
    ) {
      FlagError = false;
      // flagEditRowCount = false;
      errMsg += "\nکاربر گرامی عدد سفارش باید مضربی از تعداد در بسته باشد.";
    }
    if (params.newData.orderUser < 0) {
      FlagError = false;
      // flagEditRowCount = false;
      errMsg += "\n کاربر گرامی عدد سفارش باید بزرگتر یا مساوی با 0 باشد.";
    }
    
    let flagPush = true;
    if(FlagError)
      for (let i = 0; i < tempOrderPointInventoryEdited.length; i++)
        if (tempOrderPointInventoryEdited[i].OrderPointInventoryId === params.oldData.id) {
          tempOrderPointInventoryEdited[i].OrderValue =
            params.newData.orderUser === undefined
              ? params.oldData.orderUser
              : params.newData.orderUser;
          tempOrderPointInventoryEdited[i].Description =
            params.newData.description === undefined
              ? params.oldData.description
              : params.newData.description;
          flagPush = false;
          break;
        }


    if (flagPush)
      if(FlagError && (flagCount || flagEditRowCount)){
        let obj = {
          CompanyId: this.props.Company.currentCompanyId,
          UserId: this.props.User.userId,
          OrderPointInventoryId: params.oldData.id,
          FirstValue:
            params.oldData.orderUser == null
              ? params.oldData.orderSystem
              : params.oldData.orderUser,
          OrderValue: params.newData.orderUser,
          Description:
            params.oldData.description === null
              ? ""
              : params.oldData.description,
          OrderSystem: params.oldData.orderSystem,
          ProductId: params.oldData.productId,
          RetailStoreId: params.oldData.retailStoreId,
        };
        tempOrderPointInventoryEdited.push(obj);
      } else {
        params.cancel = true;
        alert(errMsg);
      }

    console.log(
      "Edited Params=" + JSON.stringify(tempOrderPointInventoryEdited)
    );
    this.setState({
      OrderPointInventoryEdited: tempOrderPointInventoryEdited,
    });
  };

  btnUpdateOrders_onClick = async () => {
    if(this.state.OrderPointInventoryEdited.length>0){
      this.OpenCloseWait();    
      const RTN = await updateGroupsOrderPointInventory(
        this.state.OrderPointInventoryEdited,
        this.props.User.token
      );
      let tempOrders = [];
      if (RTN.id != null) {
        this.setState({
          OrderPointInventoryEdited: []
        });


        const ORDER_INV = this.state.OrderInventoryGridData;
        for (let i = 0; i < RTN.id.length; i++)
          for (let j = 0; j < ORDER_INV.length; j++) {
            if (RTN.id[i] == ORDER_INV[j].id)
              tempOrders.push(ORDER_INV[j])
          }
      }
      else {
        tempOrders = this.state.OrderInventoryGridData;
      }      
      this.setState({
        OrderInventoryGridData: tempOrders,
        ToastProps: {
          isToastVisible: true,
          //Message:RTN==1 ? ",ویرایش با موفقیت انجام گردید." : "خطا در ویرایش",
          //Type:RTN==1 ? "success" : "error",
          Message: RTN.id.length==0  ? "ویرایش با موفقیت انجام گردید" :  "تعدادی از سفارشات  ویرایش نشده است، لطفا حد مجاز سفارش را رعایت نمائید.\n."+RTN.messageOfTime,
          Type: RTN.id.length==0 ? "success" : "error",
        },
      });
      this.OpenCloseWait();
    }
    else
      this.setState({        
        ToastProps: {
          isToastVisible: true,
          //Message:RTN==1 ? ",ویرایش با موفقیت انجام گردید." : "خطا در ویرایش",
          //Type:RTN==1 ? "success" : "error",
          Message: "سفارش جهت ویرایش وجود ندارد.",
          Type: "error" ,
        },
      });
  };


  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }
  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };


  grdOrderPointInventory_onSelectionChanged=({ selectedRowKeys, selectedRowsData })=> {
    console.log(JSON.stringify(selectedRowsData))
    let temp = []
    for(let i=0;i<selectedRowsData.length;i++){
        let obj = { value: selectedRowsData[i].id }
        temp.push(obj)
    }        
    this.setState({ OutRouteSelected: temp})
  }

  btnConfirmOutRoute_onClick=async () =>{    
    const OBJ={
      values: JSON.stringify(this.state.OutRouteSelected),
      status:true      
    }    
    alert(JSON.stringify(OBJ))
    await confirmRejectOrderInventoryOutRoute(OBJ,this.props.User.token)
  }

  btnRejectOutRoute_onClick=async()=>{
    const OBJ={
      values: JSON.stringify(this.state.OutRouteSelected),
      status:false
    }
    await confirmRejectOrderInventoryOutRoute(OBJ,this.props.User.token)
  }

  btnSearch_onClick=async()=>{
    this.showOrderInventoryOutRoute();
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
            <Row>
              <Label className="title">تائید سفارشات خارج از مسیر</Label>
            </Row>            
            <Row className="standardSpaceTop">
              <Col xs="auto" className="standardMarginRight">
                <Row style={{paddingBottom:'10px'}}>
                  <Col xs="auto">
                    <Button
                      icon={SearchIcon}
                      text="مشاهده سفارشات خارج از مسیر"
                      type="default"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnSearch_onClick}
                    />
                  </Col>
                </Row>
                <DataGrid
                  id="grdOrderPointInventory"
                  dataSource={this.state.OrderInventoryGridData}
                  defaultColumns={DataGridOrderPointInventoryColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
                  onRowUpdating={this.grdOrderPointInventory_onRowUpdating}
                  // onCellDblClick={this.grdOrderPointInventory_onCellDblClick}
                  // onRowPrepared={this.grdOrderPointInventory_onRowPrepared}
                  onSelectionChanged={this.grdOrderPointInventory_onSelectionChanged}
                >
                  <Scrolling
                    rowRenderingMode="virtual"
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
                  {this.state.stateShowRoute && (
                    <Selection
                      mode="multiple"
                      selectAllMode={ALL_MOD}
                      showCheckBoxesMode={CHECK_BOXES_MOD}
                    />
                  )}
                  <Editing mode="cell" allowUpdating={true} />
                  <FilterRow visible={true} />
                  {/* <FilterPanel visible={true} />                   */}
                  <HeaderFilter visible={true} />
                </DataGrid>
              </Col>
            </Row>            
            <Row className="standardSpaceTop">      
              {this.state.stateEnable_btnUpdate && (                
                  <Col xs="auto" className="standardMarginRight">
                    <Button
                      icon={UpdateIcon}
                      text="ذخیره تغییرات"
                      type="success"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnUpdateOrders_onClick}
                    />
                  </Col>                
              )}      
              {this.state.stateEnable_btnConfirm && (
                <Col xs="auto" className="standardMarginRight">
                  <Button
                    icon={ConfirmIcon}
                    text="تائید سفارشات خارج از مسیر"
                    type="success"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnConfirmOutRoute_onClick}
                  />
                </Col>
              )}
              
              {this.state.stateEnable_btnReject && (
                <Col xs="auto" className="standardMarginRight">
                  <Button
                    icon={RejectIcon}
                    text="رد سفارشات خارج از مسیر"
                    type="danger"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnRejectOutRoute_onClick}
                  />
                </Col>
              )}
              
            </Row>            
          </Row>
        </Card>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
    User: state.users,    
    Company: state.companies,
  });
  
export default connect(mapStateToProps)(OutRouteOrderInventoryConfirm);
