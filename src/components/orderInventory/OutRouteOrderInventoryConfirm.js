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

import UpdateIcon from "../../assets/images/icon/update.png";
import ConfirmIcon from "../../assets/images/icon/confirm.png";
import RejectIcon from "../../assets/images/icon/reject2.png";


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
    if(this.state.stateEnable_show)
      this.setState({
          OrderInventoryGridData: await orderIventoryOutRouteList(this.props.User.token),
          stateShowRoute:true,
      })
  }

  grdOrderPointInventory_onRowUpdating = async (params) => {
    let FirstVal = 1;
    console.log("Old Data=" + JSON.stringify(params.oldData));
    console.log("New Data=" + JSON.stringify(params.newData));
    let tempOrderPointInventoryEdited = this.state.OrderPointInventoryEdited;  

    let flagEditRowCount = false;   

    let flagPush = true;
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

    let FlagError = true;
    let errMsg = "";    
    if (
      params.newData.orderUser > 0 &&
      params.newData.orderUser % params.oldData.itemsPerPack !== 0 &&
      params.newData.orderUser % params.oldData.itemsPerPack2 !== 0
    ) {
      FlagError = false;      
      errMsg += "\nکاربر گرامی عدد سفارش باید مضربی از تعداد در بسته باشد.";
    }
    if (params.newData.orderUser < 0) {
      FlagError = false;      
      errMsg += "\n کاربر گرامی عدد سفارش باید بزرگتر یا مساوی با 0 باشد.";
    }
    
    if (flagPush)
      if (FlagError) {
        // alert( params.oldData.orderUser)
        
        let obj = {
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
    this.OpenCloseWait();
    alert(JSON.stringify(this.state.OrderPointInventoryEdited))
    await updateGroupsOrderPointInventory(
      this.state.OrderPointInventoryEdited,
      this.props.User.token
    );
    this.setState({
      ToastProps: {
        isToastVisible: true,
        Message: ",ویرایش با موفقیت انجام گردید.",
        Type: "success",
      },
    });
    this.OpenCloseWait();
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
  });
  
export default connect(mapStateToProps)(OutRouteOrderInventoryConfirm);
