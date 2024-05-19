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
import SelectBox from "devextreme-react/select-box";
import TagBox from "devextreme-react/tag-box";
import { Button } from "devextreme-react/button";
import { CheckBox } from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import { Toast } from "devextreme-react/toast";
import { Tooltip } from "devextreme-react/tooltip";
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
  Export
} from "devextreme-react/data-grid";

import Wait from "../common/Wait";
import OrderInventoryNew from "./OrderInventoryNew";
import OrderInventoryNewGroup from "./OrderInventoryNewGroup";
import OrderInventoryLogs from './OrderInventoryLogs'

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

import { itemActions } from "../../redux/reducers/item/item-slice";
import { logsOrderPointInventoryActions } from "../../redux/reducers/logsOrderPointInventory/logsOrderPointInventory-slice";
import { locationActions } from "../../redux/reducers/location/location-slice";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { inventoryActions } from "../../redux/reducers/inventory/inventory-slice";
import { remainOfEditZeroOPIByLocationUser,remainOfEditOPIByLocationUser } from "../../redux/reducers/OrderPointInventory/orderPointInventory-actions";

import {
  itemListCombo,
  itemListComboBySupplierId,
} from "../../redux/reducers/item/item-action";
import { supplierOrderInventoryComboList } from "../../redux/reducers/supplier/supplier-action";
import { locationListOrderInventoryCombo } from "../../redux/reducers/location/location-actions";
import { companyListCombo } from "../../redux/reducers/company/company-actions";
import {
  orderPintInventoryListByLSI,
  updateGroupsOrderPointInventory,
} from "../../redux/reducers/OrderPointInventory/orderPointInventory-actions";
import {
  logsOPITodayListByUserId,
  logsOPIByOPIid,
} from "../../redux/reducers/logsOrderPointInventory/logsOrderPointInventory-actions";
import { inventoryComboListByCompanyId } from "../../redux/reducers/inventory/inventory-actions";

import {
  Gfn_BuildValueComboMulti,
  Gfn_ConvertComboForAll,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";

import { DataGridOrderPointInventoryColumns } from "./OrderInventory-config";
import { orderPointInventoryActions } from "../../redux/reducers/OrderPointInventory/orderPointInventory-slice";

import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";
import UpdateIcon from "../../assets/images/icon/update.png";

class OrderInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateWait: false,
      cmbLocationGroupValue: null,
      cmbLocation: null,
      cmbLocationValue: null,
      cmbSupplier: null,
      cmbInventory: null,
      cmbInventoryvalue: null,
      cmbSupplierValue: null,
      cmbItems: null,
      cmItemsOrg: null,
      cmbItemsValue: null,
      OrderInventoryGridData: null,
      OrderPointInventoryEdited: [],
      allLogsOrderPointInventory: [],
      stateShowRoute: false,
      stateUpdateDelete: true,
      stateEnable_btnAdd: false,
      stateEnable_btnAddGroup: false,
      stateEnable_btnUpdate: false,
      stateEnable_show: false,
      stateModal_OrderInventoryNew: false,
      stateModal_OrderInventoryNewGroup: false,
      stateModal_LogsOfOPI: false,
      isOutRoute: false,
      ToastProps: {
        isToastVisible: false,
        Message: "",
        Type: "",
      },
    };
  }

  async componentDidMount() {
    await this.fn_GetPermissions();
    await this.fn_CheckRequireState();
    // alert('CompanyId='+this.props.Company.currentCompanyId)
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "orders_inventory.update":
            this.setState({ stateEnable_btnUpdate: true });
            break;
          case "orders_inventory.insert":
            this.setState({ stateEnable_btnAdd: true });
            break;
          case "orders_inventory.insert_group":
            this.setState({ stateEnable_btnAddGroup: true });
            break;
          case "orders_inventory.show":
            this.setState({ stateEnable_show: true });
            break;
        }
      }
  };

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  fn_CheckRequireState = async () => {
    if (this.props.Company.currentCompanyId == null) {
      const companyCombo = await companyListCombo(this.props.User.token);
      if (companyCombo !== null) {
        const currentCompanyId = companyCombo[0].id;
        this.props.dispatch(
          companyActions.setCurrentCompanyId({
            currentCompanyId,
          })
        );
      }
      this.props.dispatch(
        companyActions.setCompanyCombo({
          companyCombo,
        })
      );
    }

    const locationPermission = await locationListOrderInventoryCombo(
      this.props.Company.currentCompanyId,
      this.props.User.token
    );

    this.props.dispatch(
      locationActions.setLocationPermission({
        locationPermission
      })
    );

    const INV_REQ_OBJ = {
      companyId: this.props.Company.currentCompanyId,
      inventoryTypeCode: '01'
    }
    const inventoryCombo = await inventoryComboListByCompanyId(INV_REQ_OBJ, this.props.User.token);
    this.props.dispatch(inventoryActions.setInventoryCombo({ inventoryCombo }));

    this.setState({
      cmbSupplier: await supplierOrderInventoryComboList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
      cmbInventory: inventoryCombo
    });
  };

  cmbRetailStoreGroup_onChange = async (e) => {
    const IDS = e.toString().split(",");
    const TEMP_LocationGroup = this.props.Location.locationPermission;
    if (IDS.includes('0'))
      this.setState({
        cmbLocation: TEMP_LocationGroup,
        cmbLocationGroupValue: 0,
      });
    else {
      let tempLocation = [];
      for (let i = 0; i < IDS.length; i++)
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
          if (IDS[i] == TEMP_LocationGroup[j].id)
            tempLocation.push(TEMP_LocationGroup[j]);
      this.setState({
        cmbLocation: tempLocation,
        cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
      });
    }
  };

  cmbRetailStore_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbLocation)
    this.setState({ cmbLocationValue: await Gfn_BuildValueComboMulti(data) });
  };

  cmbInventory_onChange = async (e) => {
    this.setState({ cmbInventoryvalue: e });
  }

  cmbSupplier_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbSupplier)
    const TEMP_cmbSupplier = await Gfn_BuildValueComboMulti(data)

    this.setState({
      cmbSupplierValue: TEMP_cmbSupplier,
      // cmbItems: TEMP_cmbSupplier == null? null: await itemListComboBySupplierId(TEMP_cmbSupplier,this.props.User.token),      
    });
    const ITEMS = TEMP_cmbSupplier == null ? null : await itemListComboBySupplierId(TEMP_cmbSupplier, this.props.User.token);
    const LAZY = new DataSource({
      store: ITEMS,
      paginate: true,
      pageSize: 10
    })
    this.setState({
      cmbItems: LAZY,
      cmbItemsOrg: ITEMS
    })
  };

  cmbItem_onChange = async (e) => {
    let data = await Gfn_ConvertComboForAll(e, this.state.cmbItemsOrg)
    this.setState({
      cmbItemsValue: await Gfn_BuildValueComboMulti(data),
    });
  };

  btnSearch_onClick = async () => {
    let flagSend = true;
    document.getElementById("errLocation").innerHTML = "";
    document.getElementById("errItem").innerHTML = "";
    document.getElementById("errSupplier").innerHTML = "";
    document.getElementById("errInventory").innerHTML = "";
    if (this.state.cmbLocationValue === null || this.state.cmbLocationValue == "") {
      const msg = "فروشگاه را انتخاب نمائید.";
      document.getElementById("errLocation").innerHTML = msg;
      flagSend = false;
    }

    if (this.state.cmbItemsValue === null || this.state.cmbItemsValue == "") {
      const msg = "کالا را انتخاب نمائید.";
      document.getElementById("errItem").innerHTML = msg;
      flagSend = false;
    }

    if (this.state.cmbSupplierValue === null || this.state.cmbSupplierValue == "") {
      const msg = "تامین کننده را انتخاب نمائید.";
      document.getElementById("errSupplier").innerHTML = msg;
      flagSend = false;
    }

    if (this.state.cmbInventoryvalue === null || this.state.cmbInventoryvalue == "") {
      const msg = " انبار را انتخاب نمائید.";
      document.getElementById("errInventory").innerHTML = msg;
      flagSend = false;
    }

    if (flagSend) {
      this.OpenCloseWait();
      const OBJ = {
        locationIds: this.state.cmbLocationValue,
        supplierIds: this.state.cmbSupplierValue,
        itemIds: this.state.cmbItemsValue,
        inventoryId: this.state.cmbInventoryvalue,
      };
      // alert(JSON.stringify(OBJ))
      this.setState({
        OrderInventoryGridData: await orderPintInventoryListByLSI(
          OBJ,
          this.props.User.token
        ),
      });

      this.fn_SetLogsOrderPointInventory();
      this.OpenCloseWait();
    }

  };

  fn_SetLogsOrderPointInventory = async () => {
    const AllLogsOrderPointInventory = await logsOPITodayListByUserId(
      this.props.User.userId,
      this.props.User.token
    );
    this.props.dispatch(
      logsOrderPointInventoryActions.setLogsOrderPointInventory({
        AllLogsOrderPointInventory,
      })
    );
  };

  grdOrderPointInventory_onRowPrepared = (e) => {
    if (e.rowType === "data" && e.data.orderUser !== null)
      e.rowElement.style.backgroundColor = "#60c77f";
  };

  grdOrderPointInventory_onRowUpdating = async (params) => {
    let FirstVal = 1;
    console.log("Old Data=" + JSON.stringify(params.oldData));
    console.log("New Data=" + JSON.stringify(params.newData));
    let tempOrderPointInventoryEdited = this.state.OrderPointInventoryEdited;

    let Logs = this.props.LogsOrderPointInventory.AllLogsOrderPointInventory;

    let flagEditRowCount = false;
    if (Logs == null) Logs = [];
    for (let i = 0; i < Logs.length; i++)
      if (Logs[i].orderPointInventoryId == params.oldData.id) {
        flagEditRowCount = true;
        // alert('edit row cont permited')
      }
   
    // alert('edited='+tempOrderPointInventoryEdited.length+
    //         '\nMaxEdit='+AuthOBJ.orderInventoryEditRowCount+
    //         '\nRelaLogs='+(this.state.RealLogs).length)

    let FlagError = true;
    let flagCount=true;
    let errMsg = "";
    // ------------------------------------------------    
    // const OBJ_COUNT={
    //   LocationId:params.oldData.locationId
    // }
    // const REMAIN_EDITORDER = await remainOfEditOPIByLocationUser(OBJ_COUNT,this.props.User.token);    
    // // const REMAIN_ZEROORDER = await remainOfEditZeroOPIByLocationUser(OBJ_COUNT,this.props.User.token);
    
    // if (tempOrderPointInventoryEdited.length >= REMAIN_EDITORDER && !flagEditRowCount) {
    //   flagCount = false;
    //   errMsg += "کاربر گرامی ظرفیت ویرایش سفارشات فروشگاه تکمیل شده است";
    // }
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

  grdOrderPointInventory_onCellDblClick = async (e) => {
    const LogsOfOPI = await logsOPIByOPIid(e.data.id, this.props.User.token);
    this.props.dispatch(
      logsOrderPointInventoryActions.setLogsOrderPointInventoryByOPIid({
        LogsOfOPI,
      })
    );
    this.setState({ stateModal_LogsOfOPI: true })
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

  btnNew_onClick = () => {
    this.setState({
      stateModal_OrderInventoryNew: true,
      isOutRoute: false,
    });
  };

  btnNewOutRoute_onClick = () => {
    this.setState({
      stateModal_OrderInventoryNew: true,
      isOutRoute: true,
    });
  }
  ModalOrderInventoryNew_onClickAway = () => {
    this.setState({ stateModal_OrderInventoryNew: false });
  };

  ModalOrderInventoryLogs_onClickAway = () => {
    this.setState({ stateModal_LogsOfOPI: false });
  };


  btnNewGroup_onClick = () => {
    this.setState({ stateModal_OrderInventoryNewGroup: true });
  };
  ModalOrderInventoryNewGroup_onClickAway = () => {
    this.setState({ stateModal_OrderInventoryNewGroup: false });
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

  btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(this.state.OrderInventoryGridData, "OrderInventory")
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
              <Label>سفارش از انبار</Label>
            </Row>
            <Row>
              <Col>
                <Label className="standardLabelFont">گروه فروشگاه</Label>
                <TagBox
                  dataSource={this.props.Location.locationPermission}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="گروه فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStoreGroup_onChange}
                  className="fontStyle"
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">فروشگاه</Label>
                <TagBox
                  dataSource={this.state.cmbLocation}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="فروشگاه"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbRetailStore_onChange}
                  className="fontStyle"
                />
                <Label id="errLocation" className="standardLabelFont errMessage" />
              </Col>
              <Col>
                <Label className="standardLabelFont">انبار</Label>
                <SelectBox
                  dataSource={this.state.cmbInventory}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="انبار"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbInventory_onChange}
                  className="fontStyle"
                />
                <Label id="errInventory" className="standardLabelFont errMessage" />
              </Col>
              <Col>
                <Label className="standardLabelFont">تامین کننده</Label>
                <TagBox
                  dataSource={this.state.cmbSupplier}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="تامین کننده"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbSupplier_onChange}
                  className="fontStyle"
                />
                <Label id="errSupplier" className="standardLabelFont errMessage" />
              </Col>
              <Col>
                <Label className="standardLabelFont">کالا</Label>
                <Suspense fallback={<div>Loading</div>}>
                  <TagBox
                    dataSource={this.state.cmbItems}
                    searchEnabled={true}
                    displayExpr="label"
                    placeholder="کالا"
                    valueExpr="id"
                    rtlEnabled={true}
                    onValueChange={this.cmbItem_onChange}
                    className="fontStyle"
                  />
                </Suspense>
                <Label id="errItem" className="standardLabelFont errMessage" />
              </Col>
            </Row>
            {this.state.stateEnable_show && (
              <Row className="standardSpaceTop">
                <Col xs="auto">
                  <Button
                    icon={SearchIcon}
                    text="جستجو"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnSearch_onClick}
                    className="fontStyle"
                  />
                </Col>
              </Row>
            )}
          </Row>
        </Card>
        <p></p>
        <Card className="shadow bg-white border pointer">
          <Row className="standardPadding">
            <Row>
              <Label className="title">لیست سفارشات از انبار</Label>
            </Row>
            {this.state.stateEnable_btnAdd && (
              <Row>
                <Col xs="auto" className="standardMarginRight">                  
                  <Button
                    icon={PlusNewIcon}
                    text="سفارش جدید"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnNew_onClick}
                    className="fontStyle"
                  />
                </Col>
                {this.state.stateEnable_btnAddGroup && (
                  <Col xs="auto" className="standardMarginRight">                    
                    <Button
                      icon={PlusNewIcon}
                      className="fontStyle"
                      text="سفارش جدید گروهی"
                      type="default"
                      stylingMode="contained"
                      rtlEnabled={true}
                      onClick={this.btnNewGroup_onClick}
                    />
                  </Col>
                )}
                <Col xs="auto" className="standardMarginRight">
                  <Button
                    icon={PlusNewIcon}
                    text="سفارش خارج از برنامه"
                    type="default"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnNewOutRoute_onClick}
                    className="fontStyle"
                  />
                </Col>
              </Row>
            )}
            <Row style={{ direction: 'ltr' }}>
              <Col xs="auto">
                <Button
                  icon={ExportExcelIcon}
                  type="default"
                  stylingMode="contained"
                  rtlEnabled={true}
                  onClick={this.btnExportExcel_onClick}
                />
              </Col>
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
                  height={DataGridDefaultHeight}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
                  onRowUpdating={this.grdOrderPointInventory_onRowUpdating}
                  onCellDblClick={this.grdOrderPointInventory_onCellDblClick}
                  onRowPrepared={this.grdOrderPointInventory_onRowPrepared}
                //   onSelectionChanged={
                //     this.grdOrderPointInventory_onSelectionChanged
                //   }
                  className="fontStyle"
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
                  <HeaderFilter visible={true} />
                </DataGrid>
              </Col>
            </Row>
            {this.state.stateEnable_btnUpdate && (
              <Row>
                <Col xs="auto" className="standardMarginRight">
                  <Button
                    icon={UpdateIcon}
                    text="ذخیره تغییرات"
                    type="success"
                    stylingMode="contained"
                    rtlEnabled={true}
                    onClick={this.btnUpdateOrders_onClick}
                    className="fontStyle"
                  />
                </Col>
              </Row>
            )}
          </Row>
        </Card>


        {this.state.stateModal_LogsOfOPI && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_LogsOfOPI}
                toggle={this.ModalOrderInventoryLogs_onClickAway}
                centered={true}
                size="lg"
                className="fontStyle"
              >
                <ModalHeader>
                  لیست تغییرات سفارش
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      overflowY: "scroll",
                      maxHeight: "450px",
                    }}
                  >
                    <OrderInventoryLogs />
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}

        {this.state.stateModal_OrderInventoryNew && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_OrderInventoryNew}
                toggle={this.ModalOrderInventoryNew_onClickAway}
                centered={true}
                size="lg"
                className="fontStyle"
              >
                <ModalHeader>
                  ثبت سفارش
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      // overflowY: "scroll",
                      maxHeight: "450px",
                    }}
                  >
                    <OrderInventoryNew isOutRoute={this.state.isOutRoute} />
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}

        {this.state.stateModal_OrderInventoryNewGroup && (
          <Row className="text-center">
            <Col>
              <Modal
                isOpen={this.state.stateModal_OrderInventoryNewGroup}
                toggle={this.ModalOrderInventoryNewGroup_onClickAway}
                centered={true}
                dir="rtl"
                size="xl"
                className="fontStyle"
              >
                <ModalHeader>
                  ثبت سفارش گروهی
                </ModalHeader>
                <ModalBody>
                  <Row
                    className="standardPadding"
                    style={{
                      // overflowY: "scroll",
                      maxHeight: "750px",
                    }}
                  >
                    <OrderInventoryNewGroup />
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  User: state.users,
  Location: state.locations,
  Supplier: state.suppliers,
  Item: state.items,
  Company: state.companies,
  OrderPointInventory: state.orderPointInventories,
  LogsOrderPointInventory: state.logsOrderPointInventories,
});

export default connect(mapStateToProps)(OrderInventory);
