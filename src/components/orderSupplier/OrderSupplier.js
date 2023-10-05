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
import classnames from "classnames";
import TextBox from "devextreme-react/text-box";
import TextArea from "devextreme-react/text-area";
import SelectBox from "devextreme-react/select-box";
import TagBox from "devextreme-react/tag-box";
import DataSource from "devextreme/data/data_source";
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
} from "devextreme-react/data-grid";

import Wait from "../common/Wait";
import OrderSupplierNew from "./OrderSupplierNew";
import OrderSupplierNewGroup from "./OrderSupplierNewGroup";

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
import { logsOrderPointSupplierActions } from "../../redux/reducers/logsOrderPointSupplier/logsOrderPointSupplier-slice";
import { locationActions } from "../../redux/reducers/location/location-slice";
import { companyActions } from "../../redux/reducers/company/company-slice";
import { companyListCombo } from "../../redux/reducers/company/company-actions";

import {
  itemListCombo,
  itemListComboBySupplierId,
} from "../../redux/reducers/item/item-action";
import { supplierOrderInventoryComboList,
  supplierOrderSupplierComboList } from "../../redux/reducers/supplier/supplier-action";
import { locationOrderSupplierComboListByCompanyId } from "../../redux/reducers/location/location-actions";

import { orderPointSupplierListByLSI,
  updateGroupsOrderPointSupplier } from "../../redux/reducers/orderPointSupplier/orderPointSupplier-actions";

import { logsOPSTodayListByUserId,
  logsOPSByOPSid } from "../../redux/reducers/logsOrderPointSupplier/logsOrderPointSupplier-actions";

import {
  Gfn_BuildValueComboMulti,
  Gfn_BuildValueComboSelectAll,
  Gfn_ExportToExcel,
  Gfn_ConvertComboForAll,
} from "../../utiliy/GlobalMethods";
import { Template } from "devextreme-react";

import {DataGridOrderPointSupplierColumns} from "./OrderSupplier-config"

import SearchIcon from "../../assets/images/icon/search.png";
import PlusNewIcon from "../../assets/images/icon/plus.png";
import UpdateIcon from "../../assets/images/icon/update.png";
import ExportExcelIcon from "../../assets/images/icon/export_excel.png";

class OrderSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateWait: false,      
      cmbLocationGroupValue: null,
      cmbLocation: null,
      cmbLocationValue: null,
      cmbSupplier: null,
      cmbSupplierValue: null,
      cmbItems: null,
      cmbItemsValue: null,
      OrderSupplierGridData: null,
      OrderPointSupplierEdited: [],      
      stateShowRoute: false,
      stateUpdateDelete: true,
      stateEnable_btnAdd: false,
      stateEnable_btnAddGroup: false,
      stateEnable_btnUpdate: false,
      stateEnable_show: false,
      stateModal_OrderSupplierNew: false,
      stateModal_OrderSupplierNewGroup: false,
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
  }

  fn_GetPermissions = () => {
    const perm = this.props.User.permissions;
    if (perm != null)
      for (let i = 0; i < perm.length; i++) {
        switch (perm[i].objectName) {
          case "orders_supplier.update":
            this.setState({ stateEnable_btnUpdate: true });
            break;
          case "orders_supplier.insert":
            this.setState({ stateEnable_btnAdd: true });
            break;
          case "orders_supplier.insert_group":
            this.setState({ stateEnable_btnAddGroup: true });
            break;
          case "orders_supplier.show":
            this.setState({ stateEnable_show: true });
            break;
        }
      }
  };

  OpenCloseWait() {
    this.setState({ stateWait: !this.state.stateWait });
  }

  fn_CheckRequireState = async () => {
    if(this.props.Company.currentCompanyId==null){
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

    const locationPermission = await locationOrderSupplierComboListByCompanyId(
      this.props.Company.currentCompanyId,
      this.props.User.token
    );

    this.props.dispatch(
      locationActions.setLocationPermission({
        locationPermission      
      })
    );

    this.setState({      
      cmbSupplier: await supplierOrderSupplierComboList(
        this.props.Company.currentCompanyId,
        this.props.User.token
      ),
    });
  };

  cmbRetailStoreGroup_onChange = async (e) => {
    const IDS = e.toString().split(",");    
    const TEMP_LocationGroup = this.props.Location.locationPermission;
    if(IDS.includes('0'))
      this.setState({
        cmbLocation:  TEMP_LocationGroup,
        cmbLocationGroupValue: 0,
      });
    else{
      let tempLocation = [];
      for (let i = 0; i < IDS.length; i++)
        for (let j = 0; j < TEMP_LocationGroup.length; j++)
          if (IDS[i] == TEMP_LocationGroup[j].id)
            tempLocation.push(TEMP_LocationGroup[j]);
      this.setState({
        cmbLocation:  tempLocation,
        cmbLocationGroupValue: await Gfn_BuildValueComboMulti(e),
      });
    }
   
  };

  cmbRetailStore_onChange = async (e) => {    
    let data=await Gfn_ConvertComboForAll(e,this.state.cmbLocation)  
    // alert(JSON.stringify(data))
    this.setState({ cmbLocationValue: await Gfn_BuildValueComboMulti(data) });
  };

  cmbSupplier_onChange = async (e) => {
    let data=await Gfn_ConvertComboForAll(e,this.state.cmbSupplier)  
    const TEMP_cmbSupplier = await Gfn_BuildValueComboMulti(data)
    
    this.setState({
      cmbSupplierValue: TEMP_cmbSupplier,
      // cmbItems: TEMP_cmbSupplier == null? null: await itemListComboBySupplierId(TEMP_cmbSupplier,this.props.User.token),      
    });
    const ITEMS=TEMP_cmbSupplier == null? null: await itemListComboBySupplierId(TEMP_cmbSupplier,this.props.User.token);
    const LAZY=new DataSource({
      store: ITEMS,
      paginate:true,
      pageSize:10
    })
    this.setState({
      cmbItems:LAZY,
      cmbItemsOrg:ITEMS
    })

    // const TEMP_cmbSupplier =
    //   e == null || e == "" ? null : await Gfn_BuildValueComboMulti(e);
    // // alert(TEMP_cmbSupplier);
    // this.setState({
    //   cmbSupplierValue: TEMP_cmbSupplier,
    //   cmbItems:
    //     TEMP_cmbSupplier == null
    //       ? null
    //       : await itemListComboBySupplierId(
    //           TEMP_cmbSupplier,
    //           this.props.User.token
    //         ),
    // });
  };

  btnExportExcel_onClick=()=>{
    Gfn_ExportToExcel(this.state.OrderSupplierGridData,"OrderSupplier")
  }

  cmbItem_onChange = async (e) => {
    // this.setState({ cmbItemsValue: await Gfn_BuildValueComboMulti(e) });
    let data=await Gfn_ConvertComboForAll(e,this.state.cmbItemsOrg)
    this.setState({ cmbItemsValue: await Gfn_BuildValueComboMulti(data)});
  };

  btnSearch_onClick = async () => {
    this.OpenCloseWait();
    // let tempLocationGroupValue = this.state.cmbLocationGroupValue;
    // if (
    //   this.state.cmbLocationGroupValue == null ||
    //   this.state.cmbLocationGroupValue == ""
    // ) {
    //   tempLocationGroupValue = await Gfn_BuildValueComboSelectAll(
    //     this.props.Location.locationPermission
    //   );
    //   this.setState({ cmbLocationGroupValue: tempLocationGroupValue });
    // }

    // let tempLocationValue = this.state.cmbLocationValue;
    // if (
    //   this.state.cmbLocationValue == null ||
    //   this.state.cmbLocationValue == ""
    // ) {
    //   tempLocationValue = await Gfn_BuildValueComboSelectAll(
    //     this.state.cmbLocation
    //   );
    //   this.setState({ cmbLocationValue: tempLocationValue });
    // }

    // let tempSupplierValue = this.state.cmbSupplierValue;
    // if (
    //   this.state.cmbSupplierValue == null ||
    //   this.state.cmbSupplierValue == ""
    // ) {
    //   tempSupplierValue = await Gfn_BuildValueComboSelectAll(
    //     this.state.cmbSupplier
    //   );
    //   this.setState({ cmbSupplierValue: tempSupplierValue });
    // }

    // let tempItemValue = this.state.cmbItemsValue;
    // if (this.state.cmbItemsValue == null || this.state.cmbItemsValue == "") {
    //   tempItemValue = await Gfn_BuildValueComboSelectAll(this.state.cmbItems);
    //   this.setState({ cmbItemsValue: tempItemValue });
    // }

    const OBJ = {
      locationIds: this.state.cmbLocationValue,
      supplierIds: this.state.cmbSupplierValue,
      itemIds: this.state.cmbItemsValue,
    };
    alert(JSON.stringify(OBJ))
    this.setState({
      OrderSupplierGridData: await orderPointSupplierListByLSI(
        OBJ,
        this.props.User.token
      ),
    });

    this.fn_SetLogsOrderPointSupplier();

    this.OpenCloseWait();
  };

  fn_SetLogsOrderPointSupplier = async () => {
    const AllLogsOrderPointSupplier = await logsOPSTodayListByUserId(
      this.props.User.userId,
      this.props.User.token
    );
    this.props.dispatch(
      logsOrderPointSupplierActions.setLogsOrderPointSupplier({
        AllLogsOrderPointSupplier,
      })
    );
  };

  grdOrderPointSupplier_onRowPrepared = (e) => {
    if (e.rowType === "data" && e.data.orderUser !== null)
      e.rowElement.style.backgroundColor = "#60c77f";
  };

  grdOrderPointSupplier_onRowUpdating = (params) => {
    let FirstVal = 1;
    console.log("Old Data=" + JSON.stringify(params.oldData));
    console.log("New Data=" + JSON.stringify(params.newData));
    let tempOrderPointSupplierEdited = this.state.OrderPointSupplierEdited;

    let Logs = this.props.LogsOrderPointSupplier.AllLogsOrderPointSupplier;

    let flagEditRowCount = false;
    if (Logs == null) Logs = [];
    for (let i = 0; i < Logs.length; i++)
      if (Logs[i].orderPointSupplierId == params.oldData.id) {
        flagEditRowCount = true;
        // alert('edit row cont permited')
      }

    let flagPush = true;
    for (let i = 0; i < tempOrderPointSupplierEdited.length; i++)
      if (tempOrderPointSupplierEdited[i].OrderPointSupplierId === params.oldData.id) {
        tempOrderPointSupplierEdited[i].OrderValue =
          params.newData.orderUser === undefined
            ? params.oldData.orderUser
            : params.newData.orderUser;
        tempOrderPointSupplierEdited[i].Description =
          params.newData.description === undefined
            ? params.oldData.description
            : params.newData.description;
        flagPush = false;
        break;
      }
    // alert('edited='+tempOrderPointSupplierEdited.length+
    //         '\nMaxEdit='+AuthOBJ.orderSupplierEditRowCount+
    //         '\nRelaLogs='+(this.state.RealLogs).length)

    let FlagError = true;
    let errMsg = "";
    // ------------------------------------------------
    // let tempLocations = this.state.Locations;
    // let tempRemainMaxOrder = 0;
    // for (let i = 0; i < tempLocations.length; i++)
    //   if (tempLocations[i].kyLocationId == params.oldData.retailStoreId)
    //     tempRemainMaxOrder = tempLocations[i].editOrder;

    // if (tempOrderPointSupplierEdited.length >= tempRemainMaxOrder) {
    //   FlagError = false;
    //   errMsg += "کاربر گرامی ظرفیت سفارش گذاری فروشگاه تکمیل شده است";
    // }
    // ------------------------------------------------
    if (
      params.newData.orderUser > 0 &&
      params.newData.orderUser % params.oldData.itemsPerPack !== 0 &&
      params.newData.orderUser % params.oldData.itemsPerPack2 !== 0
    ) {
      FlagError = false;
      flagEditRowCount = false;
      errMsg += "\nکاربر گرامی عدد سفارش باید مضربی از تعداد در بسته باشد.";
    }
    if (params.newData.orderUser < 0) {
      FlagError = false;
      flagEditRowCount = false;
      errMsg += "\n کاربر گرامی عدد سفارش باید بزرگتر یا مساوی با 0 باشد.";
    }
    if (flagPush)
      if (FlagError || flagEditRowCount) {
        let obj = {
          UserId: this.props.User.userId,
          OrderPointSupplierId: params.oldData.id,
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
        tempOrderPointSupplierEdited.push(obj);
      } else {
        params.cancel = true;
        alert(errMsg);
      }

    console.log(
      "Edited Params=" + JSON.stringify(tempOrderPointSupplierEdited)
    );
    this.setState({
      OrderPointSupplierEdited: tempOrderPointSupplierEdited,
    });
  };

  grdOrderPointSupplier_onCellDblClick = async (e) => {
    const LogsOfOPS = await logsOPSByOPSid(e.data.id, this.props.User.token);
    this.props.dispatch(
      logsOrderPointSupplierActions.setLogsOrderPointSupplierByOPSid({
        LogsOfOPS,
      })
    );
  };

  btnUpdateOrders_onClick = async () => {
    this.OpenCloseWait();
    // alert(JSON.stringify(this.state.OrderPointSupplierEdited))
    await updateGroupsOrderPointSupplier(
      this.state.OrderPointSupplierEdited,
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

  btnNew_onClick = () => {
    this.setState({ 
      stateModal_OrderSupplierNew: true,
      isOutRoute:false,
    });
  };

  btnNewOutRoute_onClick=()=>{
    this.setState({ 
      stateModal_OrderSupplierNew: true ,
      isOutRoute:true,
    });
  }

  ModalOrderInventoryNew_onClickAway = () => {
    this.setState({ stateModal_OrderSupplierNew: false });
  };


  btnNewGroup_onClick = () => {
    this.setState({ stateModal_OrderSupplierNewGroup: true });
  };
  ModalOrderInventoryNewGroup_onClickAway = () => {
    this.setState({ stateModal_OrderSupplierNewGroup: false });
  };

  onHidingToast = () => {
    this.setState({ ToastProps: { isToastVisible: false } });
  };

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
              <Label>سفارش از تامین کننده</Label>
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
                />
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
                />
              </Col>
              <Col>
                <Label className="standardLabelFont">کالا</Label>
                <TagBox
                  dataSource={this.state.cmbItems}
                  searchEnabled={true}
                  displayExpr="label"
                  placeholder="کالا"
                  valueExpr="id"
                  rtlEnabled={true}
                  onValueChange={this.cmbItem_onChange}
                />
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
              <Label className="title">لیست سفارشات از تامین کننده</Label>
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
                  />
                </Col>
                {this.state.stateEnable_btnAddGroup && (
                  <Col xs="auto" className="standardMarginRight">
                    <Button
                      icon={PlusNewIcon}
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
                  />
                </Col>
              </Row>
            )}
            <Row style={{direction:'ltr'}}>
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
                  dataSource={this.state.OrderSupplierGridData}
                  defaultColumns={DataGridOrderPointSupplierColumns}
                  keyExpr="id"
                  columnAutoWidth={true}
                  allowColumnReordering={true}
                  showBorders={true}
                  rtlEnabled={true}
                  allowColumnResizing={true}
                  columnResizingMode="widget"
                  onRowUpdating={this.grdOrderPointSupplier_onRowUpdating}
                  onCellDblClick={this.grdOrderPointSupplier_onCellDblClick}
                  onRowPrepared={this.grdOrderPointSupplier_onRowPrepared}                 
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
                  />
                </Col>
              </Row>
            )}
          </Row>
        </Card>

        {this.state.stateModal_OrderSupplierNew && (
          <Row className="text-center">
            <Col>
              <Modal
                style={{ direction: "rtl" }}
                isOpen={this.state.stateModal_OrderSupplierNew}
                toggle={this.ModalOrderInventoryNew_onClickAway}
                centered={true}
                size="lg"
              >
                <ModalHeader toggle={this.ModalOrderInventoryNew_onClickAway}>
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
                    <OrderSupplierNew isOutRoute={this.state.isOutRoute}  />
                  </Row>
                </ModalBody>
              </Modal>
            </Col>
          </Row>
        )}

        {this.state.stateModal_OrderSupplierNewGroup && (
          <Row className="text-center">
            <Col>
              <Modal                
                isOpen={this.state.stateModal_OrderSupplierNewGroup}
                toggle={this.ModalOrderInventoryNewGroup_onClickAway}
                centered={true}    
                dir="rtl"                            
                size="xl"
              >
                <ModalHeader toggle={this.ModalOrderInventoryNewGroup_onClickAway} >
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
                    <OrderSupplierNewGroup />
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
  OrderPointSupplier: state.orderPointSuppliers,
  LogsOrderPointSupplier: state.logsOrderPointSuppliers,
});

export default connect(mapStateToProps)(OrderSupplier);
